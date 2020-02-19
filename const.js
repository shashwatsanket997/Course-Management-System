// This file contains all the constants for this project

module.exports.PORT = 7000;
module.exports.SESSION_TIME = 1000 * 60 * 60 * 10; //10hrs
module.exports.DB_CHECKPOINT_TIME = 1000 * 60 * 10; //10mins
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

// Enum for Error Redirection
module.exports.ERROR_TYPE = {
    HOME_PAGE: 0,
    COURSE_PAGE: 1
}

//Enum for Invitation Status 
module.exports.INVITE_STATUS = {
    PENDING: 0,
    ACCEPTED: 1
}