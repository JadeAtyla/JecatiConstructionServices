const mongoose = require('mongoose'); // requires as the middleware for the database connection
const connect = mongoose.connect('mongodb+srv://jecati:jecati@cluster0.ndbrc8d.mongodb.net/jecaticonstructionservices'); // connection string

connect.then(()=>{
    console.log("Database Connected.");
}).catch((err)=>{
    console.log("Connection Error: ", err);
});

// Create a Schema 
const adminSchema = new  mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    startingDate: {
        type: Date,
        default: Date.now,
        required: true
    },
    endDate: {
        type: Date,
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

const servicesSchema = new  mongoose.Schema({
    rentalService: {
        type: String,
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Boolean,
        required: true
    }
});

const transactionSchema = new  mongoose.Schema({
    date: {
        type: String,
        required: true
    },
    person: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
});

// Collection Part 
const Admin = new mongoose.model("admins", adminSchema);
const Services = new mongoose.model("services", servicesSchema);
const Transaction = new mongoose.model("transactions", transactionSchema);

module.exports = {Admin, Services, Transaction};