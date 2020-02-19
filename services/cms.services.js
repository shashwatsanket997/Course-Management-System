const _ = require('lodash');
var Courses = require('../models/Courses');
var CourseRegistrations = require('../models/CourseRegistration');
var Users = require('../models/Users');
var Collaborations = require('../models/collaborations');
var Invitations = require('../models/invitations');
//ENUMs
const UserType = require('../const').UserType;
const ErrorType = require('../const').ERROR_TYPE;
const InviteStatus = require('../const').INVITE_STATUS;


module.exports.addCourse = (body) => {
    return new Promise((resolve, reject) => {
        let courseId = body.courseId;
        //checking if the courseId already exists or not
        if (courseId in Courses) {
            reject("CourseID already exists");
        } else {
            //else we can add the course
            delete body.courseId;
            Courses[courseId] = body;
            //add an empty entry to the CourseRegistrations
            CourseRegistrations[courseId] = []
            //add an empty entry in Collaborations
            Collaborations[courseId] = []
            resolve();
        }
    })
}


module.exports.prepareHomePage = (user, attributes = {}) => {
    //Here attributes: like successMsg,error Msg, infoMsg ..etc
    //Note: If we have an actual database we can use async/await
    return new Promise((resolve, reject) => {
        let data = {
            'user': user,
            'registrations': CourseRegistrations
        }
        // collect all the enabled courses 
        let courses = _.pickBy(Courses, { isEnabled: true })
        if (user.userType === UserType.STUDENT) {
            //Student page 
            // Find the courses in which the student is rgistered 
            //and enabled
            let registeredCourses = {};
            for (id in CourseRegistrations) {
                if ((CourseRegistrations[id].indexOf(user.username) > -1) && Courses[id]['isEnabled']) {
                    registeredCourses[id] = Courses[id];
                }
            }
            //list of non registered courses
            let nonRegCourses = {};
            for (i in courses) {
                // course which is not in registered course
                if (!(i in registeredCourses)) {
                    nonRegCourses[i] = courses[i];
                }
            }
            data['registeredCourses'] = registeredCourses;
            data['courses'] = nonRegCourses;
            resolve({ ...data, ...attributes });
        }
        if (user.userType === UserType.PROF) {
            //authored courses
            let selfCourses = _.pickBy(Courses, { author: user.username });

            // collaborated courses
            let collaboratedCourses = {}
            for (i in Collaborations) {
                if (Collaborations[i].indexOf(user.username) > -1) {
                    collaboratedCourses[i] = Courses[i];
                }
            }
            // Other courses
            let otherCourses = {};
            for (i in courses) {
                // If the course not in authored courses nor collaboratedCourses
                if (!(i in selfCourses) && !(i in collaboratedCourses))
                    otherCourses[i] = courses[i]
            }

            //get all the invitations for the user
            let invitations = _.filter(Invitations, { 'sentTo': user.username, 'status': InviteStatus.PENDING });

            //get the status of invite sent by the user
            let invites = _.filter(Invitations, { 'sentBy': user.username });
            data['courses'] = otherCourses;
            data['selfCourses'] = selfCourses;
            data['collaboratedCourses'] = collaboratedCourses
            data['invitations'] = invitations;
            data['invites'] = invites;
            resolve({ ...data, ...attributes });
        }
        if (user.userType === UserType.ADMIN) {
            //All the courses
            data['courses'] = courses;
            //All the disabled Courses
            data['disabledCourses'] = _.pickBy(Courses, { 'isEnabled': false });
            resolve({ ...data, ...attributes });
        }
    });
}

module.exports.prepareCoursePage = (courseId, attributes = {}) => {
    return new Promise((resolve, reject) => {
        let data = {
            'course': Courses[courseId]
        }
        //Add id to the course obj
        data['course'].courseId = courseId;
        //Get all the resgitrations for the particular course
        data['registrations'] = CourseRegistrations[courseId];
        //Get the collaborations details 
        data['collaborations'] = Collaborations[courseId];
        resolve({ ...data, ...attributes });
    })
}

module.exports.courseRegister = (courseId, username) => {
    return new Promise((resolve, reject) => {
        // checking if the course with the courseID exists or not
        if (!(courseId in Courses)) {
            // Redirect to Home Page as there is no course id 
            reject({
                msg: `No such course with id ${courseId} exists`,
                type: ErrorType.HOME_PAGE
            });
        }

        //check for the user already registered case
        if (CourseRegistrations[courseId].indexOf(username) >= 0) {
            return reject({
                msg: "Already registered for the course",
                type: ErrorType.COURSE_PAGE
            });
        } else {
            //Check the limit
            if (CourseRegistrations[courseId].length >= Courses[courseId].limit) {
                return reject({
                    msg: "Registration limit reached",
                    type: ErrorType.COURSE_PAGE
                });
            }
            //good to go : Register the user for the course
            CourseRegistrations[courseId].push(username);
            return resolve();
        }
    })
}

module.exports.courseDeregister = (courseId, username) => {
    return new Promise((resolve, reject) => {
        // checking if the course with the courseID exists or not
        if (!(courseId in Courses)) {
            // Redirect to Home Page as there is no course id 
            return reject({
                msg: `No such course with id ${courseId} exists`,
                type: ErrorType.HOME_PAGE
            });
        }
        //check for the user not registered case
        let index = CourseRegistrations[courseId].indexOf(username)
        if (index < 0) {
            return reject({
                msg: "Not registered for the course",
                type: ErrorType.COURSE_PAGE
            });
        } else {
            //good to go : Deregister the user for the course 
            CourseRegistrations[courseId].splice(index, 1);
            return resolve();
        }
    })
}

module.exports.deleteCourse = (courseId) => {
    return new Promise((resolve, reject) => {
        //check if the courseId exists or not
        if (!(courseId in Courses)) {
            return reject(`Course with id ${courseId} does not exist`);
        } else {
            //Exists
            //delete the course
            delete Courses[courseId];
            //delete student registrations with the course
            delete CourseRegistrations[courseId];
            resolve();
        }
    })
}

module.exports.getCourseMutation = (courseId, user) => {
    return new Promise((resolve, reject) => {
        //check for the existance of courseId in Courses 
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        let courseObj = Courses[courseId];
        //Permission check for course edit: Admin,author and collborating Profs has access to edit 
        if (user.userType !== UserType.ADMIN
            && courseObj.author !== user.username
            && Collaborations[courseId].indexOf(user.username) === -1) {
            return reject("You don't have permission to edit this course");
        }
        //Adding id to the courseObj
        courseObj.courseId = courseId;
        return resolve(courseObj);
    })
}

module.exports.courseMutation = (courseId, user, obj) => {
    return new Promise((resolve, reject) => {
        //check for the existance of courseId in Courses 
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        //Permission check for course edit
        if (user.userType !== UserType.ADMIN
            && Courses[courseId].author !== user.username
            && Collaborations[courseId].indexOf(user.username) === -1) {
            return reject("You don't have permission to edit this course");
        }
        //Editing the courseObj
        Courses[courseId].duration = obj.duration;
        Courses[courseId].limit = obj.limit;
        Courses[courseId].content = obj.content
        return resolve();
    })
}

function getRequestStatus(sentTo, courseId, sentBy) {
    // A simple utility to know whether the invitation is sent or not
    let res = _.filter(Invitations, { sentBy, courseId, sentTo })
    if (res.length > 0 && res[0].status === InviteStatus.PENDING) {
        return true;
    }
    return false;
}

module.exports.prepareCollaborationPage = (courseId, user, attributes = {}) => {
    return new Promise((resolve, reject) => {
        //Check if the course exist with the given courseID

        if (!(courseId in Courses)) {
            return reject(`No course with ID ${courseId} exist`);
        }
        //Colaboration Page will contain 
        // List of collaborated profs for the particular courseId 
        // List of all profs not collaborated
        if (!Collaborations[courseId]) {
            //Collaboration is yet not made
            Collaborations[courseId] = [];
        }
        let collaboraters = Collaborations[courseId];
        // For simplicity or limiting the scope of the project:sending username only
        let otherProfs = [];
        for (i in Users) {
            if (Users[i].userType === UserType.PROF //Filtering all the profs
                && i !== user.username // Excluding the current user 
                && collaboraters.indexOf(i) < 0) {  //Not a collaborator for the course
                otherProfs.push(i);
            }
        }
        //Add request status to the other profs
        otherProfs = otherProfs.map(val => {
            return {
                'username': val,
                'isSent': getRequestStatus(val, courseId, user.username)
            }
        });
        let data = {
            user,
            courseId,
            otherProfs,
            collaboraters
        }
        resolve({ ...data, ...attributes });
    })
}

module.exports.sendCollabRequest = (courseId, sentTo, sentBy) => {
    return new Promise((resolve, reject) => {
        //Checking if the course with given id exist
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        //checking if the request is already sent for the given courseId 
        let inviteObj = {
            courseId,
            sentTo,
            sentBy,
            status: InviteStatus.PENDING
        };
        let res = _.filter(Invitations, inviteObj);
        if (res.length > 0) {
            return reject("Request already sent");
        } else {
            //Good to go 
            Invitations.push(inviteObj);
            resolve();
        }
    })
}

module.exports.acceptCollabRequest = (courseId, username) => {
    return new Promise((resolve, reject) => {
        //Checking if the course with given id exist
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        //checking if the request for the given courseId is present or not 
        let inviteObj = {
            courseId,
            sentTo: username,
            status: InviteStatus.PENDING
        };
        let res = _.filter(Invitations, inviteObj);
        if (res.length === 0) {
            return reject(`There is no collaboration request for the course id ${courseId}`);
        } else {
            //Good to go
            //Accept the request
            // Updating the status from PENDING to ACCEPTED
            let index = Invitations.indexOf(res[0]);
            Invitations[index].status = InviteStatus.ACCEPTED;
            //Add the user
            Collaborations[courseId].push(username);
            resolve();
        }
    })
}
