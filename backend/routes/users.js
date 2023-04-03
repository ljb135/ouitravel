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


passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/auth/google/callback",
        passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile)
            let existingUser = await User.findOne({ 'email': profile.email });
            if (existingUser) {
                return done(null, existingUser);
            }
            console.log('Creating new user...');
            const newUser = new User({
                first_name: profile.given_name,
                last_name: profile.family_name,
                email: profile.email,
                dob: Date(),
                is_mod: false
            });
            await newUser.save();
            return done(null, newUser);
        } catch (error) {
            return done(error, false)
        }
    }
));

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

function registerUser(req, res){
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
}

function login(req, res){
    res.send(req.user.first_name);
}

function logout(req, res){
    req.logout(function(err){
        if (err) res.send(err);
        else res.send("Logged Out");
    });
}

//Edit profile information given email as identifier
function editUser(req, res){
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
}

function redirect(req, res){
    res.redirect("http://localhost:3000/");
}

router.get('/user', getUserInfo);
router.get('/user/:id', getUserInfoByID);
router.post('/user', registerUser);
router.put('/user', editUser);
router.post('/login', passport.authenticate('local'), login);
router.post('/logout', logout);

router.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/auth/google/callback", passport.authenticate("google"), redirect);

module.exports = router;