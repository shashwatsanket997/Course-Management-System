const _ = require('lodash');

module.exports.login = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        //Checking if the user exist with the username provided
        if (!(username in db.Users)) {
            reject("Invalid Username");
        } else {
            //Username exists -> matching the password
            if (password !== db.Users[username]['password']) {
                reject("Invalid Password");
            } else {
                //Username and Password valid : Good to Go
                //Sending user to the controller to create session
                let userObj = {
                    'name': db.Users[username]['name'],
                    'username': username,
                    'userType': db.Users[username]['userType']
                }
                resolve(userObj);
            }
        }
    })
}

module.exports.register = (body) => {
    return new Promise((resolve, reject) => {
        //checking if the username is already taken
        let username = body.username;
        if (username in db.Users) {
            reject("Username already taken");
        } else {
            // Good to go: Inserting the user
            delete body[username];
            db.Users[username] = body
            // Sending user back to the controller to create session
            let userObj = {
                'name': db.Users[username]['name'],
                'username': username,
                'userType': db.Users[username]['userType']
            }
            resolve(userObj);
        }
    })
}



