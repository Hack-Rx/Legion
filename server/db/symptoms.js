const mongoose= require("mongoose");

const symptoms= new mongoose.Schema({
    name:String,
    type:String,
    isIntensityAvailable:Boolean,
    intensityOptions:[String]
})



module.exports= mongoose.model('symptoms',symptoms);