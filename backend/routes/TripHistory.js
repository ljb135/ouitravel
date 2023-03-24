var express = require('express'), router = express.Router();
var Trip = require('../models/trip');

function getTripHistory(userId) {
    // Find all trips with the given user ID
    return Trip.find({ creator_id: userId }).exec();
  }
  
  router.get('/trip-history', (req, res) => {
    if (req.user) {
      getTripHistory(req.user._id)
        .then(tripHistory => {
          res.status(200).json(tripHistory);
        })
        .catch(err => {
          console.log(err);
          res.status(500).send("Error getting trip history");
        });
    } else {
      res.status(401).redirect("http://localhost:3000/login");
    }
  });
  
  router.delete('/trip/:id', (req, res) => {
    if (req.user) {
      Trip.deleteOne({ _id: req.params.id, creator_id: req.user._id })
        .then(() => {
          res.status(200).send("Trip deleted successfully");
        })
        .catch(err => {
          console.log(err);
          res.status(500).send("Error deleting trip");
        });
    } else {
      res.status(401).redirect("http://localhost:3000/login");
    }
  });
  

  module.exports = router;