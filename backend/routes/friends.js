const express = require('express'), router = express.Router();
const Friends = require('../models/friends');
const Trip = require('../models/trip');
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
    
    //Check if inputted email is not user's email
    if (user1_email == user2_email) {
      return res.status(400).send({error: "Cannot add yourself"});
    }

    //Check if inputted friend email is an existing user
    let existingUser = await User.findOne({ 'email': user2_email });
    //Check if there is already an identical friend document
    let existingFriends = await Friends.findOne({ $and: [
                                                          { $or: [{ "user1_email": user1_email }, { "user1_email": user2_email }] }, 
                                                          { $or: [{ "user2_email": user2_email }, { "user2_email": user1_email }] }
                                                        ] });
    if (existingUser && !existingFriends) {
      Friends.create({
        user1_email,
        user2_email,
        status
      });
      res.send("Friend request sent");
    }
    else if (!existingUser){
      return res.status(400).send({error: "User does not exist"});
    }
    else if (existingFriends){
      return res.status(400).send({error: "User already added"});
    }
    
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

// Add Friend to Trip
function addFriendtoTrip(req, res){
  // Fields which can be changed
  if(req.user){
      // Update fields only if user is the creator or a collaborator
      Trip.findOneAndUpdate({
          _id: req.params.trip_id,
          status: "Pending",
          $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
      },
      // Filter request body to remove irrelevant fields
      { "$addToSet": { "collaborator_ids": req.params.friend_id } },
      (err, data)=>{
          if(err){
              res.status(400).send(err);
          }
          else if(data === null){
              res.status(200).send("Trip not found");
          }
          else{
              res.status(201).send("Successful");
          }
      });
  }
  else{
      res.status(401).send('Not logged in');
  }
}

// Remove Friend from Trip
function removeFriendfromTrip(req, res){
  // Fields which can be changed
  if(req.user){
      // Update fields only if user is the creator or a collaborator
      Trip.findOneAndUpdate({
          _id: req.params.trip_id,
          status: "Pending",
          $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
      },
      // Filter request body to remove irrelevant fields
      { "$pull": { "collaborator_ids": req.params.friend_id } },
      (err, data)=>{
          if(err){
              res.status(400).send(err);
          }
          else if(data === null){
              res.status(200).send("Trip not found");
          }
          else{
              res.status(201).send("Successful");
          }
      });
  }
  else{
      res.status(401).send('Not logged in');
  }
}

router.put('/collaborator/:friend_id/trip/:trip_id', addFriendtoTrip);
router.delete('/collaborator/:friend_id/trip/:trip_id', removeFriendfromTrip);

module.exports = router;