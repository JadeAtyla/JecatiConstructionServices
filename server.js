require('dotenv').config();
const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const moment = require('moment-timezone');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');

// Import models
const { Admin, Services, Transaction } = require('./src/config');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(error => console.error('MongoDB Connection Error:', error));

// Initialize Express app
const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// EJS template engine setup
app.set('view engine', 'ejs');

// Setup nodemailer transporter (use environment variables for email/password)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Current time in Manila timezone
const dateNow = moment().tz('Asia/Manila').format('YYYY-MM-DD HH:mm:ss');

// Session middleware for user sessions
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
    cookie: { maxAge: 3 * 60 * 60 * 1000 } // 3 hours
}));

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.redirect('/admin/login');
    }
};

// Multer storage configuration for file uploads
const uploadDir = path.join(__dirname, './public/images/uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage }).single('image');

// Routes
app.get("/", (req, res) => res.render('landing-page'));
app.get("/contact-us", (req, res) => res.render('contact-us'));
app.get("/about-us", (req, res) => res.render('about-us'));
app.get("/services", (req, res) => res.render('services'));
app.get("/admin/login", (req, res) => res.render("admin/login", { error: null }));
app.get("/admin/signup", (req, res) => res.render("admin/signup"));

// Pricing page with service data
app.get("/pricing", async (req, res) => {
    try {
        const services = await Services.find();
        res.render('pricing', { services });
    } catch (error) {
        console.error("Error fetching Pricing Services:", error);
        res.status(500).render('error', { error: "Error fetching Pricing Services" });
    }
});

// Signup route for admin with email verification
app.post("/admin/signup", async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.confirm, 10);
        const verificationToken = uuidv4();
        
        const newAdmin = new Admin({
            email: req.body.email,
            password: hashedPassword,
            fullname: req.body.fullname,
            role: "admin",
            startingDate: dateNow,
            verified: false,
            verificationToken
        });

        await newAdmin.save();

        const verificationLink = `${process.env.APP_URL}/verify?token=${verificationToken}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: "Admin Applicant",
            html: `<p>Admin Application:</p><p>Name: ${req.body.fullname}</p><p>Email: ${req.body.email}</p>
                   <p><a href="${verificationLink}">Verify Account</a></p>`
        };

        await transporter.sendMail(mailOptions);
        res.redirect('/admin/login');
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).render("admin/signup", { error: "Error during signup" });
    }
});

// Account verification
app.get("/verify", async (req, res) => {
    try {
        const { token } = req.query;
        const user = await Admin.findOne({ verificationToken: token });

        if (!user) return res.status(400).send('Invalid verification token');

        user.verified = true;
        await user.save();
        res.send('Account verified successfully');
    } catch (error) {
        console.error("Error verifying account:", error);
        res.status(500).send('Error verifying account');
    }
});

// Admin login
app.post("/admin/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Admin.findOne({ email });
        if (!user) return res.render("admin/login", { error: "Invalid Username" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.render("admin/login", { error: "Invalid Password" });
        if (!user.verified) return res.render("admin/login", { error: "Account not verified" });

        req.session.user = { _id: user._id, email: user.email };
        res.redirect('/admin/admin/');
    } catch (error) {
        console.error("Error logging in:", error);
        res.render("admin/login", { error: "Error logging in" });
    }
});

// Admin logout
app.get('/admin/logout', (req, res) => {
    req.session.destroy(error => {
        if (error) console.error("Error during logout:", error);
        res.redirect("/admin/login");
    });
});

// Admin dashboard
app.get("/admin/admin", authenticateUser, async (req, res) => {
    try {
        const [admin, transaction, services] = await Promise.all([
            Admin.find(), Transaction.find(), Services.find()
        ]);

        res.render('admin/admin', {
            transaction, admin, services, user: req.session.user
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).render('error', { error: "Error fetching admin dashboard data" });
    }
});

// Add or edit service route
app.post("/admin/add-edit-service/:id?", upload, async (req, res) => {
    const { category, unit, price } = req.body;

    if (!req.file) return res.status(400).json({ error: "Please upload a file." });

    try {
        const serviceData = {
            category,
            unit,
            price,
            availability: 'available',
            addedDate: dateNow,
            image: req.file.filename
        };

        if (req.params.id) {
            const updatedService = await Services.findByIdAndUpdate(req.params.id, serviceData, { new: true });
            if (!updatedService) return res.status(404).json({ error: "Service not found" });
            console.log('Service Updated Successfully');
        } else {
            const newService = new Services(serviceData);
            await newService.save();
            console.log('Service Added Successfully');
        }
        res.redirect('/admin/admin');
    } catch (error) {
        console.error("Error adding or editing service:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Handle data fetching route for debugging purposes
app.get("/getData", async (req, res) => {
    try {
        const data = await Promise.all([Admin.find(), Services.find(), Transaction.find()]);
        res.json({ admin: data[0], services: data[1], transaction: data[2] });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

const port = 5600;
app.listen(port, () => {
    console.log("Server Running on port: ", port);
});

module.exports = app;
