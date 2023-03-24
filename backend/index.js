require("dotenv").config();
const {MongoClient, ObjectId} = require('mongodb');
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
const Friends = require('./models/friends');
const Trip = require('./models/trip');
const Post = require('./models/post');
const { db } = require("./models/user");

 const uri = `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`;
 function makeConnection(){
  client = new MongoClient(uri);
  client.connect().then((con) => {
    console.log("mongodb connected");
  }, (err) => {
    console.log(err);
  })
 }
 app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  makeConnection();
})
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

var tripRoutes = require("./routes/trips");

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
      res.send(req.user.first_name);
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

//Edit profile information given email as identifier
app.put('/editprofile', async (req, res) => {
  const { email, first_name, last_name, dob } = req.body;
  User.findOneAndUpdate(
    {email: email},
    {$set: {first_name: first_name, last_name: last_name, dob: dob} }, 
    {new: true},
    (err,data) => {
      if(data==null){
          res.send("nothing found") ; 
      } else{
          res.send(data) ; 
      }
    }
  ); 
});

//FRIEND SYSTEM API CALLS
//Show list of friends of user given email as identifier
app.get('/friendslist', async (req, res) => {
  const {email} = req.body;
  Friends.find( {$and: [{"status": "friends"},  {$or: [{"user1_email": email}, {"user2_email": email}] }] })
  .then(data => res.json(data))
  .catch(error => res.json(error))
});

//Add a new pending friend request between two users
app.post('/addfriend', async (req, res) => {
  const { user1_email, user2_email } = req.body;
  const status = "pending";
  try{
    Friends.create({
      user1_email,
      user2_email,
      status
    })
  } catch(error){
      console.log(error)
      return res.json({ status: 'error' })
  }
  res.send("Friend request sent");
});

//Update status of friend request to "friends" given objectId
app.put('/acceptfriend/:id', async (req, res) => {
  const friends_id = req.params.id;   
  Friends.findByIdAndUpdate(
    friends_id,
    {$set: {status: "friends"} }, 
    {new: true},
    (err,data) => {
        if(data==null){
            res.send("nothing found") ; 
        } else{
            res.send("Friend request accepted") ; 
        }
    }); 
});

//Delete corresponding friends document given objectId
app.delete('/removefriend/:id', async (req, res) => {
  const friends_id = req.params.id;   
  Friends.findByIdAndDelete(
    friends_id,
    (err,data) => {
        if(data==null){
            res.send("nothing found") ; 
        } else{
            res.send("Friend removed") ; 
        }
    }); 
});

app.use("/", tripRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
  makeConnection();
})

//creates new post
app.post('/add_post', async(req, res) =>{
  var dbo = client.db(dbname);
    dbo.collection("Posts").insertOne({
      trip_id: req.body.trip_id,
      creator_id: req.body.creator_id,
      photo_id: req.body.photo_id,
      comment: req.body.comment
    }, function(err,res2){
      if(err){
        res.send('did not work');
      }
      else{console.log(req.body);
      res.send(req.body);}
    })
});

//returns list of posts given the creator's id
app.get('/postList', async (req, res) =>{
  var dbo = client.db(dbname);
    dbo.collection("Posts").find({"creator_id": req.body.creator_id}).toArray((err, docs) => {
      if (err){
        console.error(err);
        return res.status(500).send('Error querying database');
      }
      console.log(docs)

      res.send(docs);
    })
});

//deletes existing post given post id
app.delete('/delete/:id', (req, res) =>{
  var dbo = client.db(dbname);
  const id = new ObjectId(req.params.id);
  dbo.collection("Posts").deleteOne({"_id": id}, function(err, obj){
    if(err){
      res.send(err);
    }
    res.send("1 Document Deleted")
  })});

//edits the comment of a post
app.put('/editcaption/:id', async(req, res)=>{
  var dbo = client.db(dbname);
  const id = new ObjectId(req.params.id);
  const new_caption = req.body.comment;
  dbo.collection("Posts").updateOne({"_id": id}, {$set:{"comment": new_caption}}, function(err, obj){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  })
});
