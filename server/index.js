const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const AccountModel = require("./models/account")

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect("mongodb://127.0.0.1:27017/bookmark");

app.post('/login',(req,res)=>{
    const {email,password} = req.body;
    AccountModel.findOne({email: email})
    .then(user =>{
        if(user){
            if(user.password === password){
                res.json("Success")
            } else {
                res.json("Incorrect Password")
            }
        } else {
            res.json("User not found")
        }
        
    })
})

app.post('/signup',(req,res)=>{
    AccountModel.create(req.body)
    .then(account => res.json(account))
    .catch(err => res.json(err))
})

app.listen(3001,()=>{
    console.log("Server is running")
})