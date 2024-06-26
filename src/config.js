const moment = require('moment-timezone');
const mongoose = require('mongoose'); // requires as the middleware for the database connection
const connect = mongoose.connect('mongodb+srv://jecati:jecati@cluster0.ndbrc8d.mongodb.net/jecaticonstructionservices'); // connection string

connect.then(() => {
    console.log("Database Connected.");
}).catch((err) => {
    console.log("Connection Error: ", err);
});

const dateNow = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');

// Create a Schema 
const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin'],
        required: true
    },
    startingDate: {
        type: Date,
        default: dateNow,
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

const servicesSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['construction services', 'heavy equipment rental'],
        required: true
    },
    unit: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    availability: {
        type: String,
        enum: ['available', 'not available', 'removed'],
        required: true
    },
    addedDate: {
        type: Date,
        default: dateNow,
        required: true
    }
});

const transactionSchema = new mongoose.Schema({
    contactPerson: { 
        type: String, 
        required: true 
    },
    contactNumber: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    services: [
        { 
            type: String, 
            enum: ['construction services', 'heavy equipment rental'],
            required: true 
        }
    ],
    startingDate: {
         type: Date, 
         default: dateNow,
         required: true 
        },
    dueDate: { 
        type: Date, 
        required: true 
    },
    location: { 
        type: String, 
        required: true 
    },
    status: { 
        type: ['paid', 'unpaid', 'on-going', 'overdue'], 
        required: true 
    }
});

// Collection Part 
const Admin = new mongoose.model("admins", adminSchema);
const Services = new mongoose.model("services", servicesSchema);
const Transaction = new mongoose.model("transactions", transactionSchema);

module.exports = { Admin, Services, Transaction };