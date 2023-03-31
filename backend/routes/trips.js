const express = require('express'), router = express.Router();
const Trip = require('../models/trip');

// Create Trip
function createTrip(req, res){
    if(req.user){
        Trip.create({
            status: "Pending",
            visibility: "Private",
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            creator_id: req.user._id
        })
        res.status(201).send("Successful");
    }
    else{
        res.status(401).send('Not logged in');
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

router.delete('/trip/:id', deleteTrip);
router.put('/trip/:id', editTrip);
router.post('/trip', createTrip); 

module.exports = router;