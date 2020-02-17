const { check } = require('express-validator');
const UserType = require('../const').UserType;
module.exports.login = [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Password is required').not().isEmpty()
]

module.exports.register = [
    check('username', 'Username is required').not().isEmpty(),
    check('username', 'Password is required').not().isEmpty(),
    check('username', 'Username should be greater than 3 chars').isLength({ min: 4 }),
    check('password', 'password should be greater than 4 chars').isLength({ min: 4 }),
    check('name', 'Name is required').not().isEmpty(),
    check('userType', 'User Type can be Student, Professor and Admin only')
        .isIn([UserType.STUDENT, UserType.PROF, UserType.ADMIN])
]