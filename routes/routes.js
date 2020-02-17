// All the routes are listed here
const express = require('express');
const authController = require('../controllers/auth.controller');
const cmsController = require('../controllers/cms.controller');
const validator = require('../validators/validators');
/* Route registering convention
    -> All the request for json response will be on /api/*
    -> Else for html rendering will be on BASE route /* 
*/

module.exports = function (app) {
    // Creating separate router for /api
    const apiRoutes = express.Router();

    // Auth Routes 
    //if login | register 
    app.get(['/login', '/register'], (req, res) => {
        //if user already logged in
        if (req.session.user) {
            return res.redirect('/home');
        }
        //else render login page
        return res.render('index');
    });

    app.post('/login', validator.login, authController.login);

    app.post('/register', validator.register, authController.register);

    app.get('/logout', authController.logout);
    // ----------- Auth Routes end

    //Course Management System(cms) routes
    app.get('/home', cmsController.renderHome);

    app.get('/courses/add', (req, res) => {
        let data = { 'user': req.session.user }
        res.render('addCourse', data);
    })
    app.post('/courses/add', validator.addCourse, cmsController.addCourse);

    app.delete('/courses/:id', validator.validCourseID, cmsController.deleteCourse);

    app.get('/*', (req, res) => {
        return res.redirect('/login')
    })

    //-----------
    apiRoutes.get('/', (req, res) => {
        res.json({
            "body": "This is the api endpoint"
        })
    })

    // Registering api router with the BASE app router
    app.use('/api', apiRoutes);
}

