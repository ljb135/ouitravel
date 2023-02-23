require("dotenv").config();
const mongoose = require('mongoose')

const express = require('express');
const e = require("express");
const app = express()
const port = 3001

const username = process.env.user_name;
const password = process.env.password;
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
  user_id: {
      type: Number,
      require: true
  },
  first_name: String,
  last_name: String,
  dob: Date
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  User.find({}, (err, found) => {
    if (!err) {
      res.send(found);
    }
    else{
      console.log(err);
      res.send("Some error occured!")
    }
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})