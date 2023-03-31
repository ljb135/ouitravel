require("dotenv").config();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const cors = require("cors");

const express = require('express');
const e = require("express");
const app = express();
const port = 3001;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const User = require('./models/user');
const Friends = require('./models/friends');
const Trip = require('./models/trip');
const PayMethod = require('./models/paymethods');
const { db } = require("./models/user");
const valid_or_not = require("./models/valid_card");


mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

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

// PAYMETHODS API CALLS

// app.get('/method/:id', async(req, res) => {
//   get_id = req.params.id;
//   PayMethod.find({ id: get_id}, async(err, docs) => {
//     if (err){
//         console.log(err);
//     }
//     else{

//     }
// });

app.post('/addmethod', (req, res) => {
  if(req.user) {
    const is_valid = valid_or_not.valid_credit_card(req.body.card_number);

    if(is_valid == false) {
      res.status(400).send("Invalid card number");
    }
    else {
      const new_pay_method = new PayMethod({
        card_number: req.body.card_number,
        card_holder_name: req.body.card_holder_name,
        owner_email: req.body.owner_email,
        expiration_date: req.body.expiration_date,
        // getting only the month and year for the date
        cvv: req.body.cvv
      })

      new_pay_method.save()
        .then(item => {
          res.status(201).send("Successfully added");
        })
        .catch(err => {
          res.status(400).send("unable to save to database");
        })
      }
    }
    else {
      res.status(401).send("Failed");
    }
});

app.delete('/method/:id', async(req, res) => {
  // deletes the first data in the collection why?
  const method_id = req.params.id;

  PayMethod.findByIdAndDelete(method_id, function(err, DBdata){
    // console.log(method_id);
    if(DBdata == null) {
      res.send("No matching data");
    }
    else {
      res.send("Deleted");
      // res.send(DBdata);
    }
  })
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})