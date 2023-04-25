const express = require('express'), router = express.Router();
const Flight = require('../models/flight');
const Trip = require("../models/trip");

// Create Flight
function createFlight(req, res){
    if(req.user){
        Flight.create(req.body, function(err,flight) {
            res.status(201).send(flight._id);
        });
    }
    else{
        res.status(401).send('Not logged in');
    }
}

function getFlightByID(req, res){
    if(req.user){
        Flight.findOne({_id: req.params.id,}).then(flight => res.status(200).json(flight));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Add Flight to Trip
function addFlighttoTrip(req, res){
    // Fields which can be changed
    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.trip_id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        { "$push": { "flight_ids": req.params.flight_id } },
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

// Remove Flight from Trip
function removeFlightfromTrip(req, res){
    // Fields which can be changed
    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.trip_id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        { "$pull": { "flight_ids": req.params.flight_id } },
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

router.get('/flight/:id', getFlightByID);
router.post('/flight', createFlight);
router.put('/flight/:flight_id/trip/:trip_id', addFlighttoTrip);
router.delete('/flight/:flight_id/trip/:trip_id', removeFlightfromTrip);

module.exports = router;