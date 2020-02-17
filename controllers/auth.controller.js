const { validationResult } = require('express-validator');
const getAuthToken = require('../utils/util').getAuthToken;
const authService = require('../services/auth.services');

module.exports.login = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    // Input Validation done call the service
    authService.login(req.body)
        .then((user) => {
            //create the session
            req.session.user = user;
            // Preparing and rendering the home 
            res.render('home', { user: user })
        })
        .catch((error) => {
            // If Username and Password does not exist 
            res.render('index', { errors: [error] })
        })
}

module.exports.register = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('index', { errors: errors.array().map(val => val.msg) })
    }
    console.log(req.body);
    //Input Validation done calling the controller to create the user 
    authService.register(req.body)
        .then((user) => {
            //user is successfully created --> creating the session
            req.session.user = user;
            res.render('home', { username })
        })
        .catch((error) => {
            res.render('index', { errors: [error] })
        })
}

module.exports.logout = (req, res) => {
    // Deleting the session for the user
    delete req.session.user;
    console.log(req.session.user);
    res.render('index', { message: "Successfully Logout.." })
}