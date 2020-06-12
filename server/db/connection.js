const mongoose = require('mongoose');

const uri = "mongodb+srv://siddb:sids@cluster0-aykzz.mongodb.net/hackRxDb?retryWrites=true&w=majority";

const connectDB = async ()=>{
    try{
        await mongoose.connect(uri,{ useNewUrlParser: true,useUnifiedTopology: true});
        console.log("database connected successfully");
    }
    catch(err){
        console.log("database connection failed");
    }
}

module.exports = connectDB;