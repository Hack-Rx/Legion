const mongoose= require("mongoose");

const symptomData= new mongoose.Schema({
    userId: String,
    symptomArray:[{name:String,value:String,intensity:String}],
    date: Date
})


module.exports= mongoose.model('symptomData',symptomData);