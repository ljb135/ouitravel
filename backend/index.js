require("dotenv").config();
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require('express');
const e = require("express");
const app = express();
const port = 3001

let client;

const username = process.env.mongoDB_username;
const password = process.env.mongoDB_password;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const User = require('./models/user');
const Trip = require('./models/trip');
const Post = require('./models/post');



mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

 const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;
 function makeConnection(){
  client = new MongoClient(uri);
  client.connect().then((con) => {
    console.log("mongodb connected");
  }, (err) => {
    console.log(err);
  })
 }
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

app.get('/user', (req, res) => {
  if(req.user){
    User.find({email: req.user.email}).then(user => res.status(200).json(user));
  }
  else{
    // User.find({}, (err, found) => {
    //   if (!err) {
    //     res.json(found);
    //   }
    //   else{
    //     console.log(err);
    //     res.send("Some error occured!")
    //   }
    // });
    res.redirect(401, "http://localhost:3000/login");
  }
});

app.post('/register', (req, res) => {
  User.register(new User({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    dob: req.body.dob,
    is_mod: req.body.is_mod
  }), req.body.password, err => {
    if(err){
      return res.status(409).send(err.message)
    }
    passport.authenticate('local')(req, res, function () {
      res.send('Logged In');
    });
  });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send(req.user.first_name);
});

app.post('/logout', function(req, res) {
  req.logout(function(err){
    if (err) res.send(err);
    else res.send("Logged Out");
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  makeConnection();
})

app.post('/add_post', async(req, res) =>{
  var dbo = client.db(dbname);
    dbo.collection("Posts").insertOne({
      trip_id: req.body.trip_id,
      creator_id: req.body.creator_id,
      photo_id: req.body.photo_id,
      comment: req.body.comment
    }, function(err,res2){
      if(err){
        res.send(JSON.stringify(err));
      }
      else{res.send('inserted')}
    })
});
app.get('/tripList', (req, res) =>{
  res.send('Trip List')
});
app.delete('/delete', (req, res) =>{
  res.send('DELETE INCOMING')
});
app.put('/create', (req, res) =>{
  res.send('Caption Creating')
});