const _ = require('lodash');
var Courses = require('../models/Courses');
var Users = require('../models/Users');
var CourseRegistrations = require('../models/CourseRegistration');
const UserType = require('../const').UserType;


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
            resolve();
        }
    })
}


module.exports.prepareHomePage = (user, attributes = {}) => {
    //Here attributes: like successMsg,error Msg, infoMsg ..etc
    // Note: If we have an actual database we can use async/await
    return new Promise((resolve, reject) => {
        let data = {
            'user': user,
            'registrations': CourseRegistrations
        }
        // collect all the enabled courses 
        let courses = _.pickBy(Courses, { isEnabled: true })
        if (user.userType === UserType.STUDENT) {
            //Student page 
            // Find the courses in which the student is rgistered and enabled
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
            // Other courses
            let otherCourses = {};
            for (i in courses) {
                // If the course not in authored courses
                if (!(i in selfCourses))
                    otherCourses[i] = courses[i]
            }

            data['courses'] = otherCourses;
            data['selfCourses'] = selfCourses;
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
        data['registrations'] = CourseRegistrations[courseId]
        resolve({ ...data, ...attributes });
    })
}

module.exports.courseRegister = (courseId, username) => {
    return new Promise((resolve, reject) => {
        //check for the user already registered case
        if (CourseRegistrations[courseId].indexOf(username) >= 0) {
            return reject(" Already registered for the course");
        } else {
            //Check the limit
            if (CourseRegistrations[courseId].length >= Courses[courseId].limit) {
                return reject("Registration limit reached");
            }
            //good to go : Register the user for the course
            CourseRegistrations[courseId].push(username);
            return resolve();
        }
    })
}

module.exports.courseDeregister = (courseId, username) => {
    return new Promise((resolve, reject) => {
        //check for the user not registered case
        let index = CourseRegistrations[courseId].indexOf(username)
        if (index < 0) {
            return reject("Not registered for the course");
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

module.exports.getCourseMutation = (courseId, username) => {
    return new Promise((resolve, reject) => {
        //check for the existance of courseId in Courses 
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        let courseObj = Courses[courseId];
        //Permission check for course edit: Admin and the author has access to edit 
        if (Users[username].userType !== UserType.ADMIN && courseObj.author !== username) {
            return reject("You don't have permission to edit this course");
        }
        //Adding id to the courseObj
        courseObj.courseId = courseId;
        return resolve(courseObj);
    })
}

module.exports.courseMutation = (courseId, username, obj) => {
    return new Promise((resolve, reject) => {
        //check for the existance of courseId in Courses 
        if (!(courseId in Courses)) {
            return reject(`Course with Id ${courseId} does not exists`);
        }
        //Permission check for course edit
        if (Users[username].userType !== UserType.ADMIN && Courses[courseId].author !== username) {
            return reject("You don't have permission to edit this course");
        }
        //Editing the courseObj
        Courses[courseId].duration = obj.duration;
        Courses[courseId].limit = obj.limit;
        Courses[courseId].content = obj.content
        return resolve();
    })
}
