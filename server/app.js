const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app= express();

app.use(bodyparser.json());
app.use(cors());

connectDb= require('./db/connection');
connectDb();

app.use('/user',require('./routes/userRegistration'));

const port = 3000;

const server= app.listen(port, ()=>{
    console.log("server is running...");
})