const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
    // Schema definition here
    username : String,
    password : String,
});

module.exports = mongoose.model("Admin", AdminSchema);