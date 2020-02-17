const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const cnst = require('./const');
const router = require('./routes/routes');
const app = express();


// Building and Configuring the server

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

// Setting session 
app.use(session({
    secret: 'NeverStopLearning',
    name: 'cms',
    cookie: {
        maxAge: cnst.SESSION_TIME,
        secure: false,
    },
    resave: false,
    saveUninitialized: true,
}))

//Exposing the static files
app.use(express.static(__dirname + '/public'));

//setting the View Engine
app.set('view engine', 'pug');
app.set('views', './views');

//Auth Token Verification Middleware: For A custom Token allocation and session management
app.use((req, res, next) => {
    //Rremove trailing '/' if present
    let url = req.url.replace(/\/$/, "");
    //if the url is public, that is no auth required--> simply pass
    if (cnst.publicURLs.indexOf(url) > -1) {
        return next();
    }
    // For auth required urls
    // Checking if the session for the user exists or not
    if (!req.session.user) {
        return res.redirect('/login');
    }
    // Session exists: Good to go
    return next();
})

//Routing the requests
router(app);

//Listen on the port
app.listen(cnst.PORT, () => {
    console.log(`Server running on Port: ${cnst.PORT}`);
})