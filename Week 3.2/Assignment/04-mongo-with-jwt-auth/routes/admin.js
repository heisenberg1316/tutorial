const { Router } = require("express");
const Admin = require("../models/Admin");
const User = require("../models/User");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Admin Routes
router.post('/signup', async (req, res) => {
    // Implement admin signup logic
    const {username, password} = req.body;
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
        return res.status(409).json({
            msg: "Admin already exists",
        });
    }

    // Create admin without using `new`
    await Admin.create({ username, password });

    return res.status(200).json({
        msg: "Admin created successfully",
    });
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const {username, password} = req.body; 
    const admin = await Admin.findOne({username, password});
    if(!admin){
        return res.status(400).json({
            message : "Incorrect username and password for admin",
        })
    }
    const token = jwt.sign({username}, JWT_SECRET);
    return res.status(200).json({
        token,
    })
});

router.post('/courses', adminMiddleware, (req, res) => {
    // Implement course creation logic
});

router.get('/courses', adminMiddleware, (req, res) => {
    // Implement fetching all courses logic
});

module.exports = router;