const cmsService = require('../services/cms.services');
const { validationResult } = require('express-validator');
const UserType = require('../const').UserType;

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
    // Checking the permission : --> Only professor and admin can add course
    if (req.session.user.userType === UserType.STUDENT) {
        // Not Authorized
        return res.redirect('/home');
    } else {
        //Input Validation ..done, Permission check ..done
        // Good to go
        //add author to the body: which is current user(not student)
        // preparing the input param for adding the course
        let courseId = req.body.courseId;
        req.body.author = req.session.user.username;
        req.body.isEnabled = true; // Default value as per Course schema
        cmsService.addCourse(req.body)
            .then(() => cmsService.prepareCoursePage(courseId,
                {
                    //additional attributes to prepare the page
                    user: req.session.user,
                    successMsg: "Course added Successfully"
                }))
            .then((data) => {
                res.render('course', data);
            })
            .catch((error) => {
                //Render Page with error
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
    //validation success
    let courseId = req.params.id;
    cmsService.prepareCoursePage(courseId, { user: req.session.user }).then((data) => {
        return res.render('course', data);
    })
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
            //adding additional attributes as arguments
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                successMsg: "Course Registerd Successfully"
            }).then((data) => res.render('course', data))
        }).catch((error) => {
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                errorMsg: error
            }).then((data) => res.render('course', data))
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
            //adding additional attributes as arguments: Prepare the page
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                successMsg: "Course Deregisterd Successfully"
            }).then((data) => res.render('course', data))
        }).catch((error) => {
            cmsService.prepareCoursePage(courseId, {
                user: req.session.user,
                errorMsg: error
            }).then((data) => res.render('course', data))
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
            cmsService.prepareHomePage(user,
                { successMsg: "Course successfully deleted" })
                .then((data) => res.render('home', data))
        }).catch((error) => {
            //If any error occured prepare HomePage with errorMsg
            cmsService.prepareHomePage(user,
                { errorMsg: error })
                .then((data) => res.render('home', data))
        })
}

module.exports.editCourse = (req, res) => {
    if (req.method == "GET") {
        // Check if we have the valid id
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //Simply: Redirect to home page : Invalid Id
            return res.redirect("/home");
        }
        let courseId = req.params.id;
        let user = req.session.user;
        cmsService.getCourseMutation(courseId, user.username)
            .then((course) => {
                return res.render("addCourse", {
                    course,
                    isEdit: true,
                    user
                })
            })
            .catch((err) => {
                console.log(err);
                //If id not present in the database: render home with error
                cmsService.prepareHomePage(user, { errorMsg: err })
                    .then((data) => {
                        return res.render('home', data);
                    })
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
                .then((course) => {
                    return res.render("addCourse", {
                        course,
                        isEdit: true,
                        user
                    })
                })
        }
        //Calling its service
        cmsService.courseMutation(courseId, user.username, req.body)
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