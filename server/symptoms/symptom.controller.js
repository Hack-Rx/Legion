//import required database schemas
const symptoms= require('../db/symptoms');
const symptomData= require('../db/symptomData');

/*
symptom list api controller
req = -
res = list of all symptoms
*/
const sendSymptomList= async (req,res)=>{
    try{
        var doc=await symptoms.find();
        res.status(200).send(doc);
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
}

/*
save user symptom data api controller
req = user symptom details
res = list of updated symptoms data
*/
const addSymptomsData= async (req,res)=>{
    try{
        let date= new Date().toISOString().split('T')[0];
        let dt= new Date(date);
        let doc =await symptomData.findOne({userId:req._id,date:dt});
        // if first symptom log of the day
        if(!doc){
            var newData=new symptomData();
            newData.userId=req._id;
            newData.date=dt;
            newData.symptomArray=[];
            req.body.forEach(symptomData => {
                var symptom={name:symptomData.name,value:symptomData.value,intensity:symptomData.intensity};
                newData.symptomArray.push(symptom);
            });
            var newdoc =await newData.save();
            res.status(200).send(newdoc);
        }
        // if updated symptom log for the day
        else{
            var newSymptomArray=[];
            req.body.forEach(symptomData => {
                var symptom={name:symptomData.name,value:symptomData.value,intensity:symptomData.intensity};
                newSymptomArray.push(symptom);
            });
            await symptomData.findOneAndUpdate({userId:req._id,date:dt},{
                symptomArray:newSymptomArray
            });
            var updatedDoc=await symptomData.findById({_id:doc._id});
            res.status(200).send(updatedDoc);
        }
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
}

module.exports = {sendSymptomList, addSymptomsData};