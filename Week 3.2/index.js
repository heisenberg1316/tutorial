const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://rawatmukul5000:MUKUL2003@cluster0.t64updt.mongodb.net/week3");

// Define Mongoose schema and model
const User = mongoose.model("User", {
    name: String,
    email: String,
    password: String,
});

// Signup endpoint
app.post("/signup", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                msg : "User already exists",
            });
        }
        const user = new User({ name, email, password });
        await user.save(); 

        res.status(200).json({
            msg: "User created successfully",
        });
    }
    catch (err) {
        res.status(500).json({
            error : "Internal Server Error",
        });
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server started on port 3000");
});
