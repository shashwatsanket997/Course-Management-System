const { validationResult } = require('express-validator');
const authService = require('../services/auth.services');

module.exports.login = (req, res) => {
    // Checking if there is any validation error in req.body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Rendering the errors back to index
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    // Input Validation ..done, call its service
    authService.login(req.body)
        .then((user) => {
            // If login success
            //create the session
            req.session.user = user;
            // Redirecting to home
            res.redirect('/home');
        })
        .catch((error) => {
            // If Username and Password does not exist 
            res.render('index', { errors: [error] })
        })
}

module.exports.register = (req, res) => {
    // Checking if there is any validation error in input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        //Rendering back the errors
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    //Input Validation done, calling the service to create the user 
    authService.register(req.body)
        .then((user) => {
            //user is successfully created --> creating the session
            req.session.user = user; //Internal login
            res.redirect('/home')
        })
        .catch((error) => {
            // For error: re render the index
            res.render('index', { errors: [error] })
        })
}

module.exports.logout = (req, res) => {
    // Deleting the session for the user
    delete req.session.user;
    res.redirect('/login');
}