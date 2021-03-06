const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session')
const cnst = require('./const');
const router = require('./routes/routes');
const app = express();
const prepareDb = require('./models/db').prepareDb;
const writeEvent = require('./models/db').writeEvent;


// Building and Configuring the server

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

// Setting session 
app.use(session({
    secret: 'NeverStopLearningAndRespectSuggestions',
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

//Auth Verification Middleware
app.use((req, res, next) => {
    //Rremove trailing '/' if present
    let url = req.url.replace(/\/$/, "");
    //Public urls are declared in const.js
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
prepareDb()
    .then((db) => {
        console.log("Database prepared");
        global.db = db;
        app.listen(cnst.PORT, () => {
            console.log(`Server running on Port: ${cnst.PORT}`);
        })
    })
    .catch((err) => {
        console.log("Unable to prepare the dataset");
        console.log(err);
    })

// Saving the system state back to database at certain time interval
setInterval(() => {
    writeEvent.emit("dbCheckpoint", db)
}, cnst.DB_CHECKPOINT_TIME);