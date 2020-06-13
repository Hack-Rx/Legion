const { validationResult } = require('express-validator');

//import required database schemas
const symptoms= require('../db/symptoms');
const symptomData= require('../db/symptomData');
const medicalHistory= require('../db/medicalHistory');
const report=require('../db/report');


// import all the required functions
const {
    calculateSymptomsCount,
    calculateIntensity,
    updateDays,
    isRiskAgeGroup,
    isRiskMedicalCondition,
    checkSymptomDaysRisk,
    checkSymptomRisk
}= require('./symptom.services');

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
        await updateDays(req);
        let date= new Date().toISOString().split('T')[0];
        let dt= new Date(date);
        let doc =await symptomData.findOne({userId:req._id,date:dt});
        // if first symptom log of the day
        if(!doc){
            var newData=new symptomData();
            newData.userId=req._id;
            newData.date=dt;
            newData.symptomArray=[];
            newData.seriousSymptoms=await calculateSymptomsCount(req,'serious');
            newData.commonSymptoms=await calculateSymptomsCount(req,'common');
            newData.rareSymptoms=await calculateSymptomsCount(req,'rare');
            newData.commonIntensity=await calculateIntensity(req,'common');
            newData.rareIntensity=await calculateIntensity(req,'rare');
            req.body.forEach(symptomData => {
                var symptom={name:symptomData.name,value:symptomData.value,intensity:symptomData.intensity};
                newData.symptomArray.push(symptom);
            });
            var newdoc =await newData.save();
            res.status(200).send(newdoc);
        }
        // if updated symptom log for the day
        else{
            newSeriousSymptoms=await calculateSymptomsCount(req,'serious');
            newCommonSymptoms=await calculateSymptomsCount(req,'common');
            newRareSymptoms=await calculateSymptomsCount(req,'rare');
            newCommonIntensity=await calculateIntensity(req,'common');
            newRareIntensity=await calculateIntensity(req,'rare');
            var newSymptomArray=[];
            req.body.forEach(symptomData => {
                var symptom={name:symptomData.name,value:symptomData.value,intensity:symptomData.intensity};
                newSymptomArray.push(symptom);
            });
            await symptomData.findOneAndUpdate({userId:req._id,date:dt},{
                symptomArray:newSymptomArray,
                rareSymptoms:newRareSymptoms,
                commonSymptoms:newCommonSymptoms,
                seriousSymptoms:newSeriousSymptoms,
                commonIntensity:newCommonIntensity,
                rareIntensity:newRareIntensity
            });
            var updatedDoc=await symptomData.findById({_id:doc._id});
            res.status(200).send(updatedDoc);
        }
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
}


/*
save user medical data api controller
req = user medical details
res = message:medical data saved succesfully
*/
const addMedicalData =  async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).send({message:"validation error"});
    }
    else{
        try{
            var history= new medicalHistory();
            history.userId= req._id;
            history.age=req.body.age;
            history.smoker=req.body.smoker;
            history.bp= req.body.bp;
            history.diabities=req.body.diabities;
            history.heart=req.body.heart;
            history.lung=req.body.lung;
            history.riskAgeGroup= req.body.age>=65||req.body.age<=5 ? true : false;
            history.riskMedicalCondition= req.body.smoker || req.body.bp || req.body.diabities || req.body.heart || req.body.lung;
            var doc=await history.save();
            res.status(200).send({message:"medical data saved succesfully"});
        }
        catch(err){
            res.status(500).send({message:err.message});
        }
    }
}

/*
user report generate api controller
req = userId
res = risk report for today
*/
const generateReport= async (req,res)=>{
    try{
        let date= new Date().toISOString().split('T')[0];
        let dt= new Date(date);
        let symptomsShown=false;
        let isRiskGroup=false;
        let totalRisk=0;
        risk=[];
        let ageRisk=await isRiskAgeGroup(req._id);
        let medicalRisk=await isRiskMedicalCondition(req._id);
        let daysRisk= await checkSymptomDaysRisk(req._id);
        let symptomRisk=await checkSymptomRisk(req._id);
        if(ageRisk){
            isRiskGroup=true;
            ageRisk.forEach(data => {
                risk.push(data)
            });
        }
        else if(medicalRisk){
            isRiskGroup=true;
            medicalRisk.forEach(data => {
                risk.push(data)
            });
        }
        if(daysRisk)
        daysRisk.forEach(data => {
            risk.push(data)
        });
        if(symptomRisk)
        symptomRisk.forEach(data => {
            risk.push(data);
            symptomsShown=true;
        });
        console.log(risk);
        risk.forEach(data => {
            totalRisk+=data.riskValue;
        });
        var doc=await report.findOne({userId:req._id,date:dt});
        // if first symptom log of the day
        if(!doc){
            let newReport= new report();
            newReport.userId=req._id;
            newReport.date=dt;
            newReport.totalRisk=totalRisk;
            newReport.risk=risk;
            newReport.symptom = symptomsShown?true:false;
            newReport.isRiskGroup= isRiskGroup;
            var savedReport =await newReport.save();
            res.status(200).send(savedReport);
        }
        // updated symptom log 
        else{
            var document = await report.findOneAndUpdate({userId:req._id,date:dt},{
                totalRisk:totalRisk,
                risk:risk,
                symptom: symptomsShown?true:false,
                isRiskGroup: isRiskGroup
            });
            var updatedReport = await report.findOne({_id:document._id});
            res.status(200).send(updatedReport);
        } 
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:err.message});
    }
}

module.exports = {sendSymptomList, addSymptomsData, addMedicalData, generateReport};