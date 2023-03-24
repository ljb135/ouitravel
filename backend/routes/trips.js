var express = require('express'), router = express.Router();
var Trip = require('../models/trip');

// Create Trip
router.post('/trip', (req, res) => {
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
})

//Delete Trip
router.delete('/trip/:id', (req, res) => {
    if(req.user){
        Trip.findByIdAndDelete(
        req.params.id,
        (err, data) => {
            if(data==null){
                res.send("nothing found") ; 
            } else{
                res.send("Friend removed") ; 
            }
        });
        res.status(200).send("Deleted");
    }
    else{
        res.status(401).send("Not logged in")
    }
});
 
module.exports = router;