// This file contains all the constants for this project

module.exports.PORT = 7000;
module.exports.SESSION_TIME = 1000 * 60 * 60 * 10; //10hrs

// An array of public Urls which do not seek authentication
module.exports.publicURLs = [
    '/login',
    '/register',
]

// Enum for UserType
module.exports.UserType = {
    STUDENT: 'student',
    PROF: 'professor',
    ADMIN: 'admin'
}