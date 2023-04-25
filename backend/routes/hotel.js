const express = require('express'), router = express.Router();
const Hotel = require('../models/hotel');
const Trip = require("../models/trip")
const { create } = require('../models/trip');

// Create Hotel
function createHotel(req, res){
    if(req.user){
        Hotel.create({
            _id: req.body._id,
            hotel_name: req.body.hotel_name,
            room_description: req.body.room_description,
            longitude: req.body.longitude,
            latitude: req.body.latitude,
            num_rooms: req.body.num_rooms,
            price: req.body.price,
            check_in: req.body.check_in,
            check_out: req.body.check_out
        })
        res.status(201).send("Successful");
    }
    else{
        res.status(401).send('Not logged in');
    }
}

function getHotelByID(req, res){
    if(req.user){
        Hotel.findOne({_id: req.params.id,}).then(hotel => res.status(200).json(hotel));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Add Hotel to Trip
function addHoteltoTrip(req, res){
    // Fields which can be changed
    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.trip_id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        { "$push": { "hotel_ids": req.params.hotel_id } },
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

// Remove Hotel from Trip
function removeHotelfromTrip(req, res){
    // Fields which can be changed
    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.trip_id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        { "$pull": { "hotel_ids": req.params.hotel_id } },
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

router.get('/hotel/:id', getHotelByID);
router.post('/hotel', createHotel);
router.put('/hotel/:hotel_id/trip/:trip_id', addHoteltoTrip);
router.delete('/hotel/:hotel_id/trip/:trip_id', removeHotelfromTrip);

module.exports = router;