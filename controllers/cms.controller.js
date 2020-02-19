const cmsService = require('../services/cms.services');
const { validationResult } = require('express-validator');
const UserType = require('../const').UserType;
const ErrorType = require('../const').ERROR_TYPE;

module.exports.renderHome = (req, res) => {
    //Extracting the user from the current session 
    let user = req.session.user;
    cmsService.prepareHomePage(user).then((data) => {
        return res.render('home', data);
    })
}

module.exports.addCourse = (req, res) => {
    //Checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addCourse', { errors: errors.array().map(val => val.msg) })
    }
    // Checking for the permission : --> Only professor and admin can add course
    if (req.session.user.userType === UserType.STUDENT) {
        // Not Authorized
        return res.redirect('/home');
    } else {
        //Input Validation ..done 
        //Permission check ..done
        //Good to go
        //add author to the body: which is current user(not student)
        //preparing the input param for adding the course
        let courseId = req.body.courseId;
        req.body.author = req.session.user.username;
        req.body.isEnabled = true; // Default value as per Course schema
        cmsService.addCourse(req.body)
            .then(() => cmsService.prepareCoursePage(courseId, {
                //additional attributes to prepare the page with Feedback msg
                user: req.session.user,
                successMsg: "Course added Successfully"
            }))
            .then((data) => {
                res.render('course', data);
            })
            .catch((error) => {
                //If any error render page with error
                res.render(res.render('addCourse', { errors: [error] }))
            })
    }
}

module.exports.getCourseDetails = (req, res) => {
    // Check for the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //error in id as params: simply redirecting to home
        return res.redirect('/home');
    }
    //validation success: Extracting courseId
    let courseId = req.params.id;
    //Render the course details in course page
    cmsService.prepareCoursePage(courseId, { user: req.session.user })
        .then((data) => res.render('course', data))
}


module.exports.courseRegister = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //error in id as params: simply redirecting to home
        return res.redirect('/home');
    }
    //validation done: extracting course id
    let courseId = req.params.id;
    let username = req.session.user.username;
    //calling its service
    cmsService.courseRegister(courseId, username)
        .then(() => {
            //adding additional attributes as arguments followed by rendering
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                successMsg: "Course Registerd Successfully"
            }).then((data) => res.render('course', data))
        }).catch((error) => {
            if (error.type == ErrorType.COURSE_PAGE) {
                // Valid Course ID: But Error
                cmsService.prepareCoursePage(courseId, {
                    user: req.session.user,
                    errorMsg: error.msg
                }).then((data) => res.render('course', data))
            } else if (error.type == ErrorType.HOME_PAGE) {
                //Invalid Course ID: Redirect to Home page
                cmsService.prepareHomePage(req.session.user, {
                    errorMsg: error.msg
                })
            }
        })
}


module.exports.courseDeregister = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //error in id as params: simply redirecting to home
        return res.redirect('/home');
    }
    //validation done: extracting course id
    let courseId = req.params.id;
    let username = req.session.user.username;
    //calling its service
    cmsService.courseDeregister(courseId, username)
        .then(() => {
            //adding additional attributes as arguments: Preparing the page
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                successMsg: "Course Deregisterd Successfully"
            }).then((data) => res.render('course', data))
        }).catch((error) => {
            if (error.type == ErrorType.COURSE_PAGE) {
                // Valid Course ID: But Error
                cmsService.prepareCoursePage(courseId, {
                    user: req.session.user,
                    errorMsg: error.msg
                }).then((data) => res.render('course', data))
            } else if (error.type == ErrorType.HOME_PAGE) {
                //Invalid Course ID: Redirect to Home page
                cmsService.prepareHomePage(req.session.user, {
                    errorMsg: error.msg
                })
            }
        })
}


module.exports.deleteCourse = (req, res) => {
    // Check for the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Simply: Redirect to home page
        return res.redirect("/home");
    }
    // Validation success
    let courseId = req.params.id;
    let user = req.session.user;
    cmsService.deleteCourse(courseId)
        .then(() => {
            //Succesfully deleted :prepare Home Page with successMsg
            cmsService.prepareHomePage(user, {
                successMsg: "Course successfully deleted"
            }).then((data) => res.render('home', data))
        }).catch((error) => {
            //If any error occured prepare HomePage with errorMsg
            cmsService.prepareHomePage(user, {
                errorMsg: error
            }).then((data) => res.render('home', data))
        })
}

module.exports.editCourse = (req, res) => {
    if (req.method === "GET") {
        // Check if we have the valid id
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //Simply: Redirect to home page : Invalid Id
            return res.redirect('/home');
        }
        let courseId = req.params.id;
        let user = req.session.user;
        cmsService.getCourseMutation(courseId, user)
            .then((course) => res.render("addCourse", {
                course,
                isEdit: true,
                user
            }))
            .catch((err) => {
                //If id not present in the database or permission error 
                //render home with error
                cmsService.prepareHomePage(user, { errorMsg: err })
                    .then((data) => res.render('home', data))
            })
    }
    if (req.method == "POST") {
        //Handling Form 
        let courseId = req.params.id;
        let user = req.session.user;
        //Checking for validation error
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //Render the form again with, error 
            cmsService.getCourse(courseId)
                .then((course) => res.render("addCourse", {
                    course,
                    isEdit: true,
                    user
                }))
        }
        //Calling its service, to make the changes
        cmsService.courseMutation(courseId, user, req.body)
            .then(() => {
                //Edit Success: prepare course page
                cmsService.prepareCoursePage(courseId, {
                    user: req.session.user,
                    successMsg: "Changes Saved"
                }).then((data) => res.render('course', data))
            }).catch((err) => {
                // if error render the course page with errorMsg
                cmsService.prepareCoursePage(courseId, {
                    user: req.session.user,
                    errorMsg: err
                }).then((data) => res.render('course', data))
            })
    }
}


module.exports.getCourseCollaborations = (req, res) => {
    // Check if we have the valid id
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Simply: Redirect to home page : Invalid Id
        return res.redirect('/home');
    }
    //permission check 
    if (req.session.user === UserType.STUDENT) {
        //Not Authorized: Simply redirect to home with error 
        cmsService.prepareHomePage(req.session.user, {
            errorMsg: "Unauthorized access"
        }).then((data) => res.render('home', data))
    } else {
        //Validation check ...done
        //Permission check ...done 
        let courseId = req.params.id;
        let user = req.session.user;
        cmsService.prepareCollaborationPage(courseId, user)
            .then((data) => res.render('collaboration', data))
            .catch((err) => {
                //courseId does not exists : render home with error
                cmsService.prepareHomePage(req.session.user, {
                    errorMsg: err
                })
            })
    }
}

module.exports.sendCollabRequest = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Simply: Redirect to home page : Invalid Id
        return res.redirect('/home');
    }
    if (req.session.user === UserType.STUDENT) {
        //Not Authorized: Simply redirect to home with error 
        cmsService.prepareHomePage(req.session.user, {
            errorMsg: "Unauthorized access"
        }).then((data) => res.render('home', data))
    } else {
        //Validation check ...done
        //Permission check ...done 
        let courseId = req.params.id;
        let user = req.session.user;
        let sentTo = req.params.username;
        let sentBy = user.username;
        cmsService.sendCollabRequest(courseId, sentTo, sentBy)
            .then(() => {
                cmsService.prepareCollaborationPage(courseId, user, {
                    successMsg: "Invitation for collaboration sent."
                }).then((data) => res.render('collaboration', data))
            })
            .catch((err) => {
                cmsService.prepareCollaborationPage(courseId, user, { errorMsg: err })
                    .then((data) => res.render('collaboration', data))
            })
    }
}

module.exports.acceptCollabRequest = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Simply: Redirect to home page : Invalid Id
        return res.redirect('/home');
    }
    if (req.session.user === UserType.STUDENT) {
        //Not Authorized: Simply redirect to home with error 
        cmsService.prepareHomePage(req.session.user, {
            errorMsg: "Unauthorized access"
        }).then((data) => res.render('home', data))
    } else {
        //Validation check ...done
        //Permission check ...done 
        let courseId = req.params.id;
        let user = req.session.user;
        cmsService.acceptCollabRequest(courseId, user.username)
            .then(() => {
                cmsService.prepareHomePage(user, {
                    successMsg: "Accepted collabration request"
                }).then((data) => res.render('home', data))
            })
            .catch((err) => {
                cmsService.prepareHomePage(user, { errorMsg: err })
                    .then((data) => res.render('home', data))
            })
    }
}
// --------------- 
/* ``
    Happy Coding 
    
    ``
*/