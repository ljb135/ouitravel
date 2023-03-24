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
const Activity = require('./models/activity');
const Location = require('./models/location');
const Flight = require('./models/flight');
const Hotel = require('./models/hotel');
const Payment = require('./models/payment');


const payment = new Payment({
    price: 1234,
    creator_id: mongoose.Types.ObjectId("63ffcb2f520f04fce809870c"),
    trip_id: mongoose.Types.ObjectId("6416f5eed9c0268aff676c11"),
    date : new Date().toJSON().slice(0,10)
});

Payment.create(payment);  


// Location.insertMany([
//     {
//         name: "Las Vegas",
//         country: "USA",
//         rating: "4.5"
//     },
//     {
//         name: "San Jose",
//         country: "USA",
//         rating: "4.7"
//     },
//     {
//         name: "New York City",
//         country: "USA",
//         rating: "4.2"
//     }
// ]);

// Activity.insertMany([
//     {
//         name: "Museum of Modern Art",
//         rating: 4.8,
//         price: 30,
//         is_indoor: true,
//         location: mongoose.Types.ObjectId("6416f47360181ea99065035b")
//     }
// ])

// Hotel.insertMany([
//     {
//         name: "Hotel Columbia",
//         rating: 4.8,
//         price: 30,
//         location: mongoose.Types.ObjectId("6416f47360181ea99065035b")
//     }
// ])

// Flight.insertMany([
//     {

//     }
// ])

//const trip = new Trip({
  //  status: "Duplicate",
    //visibility: "Delete API Test",
    //start_date: "1/21/2023",
    //end_date: "5/16/2023",
    //price: 1500,
    //destination_id: mongoose.Types.ObjectId("6416f47360181ea99065035b"),
    //hotel_ids: [mongoose.Types.ObjectId("6416f47360181ea99065035c")],
    //activity_ids: [mongoose.Types.ObjectId("6416ce4bdad2fae420807c7d"), mongoose.Types.ObjectId("6416f2c0d187b8f01efd5acd")],
    //creator_id: mongoose.Types.ObjectId("63ffcb2f520f04fce809870c"),
    //collaborator_ids: [mongoose.Types.ObjectId("64152eb6a874c4e143d5b840")]
//});

//Trip.create(trip);
