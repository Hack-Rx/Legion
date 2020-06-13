//import required database schemas
const symptomDay= require('../db/symptomDays');
const medicalHistory= require('../db/medicalHistory');
const symptomData= require('../db/symptomData');

// function to count and return total no of symptoms for a particular symptom type
const calculateSymptomsCount = async (req,type)=>{
    var SymptomCount=0;
    req.body.forEach(symptomData => {
        if(symptomData.type==type && symptomData.value==true){
            SymptomCount++;
        }
    });
    return SymptomCount;
}

// function to calculate intensity for a particular symptom type
const calculateIntensity=async (req,type)=>{
    var intensity=null;
    req.body.forEach(symptomData => {
        if(symptomData.type==type && symptomData.value==true && symptomData.intensity=="high"){
            intensity="high";
        }
        if(symptomData.type==type && symptomData.value==true && symptomData.intensity=="medium" && intensity!="high"){
            intensity="medium";
        }
        if(symptomData.type==type && symptomData.value==true && symptomData.intensity=="low" && intensity!="high" && intensity!="medium"){
            intensity="low";
        }
    });
    return intensity;
}

// function to update no of a days for all the symptoms based on new user symptoms
const updateDays=async (req)=>{
    try{
        let date= new Date().toISOString().split('T')[0];
        let dt= new Date(date);
        var doc=await symptomDay.findOne({userId:req._id});
        // if new user
        if(!doc){
            console.log("condition 1");
            var daysData= new symptomDay();
            daysData.userId= req._id;
            daysData.days=[];
            daysData.symptomDays=0;
            daysData.lastUpdated=dt;
            req.body.forEach(symptom => {
                if(symptom.value==true){
                    var newData={
                        sId:symptom.sId,
                        day:1,
                        date:dt,
                        isActive:true
                    }
                    daysData.symptomDays=1;
                    daysData.days.push(newData);
                }
                else{
                    var newData={
                        sId:symptom.sId,
                        day:0,
                        date:dt,
                        isActive:false
                    }
                    daysData.days.push(newData);
                }
            });
            await daysData.save();
        }
        // if first symptom log of the day
        else if(dt-doc.lastUpdated!=0){
            var newDays=(dt-doc.lastUpdated)/1000/60/60/24;
            let newDaysArray=[];
            let newSymptomDays=0;
            req.body.forEach(symptom => {
                let savedSymptom=null;
                doc.days.forEach(data => {
                    if(data.sId==symptom.sId){
                        savedSymptom=data;
                    }
                });
                if(symptom.value==false){
                    if(savedSymptom.isActive==false){
                        var newData={
                            sId:symptom.sId,
                            day:0,
                            date:dt,
                            isActive:false
                        }
                        newDaysArray.push(newData);
                    }else{
                        var newData={
                            sId:symptom.sId,
                            day:newDays>2?0:savedSymptom.day+newDays,
                            date:dt,
                            isActive:false
                        }
                        newDaysArray.push(newData);
                    }
                }else{
                    if(savedSymptom.isActive==false){
                        var newData={
                            sId:symptom.sId,
                            day:1,
                            date:dt,
                            isActive:true
                        }
                        newSymptomDays=newSymptomDays==0?1:newSymptomDays;
                        newDaysArray.push(newData);
                    }else{
                        var newData={
                            sId:symptom.sId,
                            day:newDays>2?1:savedSymptom.day+newDays,
                            date:dt,
                            isActive:true
                        }
                        newSymptomDays=newSymptomDays<newData.day?newData.day:newSymptomDays;
                        newDaysArray.push(newData);
                    }
                }
            });
            await symptomDay.findOneAndUpdate({userId:req._id},{
                days:newDaysArray,
                symptomDays:newSymptomDays,
                lastUpdated:dt
            });
        }
        // if symptom update for the day
        else{
            let newDaysArray=[];
            let newSymptomDays=0;
            req.body.forEach(symptom => {
                let savedSymptom=null;
                doc.days.forEach(data=> {
                    if(data.sId==symptom.sId){
                        savedSymptom=data;
                    }
                });
                if(symptom.value==false){
                    var newData={
                        sId:symptom.sId,
                        day:savedSymptom.day,
                        date:dt,
                        isActive:false
                    }
                    newDaysArray.push(newData);
                }else{
                    var newData={
                        sId:symptom.sId,
                        day:savedSymptom.day?savedSymptom.day:1,
                        date:dt,
                        isActive:true
                    }
                    newSymptomDays=newSymptomDays<newData.day?newData.day:newSymptomDays;
                    newDaysArray.push(newData);
                }
            });
            await symptomDay.findOneAndUpdate({userId:req._id},{
                days:newDaysArray,
                symptomDays:newSymptomDays,
                lastUpdated:dt
            });
        }
    }
    catch(err){
        return Promise.reject(err);
    }
}

function calculateRiskValue(factor){
    return {
        "riskAgeGroup": 2,
        "riskMedicalCondition": 2,
        "intensity-low": 1,
        "intensity-medium": 2,
        "intensity-high": 4,
        "days<4": -1,
        "days4-7": 1,
        "days>7": 2,
        "serious": 10,
        "common-1": 3,
        "common>1": 5,
        "rare-1": 1,
        "rare2-3": 3,
        "rare>3": 5
    }[factor]
}

// function to check if user is in risk age group 
const isRiskAgeGroup= async (id)=>{
    let risk=[];
    var doc= await medicalHistory.findOne({userId:id});
    if(doc.riskAgeGroup){
        var riskfactor = calculateRiskValue("riskAgeGroup");
        risk.push({factor:"risk age group",riskValue:riskfactor});
        return risk;
    }
}

// function to check if user have risk medical condition 
const isRiskMedicalCondition= async (id)=>{
    let risk=[];
    var doc= await medicalHistory.findOne({userId:id});
    if(doc.riskMedicalCondition){
        riskfactor= calculateRiskValue("riskMedicalCondition");
        risk.push({factor:"risk medical condition",riskValue:riskfactor});
        return risk;
    }
}

// function to calculate risk level based on no of days of symptoms
const checkSymptomDaysRisk= async (id)=>{
    let risk=[];
    var doc = await symptomDay.findOne({userId:id})
    if(doc.symptomDays<4 && doc.symptomDays!=0){
        riskfactor= calculateRiskValue("days<4");
        risk.push({factor:"less than 4 days",riskValue:riskfactor});
    }
    else if(doc.symptomDays>=4 && doc.symptomDays<=7){
        riskfactor= calculateRiskValue("days4-7");
        risk.push({factor:"4-7 days",riskValue:riskfactor});
    }
    else if(doc.symptomDays>7){
        riskfactor= calculateRiskValue("days>7");
        risk.push({factor:"more than 7 days",riskValue:riskfactor});
    }
    return risk;
}

// function to calculate risk level based on different types of symptom
const checkSymptomRisk= async (id)=>{
    let date= new Date().toISOString().split('T')[0];
    let dt= new Date(date);
    let risk=[];
    var doc = await symptomData.findOne({userId:id,date:dt});
    // if serious symptoms
    if(doc.seriousSymptoms){
        riskfactor= calculateRiskValue("serious");
        risk.push({factor:"serious symptoms",riskValue:riskfactor});
    }
    //if only common symptoms
    if(doc.commonSymptoms && !doc.rareSymptoms){
        if(doc.commonSymptoms==1){
            riskfactor= calculateRiskValue("common-1");
            risk.push({factor:"1 common symptom",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("common>1");
            risk.push({factor:"more than 1 common symptom",riskValue:riskfactor});
        }
        if(doc.commonIntensity=='low'){
            riskfactor= calculateRiskValue("intensity-low");
            risk.push({factor:"low intensity",riskValue:riskfactor});
        }
        else if(doc.commonIntensity=='medium'){
            riskfactor= calculateRiskValue("intensity-medium");
            risk.push({factor:"medium intensity",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("intensity-high");
            risk.push({factor:"high intensity",riskValue:riskfactor});
        }
    }
    // if only rare symptoms
    if(!doc.commonSymptoms && doc.rareSymptoms){
        if(doc.rareSymptoms==1){
            riskfactor= calculateRiskValue("rare-1");
            risk.push({factor:"1 rare symptom",riskValue:riskfactor});
        }
        else if(doc.rareSymptoms==2 || doc.rareSymptoms==3){
            riskfactor= calculateRiskValue("rare2-3");
            risk.push({factor:"2-3 rare symptom",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("rare>3");
            risk.push({factor:">3 rare symptom",riskValue:riskfactor});
        }
        if(doc.rareIntensity=='low'){
            riskfactor= calculateRiskValue("intensity-low");
            risk.push({factor:"low intensity",riskValue:riskfactor});
        }
        else if(doc.rareIntensity=='medium'){
            riskfactor= calculateRiskValue("intensity-medium");
            risk.push({factor:"medium intensity",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("intensity-high");
            risk.push({factor:"high intensity",riskValue:riskfactor});
        }
    }
    // if both rare and common symptoms
    if(doc.commonSymptoms && doc.rareSymptoms){
        if(doc.commonSymptoms==1){
            riskfactor= calculateRiskValue("common-1");
            risk.push({factor:"1 common symptom",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("common>1");
            risk.push({factor:"more than 1 common symptom",riskValue:riskfactor});
        }
        if(doc.rareSymptoms==1){
            riskfactor= calculateRiskValue("rare-1");
            risk.push({factor:"1 rare symptom",riskValue:riskfactor});
        }
        else if(doc.rareSymptoms==2 || doc.rareSymptoms==3){
            riskfactor= calculateRiskValue("rare2-3");
            risk.push({factor:"2-3 rare symptom",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("rare>3");
            risk.push({factor:">3 rare symptom",riskValue:riskfactor});
        }
        if(doc.rareIntensity=='high' || doc.commonIntensity=="high"){
            riskfactor= calculateRiskValue("intensity-high");
            risk.push({factor:"high intensity",riskValue:riskfactor});
        }
        else if(doc.rareIntensity=='medium' || doc.commonIntensity=="medium"){
            riskfactor= calculateRiskValue("intensity-medium");
            risk.push({factor:"medium intensity",riskValue:riskfactor});
        }
        else{
            riskfactor= calculateRiskValue("intensity-low");
            risk.push({factor:"low intensity",riskValue:riskfactor});
        }
    }
    return risk;
}

module.exports={
    calculateSymptomsCount,
    calculateIntensity,
    updateDays,
    isRiskAgeGroup,
    isRiskMedicalCondition,
    checkSymptomDaysRisk,
    checkSymptomRisk
};