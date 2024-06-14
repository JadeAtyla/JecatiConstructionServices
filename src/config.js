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

const collection = new mongoose.model("students", LoginSchema)

module.exports = collection;