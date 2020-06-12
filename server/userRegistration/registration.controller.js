const { validationResult } = require('express-validator');
const bcrypt= require('bcryptjs');
const lodash = require('lodash');

// import database schema
const user= require('../db/user');

//import helver functions from services file
const{
    generateJWT
}= require('./registration.services');

/*
user signup api controller
req = user details for signup
res = message:user details saved
*/
const addUser= async function(req,res){
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).send({message:errors.errors[0].msg});
    }
    else{
        try{
            var newuser=new user();
            newuser.fullname=req.body.name;
            newuser.email=(req.body.email).toLowerCase();
            var salt= bcrypt.genSaltSync(10);
            var password=req.body.password;
            var hash=bcrypt.hashSync(password,salt);
            newuser.password=hash;
            newuser.saltsecret=salt;
            
            doc = await newuser.save();
            res.status(200).send({message:"user details saved"});
        }
        catch(err){
            res.status(500).send({message:err.message});
        }
    }
}

/*
user login api controller
req = user details for login
res = token:token (jwt token to be saved at front end and added to request headers for user authentication)
*/
const userLogIn= async (req,res)=>{
    const errors= validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).send({message:"validation error"});
    }
    else{
        try{
            userEmail= req.body.email.toLowerCase();
            var doc= await user.findOne({email:userEmail});
            if(!doc){
                res.status(404).send({message:"user not found"})
            }
            else{
                var passValid= bcrypt.compareSync(req.body.password,doc.password);
                if(!passValid){
                    res.status(400).send({message: "incorrect password"});
                }
                else{
                    //call generateJWT function to create a jwt token
                    var token= await generateJWT(doc._id);
                    res.status(200).send({token: token});
                }
            }
        }
        catch(err){
            res.status(500).send({message:err.message});
        }
    }
}

/*
send user profile api controller
req = jwt token
res = user fullname and email
*/
const sendUserProfile= async (req,res)=>{
    try{
        var doc =await user.findOne({_id:req._id});
        if(!doc){
            res.status(404).send({message: "user record not found"});
        }
        else{
            res.status(200).send({user: lodash.pick(doc,["fullname","email"])});
        }
    }
    catch(err){
        res.status(500).send({message:err.message});
    }
}

module.exports= { addUser,userLogIn,sendUserProfile };