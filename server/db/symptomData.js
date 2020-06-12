const mongoose= require("mongoose");

const symptomData= new mongoose.Schema({
    userId: String,
    symptomArray:[{name:String,value:String,intensity:String}],
    date: Date,
    seriousSymptoms: Number,
    commonSymptoms: Number,
    rareSymptoms: Number,
    commonIntensity: String,
    rareIntensity: String,
})


module.exports= mongoose.model('symptomData',symptomData);