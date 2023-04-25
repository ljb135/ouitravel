const express = require('express'), router = express.Router();
const Friends = require('../models/friends');
const Trip = require('../models/trip');

//FRIEND SYSTEM API CALLS

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
  
//Add a new pending friend request between user and entered friend
router.post('/friends', async (req, res) => {
  if (req.user) {
    const user1_email = req.user.email;
    const user2_email = req.body.friend_email;
    const status = "pending";
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