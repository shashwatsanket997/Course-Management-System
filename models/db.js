// Implementing Pseudo Database: Refer Documentation for what it is..
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const path = require('path');
const events = require("events");
var eventEmitter = new events.EventEmitter();


let models = {
    Users: path.join(__dirname, 'users.json'),
    Courses: path.join(__dirname, 'courses.json'),
    Collaborations: path.join(__dirname, 'collaborations.json'),
    Invitations: path.join(__dirname, 'invitations.json'),
    CourseRegistrations: path.join(__dirname, 'courseRegistrations.json')
}
//DB functions
let readData = function (models) {
    //Create readFile Promise wrapper for each file name
    let readPromises = {}
    for (model in models) {
        readPromises[model] = readFile(models[model], 'utf-8')
    }
    //Reture Promise that read all the files
    return Promise.all(Object.values(readPromises));
}
let prepareDb = function () {
    let reads = readData(models);
    //Once the Data is loaded return the db with promise
    return reads.then((data) => {
        //parse the data list 
        let parsedData = data.map(val => JSON.parse(val));
        // Returning the db with modelName as key and data is value
        let db = {};
        let modelNames = Object.keys(models)
        for (i in modelNames) {
            db[modelNames[i]] = parsedData[i];
        }
        return db
    })
}

// Saving the data back to json files: 
//that is saving the state of the system
//Using eventemitter: DbCheckPoint Phase of Pseudo Database

eventEmitter.on('dbCheckpoint', function (state) {
    console.log("System State saving....");
    // Important note:
    // Here we are using fs.writeFileSync because inorder 
    // to maintain the consistency of the data we block the main thread
    // by executing synchronous process.
    //Saving Users
    try {
        for (i in state) {
            console.log("Saving...", i);
            let data = JSON.stringify(state[i], null, 2);
            fs.writeFileSync(models[i], data);
        }
    } catch (err) {
        console.log(err); //logging the errors if write error
    }
    console.log("System state saved");
})

//Exporting the eventEmitter object for emitting purpose
module.exports.writeEvent = eventEmitter;
module.exports.prepareDb = prepareDb;
