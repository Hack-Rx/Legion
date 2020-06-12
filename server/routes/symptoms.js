const express = require('express');
var route = express.Router();

// authentication function
const jwtHelper= require('../auth/jwtHelper');

// functions to handle requests and generate responses
const {
    sendSymptomList,
    addSymptomsData
}= require('../symptoms/symptom.controller');


/* route to send list of all the symptoms to user
method=get */
route.get('/symptomList',jwtHelper.verifyjwttoken,sendSymptomList);

/* route to save symptoms data of user
method=post */
route.post('/addSymptoms',jwtHelper.verifyjwttoken,addSymptomsData);

module.exports=route;