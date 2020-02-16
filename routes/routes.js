// All the routes are listed here
const express = require('express');

/* Route registering convention
    -> All the request for json response will be on /api/*
    -> Else for html rendering will be on BASE route /* 
*/

module.exports = function (app) {
    // Creating separate router for /api
    const apiRoutes = express.Router();

    app.get('/', (req, res) => {
        res.send("Hello CMS");
    })

    apiRoutes.get('/', (req, res) => {
        res.json({
            "body": "This is the api endpoint"
        })
    })

    // Registering api router with the BASE app router
    app.use('/api', apiRoutes);
}

