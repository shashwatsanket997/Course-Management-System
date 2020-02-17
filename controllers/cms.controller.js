const cmsService = require('../services/cms.services');
const { validationResult } = require('express-validator');
const UserType = require('../const').UserType;

module.exports.renderHome = (req, res) => {
    //Extracting the user from the current session 
    let user = req.session.user;
    cmsService.prepareHomePage(user).then((data) => {
        return res.render('home', data);
    })
}

module.exports.addCourse = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addCourse', { errors: errors.array().map(val => val.msg) })
    }
    // Checking the permission : --> Only professor and admin can add course
    if (req.session.user.userType === UserType.STUDENT) {
        // Not Authorized
        return res.redirect('/home');
    } else {
        //Input Validation ..done, Permission check ..done
        // Good to go
        //add author to the body
        // preparing the input param for adding the course
        req.body.author = req.session.user.username;
        req.body.isEnabled = true // Default value as per Course schema
        cmsService.addCourse(req.body)
            .then(() => {
                //Resolve and redirect to course page
                res.redirect('/home');
            })
            .catch((error) => {
                //Render Page with error
                res.render(res.render('addCourse', { errors: [error] }))
            })
    }
}

module.exports.deleteCourse = (req, res) => {
    // Check for the validation error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('addCourse', { errors: errors.array().map(val => val.msg) })
    }
    // Validation success

}