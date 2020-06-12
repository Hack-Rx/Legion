const express = require('express');
var route = express.Router();

// user registration related validations
const{
    signUpValidation,
    logInValidation
}= require('../userRegistration/registration.validator');

// functions to handle requests and generate responses
const{
    addUser,
    userLogIn,
    sendUserProfile
}= require('../userRegistration/registration.controller');

//user authentication function
const jwtHelper= require('../auth/jwtHelper');

/* route to complete user sign up
method=post */
route.post('/signup',signUpValidation,addUser);

/* route to verify user credantials and generate jwt token and log user in
method=post */
route.post('/signin',logInValidation,userLogIn);

/* route to verify jwt token and send back user profile details
method=get */
route.get('/userProfile',jwtHelper.verifyjwttoken,sendUserProfile);

module.exports=route;