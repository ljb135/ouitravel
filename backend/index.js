require("dotenv").config();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({storage: storage}).single('image');    


const express = require('express');
const e = require("express");
const app = express();
const port = 3001;

const username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))

const PayMethod = require('./models/paymethods');

mongoose.connect(
  `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
  secret: "Rusty is a dog",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

const userRoutes = require("./routes/users");
const tripRoutes = require("./routes/trips");
const friendRoutes = require("./routes/friends");
const TripHisRoutes = require("./routes/tripHistory");
const PayHisRoutes = require("./routes/payHistory");
const postRoutes = require("./routes/posts");

// PAYMETHODS API CALLS

app.get('/getmethod', async(req, res) => {
  res.send('paymethods');
});

app.post('/addmethod', async(req, res) => {
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
        res.send("item saved to database");
      })
      .catch(err => {
        res.status(400).send("unable to save to database");
      })
});

app.delete('/deletemethod', async(req, res) => {
  res.send('Deleted');
});

app.use("/", userRoutes);
app.use("/", tripRoutes);
app.use("/", friendRoutes);
app.use("/", TripHisRoutes);
app.use("/", PayHisRoutes);
// app.use("/", hotelRoutes);
app.use("/", postRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
