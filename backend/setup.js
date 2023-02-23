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
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email:{type: String, unique: true, required : true},
    password: {type: String, required: true},
    dob: {type: Date, required: true},
    is_mod: {type: Boolean, required: true}
});

const User = mongoose.model('User', userSchema);

const user = new User({
    first_name: 'Jiebin',
    last_name: 'Liang',
    email: 'jcl287@scarletmail.rutgers.edu',
    password: 'admin123',
    dob: new Date('Sept 8, 2001'),
    is_mod: false
});

User.create(user);