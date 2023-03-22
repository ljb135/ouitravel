require("dotenv").config();
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require("body-parser")

const express = require('express');
const e = require("express");
const app = express()
const port = 3001

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

const User = require('./models/user');
const Friends = require('./models/friends');
const Paymethod = require('./models/pay_methods');

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
    User.find({}, (err, found) => {
      if (!err) {
        res.json(found);
      }
      else{
        console.log(err);
        res.send("Some error occured!")
      }
    });
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
      res.send('Logged In')
    });
  });
});

app.post('/login', passport.authenticate('local'), function(req, res) {
  res.send('Logged In');
});

app.post('/logout', function(req, res) {
  req.logout(function(err){
    if (err) res.send(err);
    else res.send("Logged Out");
  });
});

// payment system API call functions
/*
// id is whatever we want from parameter

app.get('get_method/:id', function(req, res) {
  res.send('Payment' + req.params.id);
})
*/
app.get('/get_method', async(req, res) => {
  // showing all the payment method
  res.send("Payment");

});

app.post('/add_method', async(req, res) => {
  try {
  Paymethod.create({
    card_number: req.body.card_number,
    card_holder_name: req.body.card_holder_name,
    owner_email: req.body.email,
    expiration_date: req.body.exp_date,
    cvv: req.body.cvv
  })
} catch(error) {
    console.log(error);
    return res.json({ status: 'error' })
}
  res.send("Your payment method successfully added");
});

app.delete('/delete_method', async(req, res) => {
  // sending it have successfully deleter
  res.send("Successfully Deleted");
});

//Friend system API calls
app.get('/friendslist', (req, res) => {
  //show list of friends of user
  res.send("Friends");
});

app.post('/addfriend', async (req, res) => {
  const { user1_email, user2_email, status } = req.body;
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

app.put('/acceptfriend', (req, res) => {
  //update status to "friends"
  Friends.find({_id: req._id})
  res.send("Friend request accepted");
});

app.delete('/deletefriend', (req, res) => {
  //delete corresponding data 
  res.send("Friend removed");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})