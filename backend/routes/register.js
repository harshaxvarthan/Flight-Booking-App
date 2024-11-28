var express = require('express');
var router = express.Router();
var User = require('../models/User');
var bcrypt = require('bcrypt');
var moment = require('moment');
var bodyParser = require('body-parser');

// Body-Parser Middleware
var jsonParser = bodyParser.json();

router.get('/', (req, res) => {
    res.send("Register Here");
});

router.post('/', jsonParser, async (req, res) => {
    try {
        // Check for required fields
        const { name, email, password, mobile, gender, dob } = req.body;
        if (!name || !email || !password || !mobile || !gender || !dob) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash Password
        const hashPassword = await bcrypt.hash(password, 10);

        let user = {
            name,
            email,
            password: hashPassword,
            mobile,
            gender,
            dob: moment(dob).format('YYYY-MM-DD')
        };

        let newUser = new User(user);
        newUser.save((err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Error saving user." });
            }
            res.status(201).json({ message: "User registered successfully.", user: result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error." });
    }
});

module.exports = router;
