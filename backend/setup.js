require("dotenv").config();
const mongoose = require('mongoose')

const username = process.env.mongoDB_username;
const password = process.env.mongoDB_password;
const cluster = "cluster0.qsv7dx5";
const dbname = "Account";

console.log(`mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`)

mongoose.connect(
    `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbname}?retryWrites=true&w=majority`, 
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const Trip = require('./models/trip');

const trip = new Trip({
    status: "Pending"
});

Trip.create(trip);