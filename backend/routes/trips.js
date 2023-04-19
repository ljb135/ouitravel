/*const express = require('express'), router = express.Router();
const Trip = require('../models/trip');

// Create Trip
function createTrip(req, res){
    if(req.user){
        Trip.create({
            status: "Pending",
            visibility: req.body.visibility,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            destination_id: req.body.destination_id,
            creator_id: req.user._id
        })
        res.status(201).send("Successful");
    }
    else{
        res.status(401).send('Not logged in');
    }
}

function getTripbyUser(req, res){
    if(req.user){
        Trip.find({creator_id: req.user._id}).then(trip => res.status(200).json(trip));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Get Trip by Trip ID
function getTripbyID(req, res){
    if(req.user){
        Trip.findOne({_id: req.params.id, creator_id: req.user._id}).then(trip => res.status(200).json(trip));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Get Trip by User ID
function getTripbyUserID(req, res){
    if(req.user){
        Trip.find({creator_id: req.user._id}).then(trip => res.status(200).send(json(trip)));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Edit Trip
function editTrip(req, res){
    // Fields which can be changed
    const keys = ["visibility", "start_date", "end_date", "destination_id", "flight_ids", "hotel_ids", "activity_ids", "collaborator_ids"]

    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        Object.fromEntries(Object.entries(req.body).filter(([key]) => keys.includes(key))),
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

//Delete Trip
function deleteTrip(req, res){
    if(req.user){
        Trip.findOneAndDelete({
            _id: req.params.id,
            creator_id: req.user._id
        },
        (err, data) => {
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
        res.status(401).send("Not logged in")
    }
}

router.get('/trip/id/:id', getTripbyID);
router.get('/trip/user', getTripbyUser);
router.get('/trip/user/:id', getTripbyUserID);
router.delete('/trip/id/:id', deleteTrip);
router.put('/trip/id/:id', editTrip);
router.post('/trip', createTrip);

module.exports = router;

*/

const express = require('express'), router = express.Router();
const Trip = require('../models/trip');

// Create Trip
function createTrip(req, res){
    if(req.user){
        Trip.create({
            status: "Pending",
            visibility: req.body.visibility,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            destination_id: req.body.destination_id,
            creator_id: req.user._id,
            price: 0
        })
        res.status(201).send("Successful");
    }
    else{
        res.status(401).send('Not logged in');
    }
}

function getTripbyUser(req, res){
    if(req.user){
        Trip.find({creator_id: req.user._id}).then(trip => res.status(200).json(trip));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Get Trip by Trip ID
function getTripbyID(req, res){
    if(req.user){
        Trip.findOne({_id: req.params.id, creator_id: req.user._id}).then(trip => res.status(200).json(trip));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Get Trip by User ID
function getTripbyUserID(req, res){
    if(req.user){
        Trip.find({creator_id: req.user._id}).then(trip => res.status(200).send(json(trip)));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Edit Trip
function editTrip(req, res){
    // Fields which can be changed
    const keys = ["visibility", "start_date", "end_date", "destination_id", "flight_ids", "hotel_ids", "activity_ids", "collaborator_ids"]

    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        Object.fromEntries(Object.entries(req.body).filter(([key]) => keys.includes(key))),
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

//Delete Trip
function deleteTrip(req, res){
    if(req.user){
        Trip.findOneAndDelete({
            _id: req.params.id,
            creator_id: req.user._id
        },
        (err, data) => {
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
        res.status(401).send("Not logged in")
    }
}

function getAllTrips(req, res){
    if (!req.user) {
      return res.status(401).send('Not logged in');
    }
  
    // Query the database for all posts
    Trip.find({}, (err, trips) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }
  
      // Set CORS headers to allow cross-origin requests
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
  
      // Return the posts as a JSON response
      return res.json(trips);
    });
}

router.get('/trip/id/:id', getTripbyID);
router.get('/trip/user', getTripbyUser);
router.get('/trip/user/:id', getTripbyUserID);
router.delete('/trip/id/:id', deleteTrip);
router.put('/trip/id/:id', editTrip);
router.post('/trip', createTrip);
router.get('/trip/returntrips', getAllTrips);

module.exports = router;