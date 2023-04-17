const express = require('express'), router = express.Router();
const Payment = require('../models/payment');
const mongoose = require('mongoose');

function getPaymentHistory(userId) {
  // Find all payments with the given user ID
  return Payment.find({ creator_id: userId }).exec();
}

function getPaymentIndividual(paymentId, creatorId) {
  // Find the payment with the given ID and creator ID
  return Payment.findOne({ _id: paymentId, creator_id: creatorId }).exec();
}



router.get('/payment-history', (req, res) => {
  if(req.user){
    getPaymentHistory(req.user._id).then(paymentHistory => {
      res.status(200).json(paymentHistory);
    }).catch(err => {
      console.log(err);
      res.status(500).send("Error getting payment history");
    });
  }
  else{
    res.redirect(401, "http://localhost:3000/login");
  }
});

router.get('/payments/:id', (req, res) => {
  if(req.user){
    getPaymentIndividual(req.params.id, req.user._id).then(payment => {
      if (payment) {
        res.status(200).json(payment);
      } else {
        res.status(404).send("No Payment Found");
      }
    }).catch(err => {
      console.log(err);
      res.status(500).send("Error getting payment");
    });
  }
  else{
    res.redirect(401, "http://localhost:3000/login");
  }
});


module.exports = router;