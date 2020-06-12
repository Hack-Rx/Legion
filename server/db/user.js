const mongoose= require("mongoose");

const user= new mongoose.Schema({
    fullname:{
        type: String,
        required: 'full name can\'t be empty'
    },
    email:{
        type: String,
        required: 'email can\'t be empty'
    },
    password:{
        type:String,
        required: 'password can\'t be empty'
    },
    saltsecret: String
})


module.exports= mongoose.model('user',user);