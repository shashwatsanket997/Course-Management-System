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
        //if user already logged in: Redirect to home
        if (req.session.user) {
            return res.redirect('/home');
        }
        //else render login page: which is index
        return res.render('index');
    });

    app.post('/login', validator.login, authController.login);

    app.post('/register', validator.register, authController.register);

    app.get('/logout', authController.logout);
    // ----------- Auth Routes complete

    //Course Management System(cms) routes
    app.get('/home', cmsController.renderHome);

    app.get('/courses/add', (req, res) => {
        let data = { 'user': req.session.user }
        res.render('addCourse', data);
    })

    app.post('/courses/add', validator.addCourse, cmsController.addCourse);


    app.get('/courses/:id', validator.validCourseID, cmsController.getCourseDetails);

    app.get('/courses/:id/edit', validator.validCourseID, cmsController.editCourse)
    // PUT is not present in HTML forms method
    app.post('/courses/:id/edit', validator.editCourse, cmsController.editCourse)

    //As delete is not present in HTML forms: Using post instead
    app.post('/courses/:id/delete', validator.validCourseID, cmsController.deleteCourse);

    app.post('/courses/:id/register', validator.validCourseID, cmsController.courseRegister);

    app.post('/courses/:id/deregister', validator.validCourseID, cmsController.courseDeregister)

    // Collaboration via Invitation system routes

    app.get('/courses/:id/collaborations', validator.validCourseID, cmsController.getCourseCollaborations)

    //send invitation to collaborate
    app.post('/courses/:id/collaborations/:username', validator.validCourseID, cmsController.sendCollabRequest)

    //accept the invitation and collaborate
    app.post('/courses/:id/colaborate', validator.validCourseID, cmsController.acceptCollabRequest)

    // For Non matching urls: redirect to login
    app.get('/*', (req, res) => {
        return res.redirect('/login')
    })

    //-----------
    //API routs
    apiRoutes.get('/', (req, res) => {
        res.status(200).json({
            "body": "This is the api endpoint"
        })
    })

    // Registering api router with the BASE app router
    app.use('/api', apiRoutes);
}

