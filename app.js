const express = require('express');
const bodyParser = require('body-parser')
const cnst = require('./const');
const router = require('./routes/routes');
const app = express();

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

//Routing the requests
router(app);

//Listen on the port
app.listen(cnst.PORT, () => {
    console.log(`Server running on Port: ${cnst.PORT}`);
})