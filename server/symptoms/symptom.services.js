//import required database schemas
const symptomDay= require('../db/symptomDays');

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

module.exports={calculateSymptomsCount,calculateIntensity,updateDays};