const mongoose = require('mongoose'); // requires as the middleware for the database connection
const connect = mongoose.connect('mongodb+srv://jecati:F9CjoV9hkOwUhvkC@cluster0.czkfeze.mongodb.net/school'); // connection string

connect.then(()=>{
    console.log("Database Connected.");
}).catch((err)=>{
    console.log("Connection Error: ", err);
});

// Create a Schema 
const LoginSchema = new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    }
});

const LoginSchema1 = new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    }
});

const LoginSchema2 = new  mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true
    },
    verificationToken: {
        type: String,
        required: true
    }
});

// Collection Part 
const Admin = new mongoose.model("admin", LoginSchema);
const Services = new mongoose.model("services", LoginSchema1);
const Transaction = new mongoose.model("transaction", LoginSchema2);

module.exports = {Admin, Services, Transaction};