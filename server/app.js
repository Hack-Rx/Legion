const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const path= require('path');

const app= express();

app.use(bodyparser.json());
app.use(cors());
app.use(express.static(path.join(__dirname,'public')));

connectDb= require('./db/connection');
connectDb();

app.use('/user',require('./routes/userRegistration'));
app.use('/symptoms',require('./routes/symptoms'));

app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'public/index.html'));
})

const port= process.env.PORT || 8080;
// const port = 3000;

const server= app.listen(port, ()=>{
    console.log("server is running...");
})