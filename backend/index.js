require("dotenv").config();
const mongoose = require('mongoose')
// const passportLocalMongoose = require('passport-local-mongoose');
const bodyParser = require("body-parser")

const express = require('express');
const e = require("express");
const app = express()
const port = 3000

const username = process.env.mongoDB_username;
const password = process.env.mongoDB_password;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

const userSchema = new mongoose.Schema({
  first_name: {type: String, required: true},
  last_name: {type: String, required: true},
  email:{type: String, unique: true, required : true},
  password: {type: String, required: true},
  dob: {type: Date, required: true},
  is_mod: {type: Boolean, required: true}
});

// userSchema.plugin(passportLocalMongoose, {usernameField: email});

const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/user/', (req, res) => {
  if(req.query.email){
    User.find({email: req.query.email}, (err, found) => {
      if (!err) {
        res.send(found);
      }
      else{
        console.log(err);
        res.send("Some error occured!")
      }
    });
  }
  else{
    User.find({}, (err, found) => {
      if (!err) {
        res.send(found);
      }
      else{
        console.log(err);
        res.send("Some error occured!")
      }
    });
  }
});

app.post('/register', (req, res) => {
  User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    password: req.body.password,
    email: req.body.email,
    dob: req.body.dob,
    is_mod: req.body.is_mod
  }, err => {
    if(err){
      res.status(409).send(err.message)
    }
    else{
      res.status(201).send("Account successfully created.")
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})