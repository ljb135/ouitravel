const express = require('express'), router = express.Router();
const Trip = require("../models/trip");
const Activity = require("../models/activity");

// Create Activity
function createActivity(req, res){
    if(req.user){
        Activity.create(req.body, function(err,activity) {
            res.status(201).send("Created");
        });
    }
    else{
        res.status(401).send('Not logged in');
    }
}

function getActivityByID(req, res){
    if(req.user){
        Activity.findOne({_id: req.params.id,}).then(activity => res.status(200).json(activity));
    }
    else{
        res.redirect(401, "http://localhost:3000/login");
    }
}

// Add Activity to Trip
function addActivitytoTrip(req, res){
    // Fields which can be changed
    if(req.user){
        // Update fields only if user is the creator or a collaborator
        Trip.findOneAndUpdate({
            _id: req.params.trip_id,
            status: "Pending",
            $or: [{creator_id: req.user._id}, {collaborator_ids: req.user._id}]
        },
        // Filter request body to remove irrelevant fields
        { "$addToSet": { "activity_ids": req.params.activity_id } },
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

router.get('/activity/:id', getActivityByID);
router.post('/activity', createActivity);
router.put('/activity/:activity_id/trip/:trip_id', addActivitytoTrip);
// router.delete('/flight/:flight_id/trip/:trip_id', removeFlightfromTrip);

module.exports = router;