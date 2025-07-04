const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const Admin  = require("../models/Admin");
const Course = require("../models/Course");
const router = Router();

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

    return res.status(201).json({
        msg: "Admin created successfully",
    });

});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const {title, description, imageLink, price} = req.body;
    const result = await Course.findOne({title, description, imageLink, price});
    if(result){
        //course already exist
        return res.status(400).json({
            msg : "Course already exist with same details",
        })
    }
    else{
        const newCourse = await Course.create({
            title,
            description,
            imageLink,
            price,
        })
        
        return res.status(200).json({
            message : "Course created successfully",
            courseId : newCourse._id,
        })   
    }

});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({});
    return res.status(200).json({
        message : "Fetched all courses successfully",
        data : allCourses,
    })
}); 

module.exports = router;