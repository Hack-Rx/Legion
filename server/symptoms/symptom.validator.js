const { body } = require("express-validator");

//validations for request variables
const validator={
    medicalDataValidation:[
        body("age").notEmpty().isNumeric(),
        body("smoker").notEmpty().isBoolean(),
        body("bp").notEmpty().isBoolean(),
        body("diabities").notEmpty().isBoolean(),
        body("heart").notEmpty().isBoolean(),
        body("lung").notEmpty().isBoolean(),
    ]
}

module.exports= validator;