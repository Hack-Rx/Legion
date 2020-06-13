const express = require('express');
var route = express.Router();

// authentication function
const jwtHelper= require('../auth/jwtHelper');

// functions to handle requests and generate responses
const {
    sendSymptomList,
    addSymptomsData,
    addMedicalData,
    generateReport,
    isMedicalDataAvailable,
    sendRiskData,
    getMedicalData,
    sendSymptomHistory
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

/* route to get medical data of user
method=get */
route.get('/medicalData',jwtHelper.verifyjwttoken,getMedicalData);

/* route to check if medical data is available for user
method=get */
route.get('/isMedicalDataAvailable',jwtHelper.verifyjwttoken,isMedicalDataAvailable);

/* route to send detailed report to the user
method=get */
route.get('/generateReport',jwtHelper.verifyjwttoken,generateReport);

/* rpute to send day wise risk data to user
method=get */
route.get('/riskData',jwtHelper.verifyjwttoken,sendRiskData);

/* route to send day wise symptoms of user
method=get */
route.get('/symptomHistory',jwtHelper.verifyjwttoken,sendSymptomHistory);

module.exports=route;