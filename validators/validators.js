const { check, param } = require('express-validator');
const UserType = require('../const').UserType;

// All the validators are listed here

module.exports.login = [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty()
]

module.exports.register = [
    check('username', 'Username is required').not().isEmpty(),
    check('password', 'Password is required').not().isEmpty(),
    check('username', 'Username should be greater than 3 chars').isLength({ min: 4 }),
    check('password', 'password should be greater than 4 chars').isLength({ min: 4 }),
    check('name', 'Name is required').not().isEmpty(),
    check('userType', 'User Type can be Student, Professor and Admin only')
        .not().isIn([UserType.STUDENT, UserType.PROF, UserType.ADMIN])
]

module.exports.addCourse = [
    check('courseId', 'Course Id is  required').not().isEmpty(),
    check('name', 'Name is required').not().isEmpty(),
    check('duration', 'duration is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('limit', 'Limit is required').not().isEmpty(),
    check('duration', 'Duration must be number').isNumeric(),
    check('limit', 'Limit must be number').isNumeric(),
    check('courseId').custom(courseId => {
        let patt = /[A-Z]{3}[1-9][0-9]{3}/
        return patt.test(courseId)
    }).withMessage("CourseId must follow the format ABC1234")
]

module.exports.validCourseID = [
    param('id').custom(id => {
        let patt = /[A-Z]{3}[1-9][0-9]{3}/
        return patt.test(id)
    }).withMessage("CourseId must follow the format ABC1234")
]

module.exports.editCourse = [
    // As courseId and CourseName cannot be changed
    //Check the valid id in the param
    param('id').custom(id => {
        let patt = /[A-Z]{3}[1-9][0-9]{3}/
        return patt.test(id)
    }).withMessage("CourseId must follow the format ABC1234"),
    check('duration', 'duration is required').not().isEmpty(),
    check('content', 'Content is required').not().isEmpty(),
    check('limit', 'Limit is required').not().isEmpty(),
    check('duration', 'Duration must be number').isNumeric(),
    check('limit', 'Limit must be number').isNumeric(),
]
