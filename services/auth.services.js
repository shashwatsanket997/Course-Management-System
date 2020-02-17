const _ = require('lodash');
var Users = require('../models/Users');

module.exports.login = ({ username, password }) => {
    return new Promise((resolve, reject) => {
        //Checking if the user exist with the username provided
        if (!(username in Users)) {
            reject("Invalid Username");
        } else {
            //Username exists -> matching the password
            if (password !== Users[username]['password']) {
                reject("Invalid Password");
            } else {
                //Username and Password valid : Good to Go
                //Sending user to the controller to create session
                let userObj = {
                    'name': Users[username]['name'],
                    'username': username,
                    'userType': Users[username]['userType']
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
        if (username in Users) {
            reject("Username already exists");
        } else {
            // Good to go: Inserting the user
            delete body[username];
            Users[username] = body
            // Sending user to the controller to create session
            let userObj = {
                'name': Users[username]['name'],
                'username': username,
                'userType': Users[username]['userType']
            }
            resolve(userObj);
        }
    })
}



