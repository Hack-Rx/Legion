const mongoose= require("mongoose");

const report= new mongoose.Schema({
    userId: String,
    date: Date,
    totalRisk: Number,
    symptom:Boolean,
    isRiskGroup: Boolean,
    risk:[{factor:String,riskValue:Number}]
})



module.exports= mongoose.model('report',report);