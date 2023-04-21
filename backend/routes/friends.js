const express = require('express'), router = express.Router();
const Friends = require('../models/friends');

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

module.exports = router;