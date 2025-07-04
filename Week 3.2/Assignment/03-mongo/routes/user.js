const mongoose = require("mongoose");
const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const User = require("../models/User");
const Course = require("../models/Course");

// User Routes
router.post('/signup', async (req, res) => {
    // Implement user signup logic
    const {username, password} = req.body;
    const result = await User.findOne({username, password});
    if(result){
        return res.status(400).json({
            message : "User already exist",
        })
    }
    else{
        const newUser = await User.create({username, password});
        return res.status(200).json({
            message : "User created Successfully",
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const result = await Course.find({});
    return res.status(200).json({
        message : "Fetched all courses successfully",
        data : result,
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;
    
    const user = await User.findOne({ username });
    // Check if course already purchased
    const isAlreadyPurchased = user.purchasedCourses.some(id =>
        id.equals(courseId) // use equals to compare ObjectIds
    );

    if (isAlreadyPurchased) {
        return res.status(400).json({
            message: "Course already purchased"
        });
    }

    const result = await User.updateOne({username}, {
        "$push" : {
            purchasedCourses: new mongoose.Types.ObjectId(courseId)
        }
    })

    return res.status(200).json({
        message : "Course purchased successfully",
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic 
    const {username} = req.headers;
    const user = await User.findOne({username})

     // Populate purchased course details
    const purchasedCourses = await Course.find({
        _id: { "$in" : user.purchasedCourses }
    });

    return res.status(200).json({ purchasedCourses });

});

module.exports = router