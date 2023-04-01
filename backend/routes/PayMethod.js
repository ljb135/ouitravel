// PAYMETHODS API CALLS

// app.get('/method/:id', async(req, res) => {
//   get_id = req.params.id;
//   PayMethod.find({ id: get_id}, async(err, docs) => {
//     if (err){
//         console.log(err);
//     }
//     else{

//     }
// });

app.post('/addmethod', (req, res) => {
    if(req.user) {
      const is_valid = valid_or_not.valid_credit_card(req.body.card_number);
  
      if(is_valid == false) {
        res.status(400).send("Invalid card number");
      }
      else {
        const new_pay_method = new PayMethod({
          card_number: req.body.card_number,
          card_holder_name: req.body.card_holder_name,
          owner_email: req.body.owner_email,
          expiration_date: req.body.expiration_date,
          // getting only the month and year for the date
          cvv: req.body.cvv
        })
  
        new_pay_method.save()
          .then(item => {
            res.status(201).send("Successfully added");
          })
          .catch(err => {
            res.status(400).send("unable to save to database");
          })
        }
      }
      else {
        res.status(401).send("Failed");
      }
  });
  
  app.delete('/method/:id', async(req, res) => {
    // deletes the first data in the collection why?
    const method_id = req.params.id;
  
    PayMethod.findByIdAndDelete(method_id, function(err, DBdata){
      // console.log(method_id);
      if(DBdata == null) {
        res.send("No matching data");
      }
      else {
        res.send("Deleted");
        // res.send(DBdata);
      }
    })
  });


  module.exports = router;