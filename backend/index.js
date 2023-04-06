require("dotenv").config();
const mongoose = require('mongoose');
const passport = require('passport');
const bodyParser = require("body-parser");
const cors = require("cors");

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
const tripHisRoutes = require("./routes/tripHistory");
const payHisRoutes = require("./routes/payHistory");
const postRoutes = require("./routes/posts");
const amadeusRoutes = require("./routes/amadeus");
const payMethodRoutes = require("./routes/PayMethod");
const paypalRoutes = require("./routes/paypal-api");

app.use("/", userRoutes);
app.use("/", tripRoutes);
app.use("/", friendRoutes);
app.use("/", tripHisRoutes);
app.use("/", payHisRoutes);
app.use("/", payMethodRoutes);
app.use("/", paypalRoutes);
app.use("/", postRoutes);
app.use("/", amadeusRoutes)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
