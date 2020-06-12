const jwt = require('jsonwebtoken');

// function to generate and return jwt token
const generateJWT= (id)=>{
    var token= jwt.sign({_id: id},"secret123",{expiresIn: "45m"});
    return token;
}

module.exports= {generateJWT};