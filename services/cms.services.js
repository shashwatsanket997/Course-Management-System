const _ = require('lodash');
var Users = require('../models/Users');
var Courses = require('../models/Courses');
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
            'user': user
        }
        // collect all the enabled courses 
        let courses = _.pickBy(Courses, { isEnabled: true })
        if (user.userType === UserType.STUDENT) {
            //Student page 
            // Find the courses in which the student is rgistered and enabled
            let registeredCourses = [];
            for (id in CourseRegistrations) {
                if ((CourseRegistrations[id].indexOf(user.username) > -1) && Courses[id]['isEnabled']) {
                    registeredCourses.push(Courses[id]);
                }
            }
            //list of non registered courses
            let nonRegCourses = [];
            for (i in courses) {
                // course which is not in registered course
                if (registeredCourses.indexOf(courses[i]) < 0) {
                    nonRegCourses.push(courses[i]);
                }
            }
            data['registeredCourses'] = registeredCourses;
            data['courses'] = nonRegCourses;
            resolve({ ...data, ...attributes });
        }
        if (user.userType === UserType.PROF) {
            //authored courses
            let selfCourses = _.pickBy(Courses, { author: user.username });
            // List of regiestrations to his course
            let registrations = {};
            for (i in selfCourses) {
                registrations[i] = CourseRegistrations[i];
            }
            data['courses'] = courses;
            data['selfCourses'] = selfCourses;
            data['registraions'] = registrations;
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