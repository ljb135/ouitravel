const express = require('express'), router = express.Router();
const passport = require('passport');
const User = require('../models/user');

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

router.get('/user', (req, res) => {
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