const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');
const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');

// App
const app = express();

// Converts all data into JSON format
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve the static files
app.use(express.static("public"));

// This will be used for html static files only
// For static and indexing pages use
// app.get("/", (req, res)=>{
//     res.sendFile(path.resolve(__dirname, '../public', 'server.html'));
// })

// This will be used if you have the ejs file as the viewing engine, html code is inside it too
// For dynamic database usage
app.set('view engine', 'ejs');

app.get("/contact-us", (req, res) => {
    res.render('contact-us');
});
app.get("/landing-page", (req, res) => {
    res.render('landing-page');
});
app.get("/about-us", (req, res) => {
    res.render('about-us');
});
app.get("/services", (req, res) => {
    res.render('services');
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "jecaticonstructionsevices@gmail.com",
        pass: "qmumpfafphuslahz"
    },
    tls: {
        rejectUnauthorized: false
    }
});

const mainOptions = {
    from: "jecaticonstructionsevices@gmail.com",
    to: "jecaticonstructionsevices@gmail.com",
    subject: "Handshake Trial",
    html: "This is a handshake trial using nodemailer.<button>Yes</button>"
}

app.post("/send-email", async (req, res) => {
    try{
        transporter.sendMail(mainOptions, function (error, info) {
            if(error){
                console.log(error);
            }else{
                console.log("Sent Succesfully")
            }
        });

    }catch(err){
        console.error(err);
    }

    res.redirect('/contact-us');
});

const port = process.env.port || 5600;
app.listen(port, ()=>{
    console.log("Server Running on port: ", port);
});