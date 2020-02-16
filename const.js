// This file contains all the constants for this project

module.exports.PORT = 7000;

// An array of authRequired Urls which requires token validation for access
module.exports.authRequiredURLs = [
    '/api'
]

// Enum for UserType
module.exports.UserType = {
    STUDENT: 'student',
    PROF: 'professor',
    ADMIN: 'admin'
}