require("dotenv").config();
const mongoose = require('mongoose')

const username = process.env.USER_NAME;
const password = process.env.PASSWORD;
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

const userSchema = new mongoose.Schema({
    user_id: {
        type: Number,
        require: true
    },
    first_name: String,
    last_name: String,
    email: String,
    dob: Date
});

const User = mongoose.model('User', userSchema);

const user = new User({
    first_name: 'Jiebin',
    last_name: 'Liang',
    email: 'jcl287@scarletmail.rutgers.edu',
    dob: new Date()
});

user.save();