const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const {Admin, Services, Transaction} = require('./config'); //collections
const nodemailer = require('nodemailer');
const {v4: uuidv4} = require('uuid');
const multer = require('multer');
const moment = require('moment-timezone');
const fs = require('fs');

//current time in manila/ph
const dateNow = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');

// App
const app = express();

// Converts all data into JSON format
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Serve the static files
app.use(express.static("public"));

// This will be used if you have the ejs file as the viewing engine, html code is inside it too
// For dynamic database usage
app.set('view engine', 'ejs');
// To contact us page
app.get("/contact-us", (req, res) => {
    res.render('contact-us');
});
// To landing page
app.get("/landing-page", (req, res) => {
    res.render('landing-page');
});
// To about us page
app.get("/about-us", (req, res) => {
    res.render('about-us');
});
// To services page
app.get("/services", (req, res) => {
    res.render('services');
});
// To pricing page
app.get("/pricing", async (req, res) => {
    try {
        const services = await Services.find().exec();

        res.render('pricing', {
            services: services,
        });
    } catch (error) {
        console.error("Error fetching Pricing Services:", error);
        res.status(500).render('error', { error: "Error fetching Pricing Services" });
    }
});
//To the adding services page
app.get("/admin/services", (req, res) => {
    res.render('admin/add-services.ejs');
});

// fetching all data while rendering page
app.get("/admin/admin", async (req, res) => {
    try {
        const admin = await Admin.find().exec();
        const transaction = await Transaction.find().exec();
        const services = await Services.find().exec();

        res.render('admin/admin', {
            transaction: transaction,
            admin: admin,
            services: services,
        });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).render('error', { error: "Error fetching transactions" });
    }
});


// getting the senders gmail access
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

// prepared statement to the receiver
const mainOptions = {
    from: "jecaticonstructionsevices@gmail.com",
    to: "jecaticonstructionsevices@gmail.com",
    subject: "Handshake Trial",
    html: ""
};


// this is the functionality for generated emails
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

// this functionality is for signing up as admin
app.post("/admin-signup", async (req, res) =>{
    const data = {
        username: req.body.username,
        password: await bcrypt.hash(req.body.password, 10),
        verified: false,
        verificationToken: uuidv4()
    };
    
    const verificationToken = `http://localhost:5600/verify?token=${data.verificationToken}`;    
    mainOptions.html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
</head>
<body style="font-size: 16px; padding: 50px; font-family: 'Inter', sans-serif; background-color: #14213D; color: white;">

    <h3>Dear Sir Tiu</h3>

    <p>We are pleased to inform you that this applicant applied for an administrative position within our company.</p>

    <h3 style="margin-top: 10px;">Applicant Details:</h3>
    <p style="margin-top: 5px;">
        Name: ${req.body.name}<br>
        Username: ${req.body.username}<br>
        Position: Admin<br>
        Responsibilities: System Management and Produce Services Results
    </p>

    <p>Please indicate your decision by marking one of the options below:</p>

    <button style="margin-top: 10px; font-size: 16px; width: 50%; background-color: green; color: white; border-radius: 20px; padding: 10px; transition: transform 0.3s ease; font-weight: bold;"><a href="${verificationToken}" style="text-decoration: none; color: white;">Yes, I accept the applicant.</a></button>
    <button style="margin-top: 10px; font-size: 16px; width: 50%;  background-color: red; color: white; border-radius: 20px; padding: 10px; transition: transform 0.3s ease; font-weight: bold;">No, I do not accept the applicant.</button>

</body>
</html>`

    try {
        const userData = await Admin.insertMany(data);
        transporter.sendMail(mainOptions, function (error, info){
            if (error) {
              // pop up for error
              console.log(error);
            } else {
                // pop up for verification with username
                console.log("Success");
            }
        });
    } catch (error) {
        // pop up with error message
        console.log(error);
    }

    res.redirect('/admin');
});

// Verify User
app.get("/verify", async (req, res) => {
    const token = req.query.token;
    console.log("Verification token:", token);

    try {
        // Find the user with the verification token
        const user = await Admin.findOne({ verificationToken: token });
        console.log("User found with token:", user);

        if (!user) {
            return res.status(400).send('Invalid verification token');
        }
        // Mark the user as verified in the database
        await Admin.updateOne({ _id: user._id }, { $set: { verified: true } });
        console.log("User verified:", user);

        res.status(201).send('Account verified successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error verifying account');
    }
});

const uploadDir = path.join(__dirname, '../public/images/uploads');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Multer upload middleware setup
const upload = multer({ storage: storage }).single('image');

// Route to handle file upload and form data
app.post("/add-service", upload, async (req, res) => {
    const { category, unit, price } = req.body;
    const dateNow = new Date(); // Assuming dateNow is defined elsewhere

    // Check if file upload was successful
    if (!req.file) {
        return res.status(400).json({ error: "Please upload a file." });
    }

    const service = {
        category: category,
        unit: unit,
        price: price,
        availability: 'available',
        addedDate: dateNow,
        image: req.file.filename
    };

    try {
        if (!category || !unit || !price) {
            return res.status(400).json({ error: "All fields are required." });
        } else {
            // Assuming Services is a model or database connection to insert data
            await Services.insertMany(service);
            console.log('Service Added Successfully');
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    res.redirect('admin/admin'); // Redirect after successful upload
});

const port = process.env.port || 5600;
app.listen(port, ()=>{
    console.log("Server Running on port: ", port);
});