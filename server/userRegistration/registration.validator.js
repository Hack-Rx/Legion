const { body } = require("express-validator");
const { param }= require('express-validator');
const user= require('../db/user');

//validators for request variables
const validators= {
    signUpValidation: [
        body("name").notEmpty(),
        body("email").notEmpty().isEmail().custom(value=>{
            return user.findOne({email:value}).then(user=>{
                if(user){
                    return Promise.reject("E-mail already in use");
                }
            })
        }),
        body("password").notEmpty().isLength({min: 4})
    ],
    logInValidation: [
        body("email").notEmpty().isEmail(),
        body("password").notEmpty().isLength({min: 4})
    ]
}

module.exports= validators;