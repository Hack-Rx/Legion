const mongoose= require("mongoose");

const history= new mongoose.Schema({
    userId:String,
    age:Number,
    smoker:Boolean,
    bp:Boolean,
    diabities: Boolean,
    heart: Boolean,
    lung: Boolean,
    riskAgeGroup: Boolean,
    riskMedicalCondition: Boolean
})



module.exports= mongoose.model('history',history);