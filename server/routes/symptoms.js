const express = require('express');
var route = express.Router();

// authentication function
const jwtHelper= require('../auth/jwtHelper');

// functions to handle requests and generate responses
const {
    sendSymptomList,
    addSymptomsData,
    addMedicalData,
    generateReport
}= require('../symptoms/symptom.controller');

// functions to validate user request data
const {
    medicalDataValidation
}=require('../symptoms/symptom.validator');


/* route to send list of all the symptoms to user
method=get */
route.get('/symptomList',jwtHelper.verifyjwttoken,sendSymptomList);

/* route to save symptoms data of user
method=post */
route.post('/addSymptoms',jwtHelper.verifyjwttoken,addSymptomsData);

/* route to save medical data of user
method=post */
route.post('/medicalData',jwtHelper.verifyjwttoken,medicalDataValidation,addMedicalData);

/* route to send detailed report to the user
method=get */
route.get('/generateReport',jwtHelper.verifyjwttoken,generateReport);

module.exports=route;