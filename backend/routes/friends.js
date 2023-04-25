const express = require('express'), router = express.Router();
const Friends = require('../models/friends');
const User = require('../models/user');

//FRIEND SYSTEM API CALLS
/*
//Show list of friends of user
router.get('/friends', async (req, res) => {
  if (req.user) {
    const email = req.user.email;
    Friends.find({ $and: [{ "status": "friends" }, { $or: [{ "user1_email": email }, { "user2_email": email }] }] })
      .then(data => {
        data = data.map(friend => {
          friend.user2_email = friend.user1_email === email ? friend.user2_email : friend.user1_email;
          friend.user1_email = email;
          return friend
        })
        console.log(data)
        res.json(data);
      })
      .catch(error => res.json(error))
  }
  else {
    res.status(401).send('Not logged in');
  }
});
*/
//Show list of friends of user
router.get('/friends', async (req, res) => {
  if (req.user) {
    const email = req.user.email;
    const status = req.query.status;
    const key = req.query.key;

    // For friends
    if (status == "friends"){
      Friends.find({ $and: [{ "status": status }, { $or: [{ "user1_email": email }, { "user2_email": email }] }] })
      .then(data => {
        data = data.map(friend => {
          friend.user2_email = friend.user1_email === email ? friend.user2_email : friend.user1_email;
          friend.user1_email = email;
          return friend
        })
        console.log(data)
        res.json(data);
      })
      .catch(error => res.json(error))
    } 
    // For sent requests
    else if (status == "pending" && key == "sent"){
      Friends.find({ $and: [{ "status": status }, { "user1_email": email }] })
      .then(data => {
        data = data.map(friend => {
          friend.user2_email = friend.user1_email === email ? friend.user2_email : friend.user1_email;
          friend.user1_email = email;
          return friend
        })
        console.log(data)
        res.json(data);
      })
      .catch(error => res.json(error))
    } 
    // For received requests
    else if (status == "pending" && key == "received"){
      Friends.find({ $and: [{ "status": status }, { "user2_email": email }] })
      .then(data => {
        data = data.map(friend => {
          friend.user2_email = friend.user1_email === email ? friend.user2_email : friend.user1_email;
          friend.user1_email = email;
          return friend
        })
        console.log(data)
        res.json(data);
      })
      .catch(error => res.json(error))
    } 
  }
  else {
    res.status(401).send('Not logged in');
  }
});
  
//Add a new pending friend request between user and entered friend
router.post('/friends', async (req, res) => {
  if (req.user) {
    const user1_email = req.user.email;
    let user2_email = req.body.friend_email;
    const status = "pending";
    
    //Check if inputed friend email is an existing user
    //try {
      let existingUser = await User.findOne({ 'email': req.body.friend_email });
      if (existingUser) {
        Friends.create({
          user1_email,
          user2_email,
          status
        });
        res.send("Friend request sent");
      }
      else if (!existingUser){
        return res.status(400).send(error);
      }
    // } catch (error) {
    //   return res.status(400).send(error); //res.status(401).send('Nonexisting user');
    // }
    
    /*
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
    */
    /*
    try {
      Friends.create({
        user1_email,
        user2_email,
        status
      });
      res.send("Friend request sent");
    } catch (error) {
      console.log(error)
      return res.json({ status: 'error' })
    }
    */
  }
  else {
    res.status(401).send('Not logged in');
  }
});

//Update status of friend request to "friends" given objectId
router.put('/friends/:id', async (req, res) => {
  if (req.user) {
    const friends_id = req.params.id;
    Friends.findByIdAndUpdate(
      friends_id,
      { $set: { status: "friends" } },
      { new: true },
      (err, data) => {
        if (data == null) {
          res.send("nothing found");
        } else {
          res.send("Friend request accepted");
        }
      })
  }
  else {
    res.status(401).send('Not logged in');
  }
});

//Delete corresponding friends document given objectId
router.delete('/friends/:id', async (req, res) => {
  if (req.user) {
    const friends_id = req.params.id;
    Friends.findByIdAndDelete(
      friends_id,
      (err, data) => {
        if (data == null) {
          res.send("nothing found");
        } else {
          res.send("Friend removed");
        }
      });
  }
  else {
    res.status(401).send('Not logged in');
  }
});

module.exports = router;