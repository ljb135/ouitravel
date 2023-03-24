var express = require('express'), router = express.Router();
var Payment = require('../models/payment');

function getPaymentHistory(userId) {
  // Find all payments with the given user ID
  return Payment.find({ creator_id: userId }).exec();
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

module.exports = router;