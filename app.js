const express = require('express');
const bodyParser = require('body-parser')
const cnst = require('./const');
const router = require('./routes/routes');
const app = express();


// A simple Token-Based Authentication implemented using Vanila Javascript
// All the authentication required urls defined in const.js will
// require a token (16 chars) in their request body
// Token will be allocated upon login, or register followed by internal login
// On Logout the token will be deallocated or removed from the store
// A storage for Session Management basically a hash map with {token : userId}
let sessionStore = {};

// Building and Configuring the server

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}));
// parse application/json
app.use(bodyParser.json());

//Exposing the static files
app.use(express.static(__dirname + '/public'));

//setting the View Engine
app.set('view engine', 'pug');
app.set('views', './views');

//Auth Token Verification Middleware: For A custom Token allocation and session management
app.use((req, res, next) => {
    let token = req.body.token;
    console.log(sessionStore);
    //Rremove trailing '/' if present
    let url = req.url.replace(/\/$/, "");
    //if the url is public, that is no auth required--> simply pass
    if (cnst.authRequiredURLs.indexOf(url) === -1) {
        return next();
    }
    // For auth required urls
    //If token is undefined,null,emptyString
    if (!token) {
        // For JSON response
        if (url.includes('/api')) {
            return res.status(401).json({
                error: "Authentication Token required. Please login..."
            });
        } else {
            return res.redirect('/');
        }
    } else {
        //Token is provided
        // Checking the validity of auth token
        if (!(token in sessionStore)) {
            if (url.includes('/api')) {
                return res.status(400).json({
                    error: "Invalid Authentication Token provided"
                })
            } else {
                return res.redirect('/', { 'error': "Session Expired... Please relogin" })
            }
        } else {
            //Token Present in the Session Store --> Good To Go
            return next();
        }
    }
})

// Making the sessionStore object availble globally 
global.sessionStore = sessionStore;

//Routing the requests
router(app);

//Listen on the port
app.listen(cnst.PORT, () => {
    console.log(`Server running on Port: ${cnst.PORT}`);
})