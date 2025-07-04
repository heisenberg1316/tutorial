const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    // Schema definition here
    title : String,
    description : String,
    imageLink : String,
    price : Number,
});

module.exports = mongoose.model("Course", CourseSchema);