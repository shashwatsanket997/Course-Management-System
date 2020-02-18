const UserType = require('../const').UserType;

// Blueprint for users
/* Since username is primary key
    username: {
        name: String
        password: String 
        userType: enumTupe
    }
*/
// Few Pre-defined users

let Users = {
    "shashwat": {
        "name": "Shashwat",
        "password": "asdf",
        "userType": UserType.STUDENT
    },
    "suyash": {
        "name": "Suyash",
        "password": "asdf",
        "userType": UserType.STUDENT
    },
    "ishu": {
        "name": "Ishu",
        "password": "asdf",
        "userType": UserType.STUDENT
    }
    ,
    "andrew": {
        "name": "Andrew Ng",
        "password": "asdf",
        "userType": UserType.PROF
    },
    "root": {
        "name": "Root",
        "password": "asdf",
        "userType": UserType.PROF
    },
    "admin": {
        "name": "Creator",
        "password": "asdf",
        "userType": UserType.ADMIN
    }
}

module.exports = Users;