const mongoose= require("mongoose");

const symptomDays= new mongoose.Schema({
    userId: String,
    days:[{sId:Number,day:Number,date:Date,isActive:Boolean}],
    symptomDays:Number,
    lastUpdated:Date
})


module.exports= mongoose.model('symptomDays',symptomDays);