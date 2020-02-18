const { validationResult } = require('express-validator');
const authService = require('../services/auth.services');

module.exports.login = (req, res) => {
    // Checking if there is any validation error in input params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Sending the errors
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    // Input Validation done call the service
    authService.login(req.body)
        .then((user) => {
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
    // Checking if there is any validation error in input params
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    //Input Validation done calling the controller to create the user 
    authService.register(req.body)
        .then((user) => {
            //user is successfully created --> creating the session
            req.session.user = user;
            res.redirect('/home')
        })
        .catch((error) => {
            res.render('index', { errors: [error] })
        })
}

module.exports.logout = (req, res) => {
    // Deleting the session for the user
    delete req.session.user;
    res.redirect('/login');
}