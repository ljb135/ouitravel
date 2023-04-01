const express = require('express'), router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const GOOGLE_CLIENT_ID = "725360672576-l2tbm1qm7l13lbmp17bohletvvr5f2fh.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

//Google Login
const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = (passport) => {
        passport.use(new GoogleStrategy({
            clientID: User.GOOGLE_CLIENT_ID,
            clientSecret: User.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/google/callback",
            passReqToCallback : true
          },
          async (request, accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ 'google.id': profile.id });
                <em>// if user exists return the user</em> 
                if (existingUser) {
                  return done(null, existingUser);
                }
                <em>// if user does not exist create a new user</em> 
                console.log('Creating new user...');
                const newUser = new User({
                  method: 'google',
                  google: {
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                  }
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
          }
       ));
    }
<em>// Redirect the user to the Google signin page</em> 
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);
<em>// Retrieve user data using the access token received</em> 
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile/");
  }
);
<em>// profile route after successful sign in</em> 
app.get("/profile", (req, res) => {
  console.log(req);
  res.send("Welcome");
});

//Google Login
const GoogleStrategy = require("passport-google-oauth2").Strategy;

module.exports = (passport) => {
        passport.use(new GoogleStrategy({
            clientID: User.GOOGLE_CLIENT_ID,
            clientSecret: User.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:3001/auth/google/callback",
            passReqToCallback : true
          },
          async (request, accessToken, refreshToken, profile, done) => {
            try {
                let existingUser = await User.findOne({ 'google.id': profile.id });
                <em>// if user exists return the user</em> 
                if (existingUser) {
                  return done(null, existingUser);
                }
                <em>// if user does not exist create a new user</em> 
                console.log('Creating new user...');
                const newUser = new User({
                  method: 'google',
                  google: {
                    id: profile.id,
                    name: profile.displayName,
                    email: profile.emails[0].value
                  }
                });
                await newUser.save();
                return done(null, newUser);
            } catch (error) {
                return done(error, false)
            }
          }
       ));
    }
<em>// Redirect the user to the Google signin page</em> 
app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["email", "profile"] })
);
<em>// Retrieve user data using the access token received</em> 
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    res.redirect("/profile/");
  }
);
<em>// profile route after successful sign in</em> 
app.get("/profile", (req, res) => {
  console.log(req);
  res.send("Welcome");
});

function getUserInfo(req, res){
    if(req.user){
        User.find({email: req.user.email}).then(user => res.status(200).json(user));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

function getUserInfoByID(req, res){
    if(req.user){
        User.findById(req.params.id).then(user => {
            res.json(user);
        });
    }
    else{
        res.status(401).send("Not logged in")
    }
}

router.get('/user', getUserInfo);
router.get('/user/:id', getUserInfoByID);
router.post('/register', (req, res) => {
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
  
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.send(req.user.first_name);
});
  
router.post('/logout', function(req, res) {
    req.logout(function(err){
        if (err) res.send(err);
        else res.send("Logged Out");
    });
});

//Edit profile information given email as identifier
router.put('/user', async (req, res) => {
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

module.exports = router;