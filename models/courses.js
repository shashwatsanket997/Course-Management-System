// Blueprint of Courses
/*
    Attributes
    1. CourseID [Primary Key] {String} {RegEx : [A-Z]{3}[1-9][0-9]{3} }
    2. Name {String} {min: 4}
    3. isEnabled {Boolean} default: true
    4. duration {Number} in hrs
    5. author {ref username }
    7. limit {Number} {min 5} {allowed null}
    8. content {String} Content of the course     
*/

let Courses = {
    'CSE1001': {
        "name": "Basics of Python",
        "isEnabled": true,
        "duration": 6,
        "author": "root",
        "limit": 30,
        "content": "This is some content related to the course, \
                     It covers the basics of python "
    },
    'CSE1002': {
        "name": "Advance JavaScript",
        "isEnabled": true,
        "duration": 4,
        "author": "root",
        "limit": 30,
        "content": "It covers Callbacks,Closure,Promises,Async/Await, \
                    eventEmitter,fs,paths,multer,express etc."
    },
    'CSE1003': {
        "name": "Machine Learning",
        "isEnabled": true,
        "duration": 12,
        "author": "andrew",
        "limit": 5,
        "content": "It covers Regressions,Classification,Neural Networks, \
                    Come join Let's dive and learn the essence of advance \
                    advance computer science"
    }
}

module.exports = Courses;