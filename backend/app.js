var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
const cors = require('cors');

var app = express();

// Login and Register 
require('./auth/auth');
const login = require('./routes/login');
const loggedInPage = require('./routes/loggedInUser');
// ----------------------------------------------------

// Other routes
const bookingRoute = require('./routes/routeSelection');
var registerRouter = require('./routes/register');
//--------------------------------------------------------

// DB Config
const DB_URL = require('./config/keys').MongoURI;

// Connect to MongoDB
//---------------------------------------------
mongoose.connect(DB_URL)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch(err => {
        console.error("Error connecting to MongoDB:", err);
    });
//---------------------------------------------

// Middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// CORS setup (allowing all origins for testing, change this for production)
app.use(cors({ origin: '*' }));

// Routes
app.use('/login', login);  // Explicitly map the login route to /login
app.use('/booking', bookingRoute);  // Booking route
app.use('/register', registerRouter);  // Register page
app.use('/user', passport.authenticate('jwt', { session: false }), loggedInPage);  // Secure user route

module.exports = app;
