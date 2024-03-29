var express = require('express'), router = express.Router();
var Trip = require('../models/trip');
const mongoose = require('mongoose');


function getTripHistory(userId) {
     //Find all trips with the given user ID
    return Trip.find({ creator_id: userId }).exec();
  }


  //Filters by date, will be worked on in later time.
  //function getTripHistory(userId) {
    // Find all trips with the given user ID and sort by start_date in ascending order
    //return Trip.find({ creator_id: userId }).sort({ start_date: 1 }).exec();
 // }

 function getTripIndividual(tripId, creatorId) {
  // Find the trip with the given ID and creator ID
  return Trip.findOne({ _id: tripId, creator_id: creatorId }).exec();
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
    } else {//
      res.status(401).redirect("http://localhost:3000/login");
    }
  });
  
  router.get('/trips/:id', (req, res) => {
    if (req.user) {
      getTripIndividual(req.params.id, req.user._id)
        .then(trip => {
          if (trip) {
            res.status(200).json(trip);
          } else {
            res.status(404).send("No Trip Found");
          }
        })
        .catch(err => {
          console.log(err);
          res.status(500).send("Error getting trip");
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
      res.status(401);
    }
  });
  

  module.exports = router;