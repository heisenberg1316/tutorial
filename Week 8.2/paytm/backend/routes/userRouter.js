const express = require("express");
const zod = require("zod");
const userRouter = express.Router();
const User = require("../models/Users");
const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;
const authMiddleware = require("../middlewares/authMiddleware");
const {
    signupSchema,
    signinSchema,
    updatedSchema,
} = require("../schemas/userSchemas");

userRouter.post("/signup",async (req,res) => {
    const body = req.body;
    try{
        const {success} = signupSchema.safeParse(body);
        const existingUser = await User.findOne({
            username : body.username
        })
    
        if(existingUser){
            return res.status(409).json({
                message : "Email already exists"
            })
        }
        else{
            const newUser = await User.create(body);
            const userId = newUser._id;
            const newAccount = await Account.create({
                userId,
                balance: 1 + Math.random() * 10000
            })
        
            const token = jwt.sign({
                userId : newUser._id,
            },JWT_SECRET);
            
            res.status(200).json({
                message : "User created successfully",
                token : token
            })
        }
    }
    catch(e){
        return res.status(400).json({
            messsage : "Incorrect Inputs or Password is small",
            error : e,
        })
    }
    
})

userRouter.post("/signin", async (req,res) => {
    const body = req.body;
    try{
        const {success} = signinSchema.safeParse(body);
        
        const existingUser = await User.findOne({
            username : body.username
        })
        if(!existingUser){
            return res.status(411).json({
                message : "Email doesn't exists"
            })
        }
        else{
            const passwordChecker = await User.findOne({
                username : body.username,
                password : body.password,
            })
            
            if(passwordChecker==null){
                return res.status(401).json({
                    message : "Password is incorrect",
                })
            }
            else{
                const token = jwt.sign({
                    userId : existingUser._id,
                },JWT_SECRET);
        
                res.status(200).json({
                    message : "User signin successfully",
                    token : token
                })
            }
        }
    }
    catch(err){
        return res.status(500).json({
            messsage : "Incorrect Inputs"
        })
    }
})

userRouter.get("/userdetail",authMiddleware, async (req,res) => {
    try{
        let findUser = await User.findOne({
            _id : req.userId
        })
        if(findUser==null){
            return res.json({
                message : "No user Found",
            })
        }
        else{
            res.status(200).json({
                id : findUser._id,
                firstName : findUser.firstName,
                lastName : findUser.lastName,
            })
        }
    }
    catch(err){
        res.json({
            message : "An error occured or no user found",
        })
    }
})


userRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updatedSchema.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
	let updatedUser = await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})
userRouter.get("/bulk", authMiddleware, async (req, res) => {
    const filter = req.query.filter || "";
    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": new RegExp(filter, "i"),
            }
        }, {
            lastName: {
                "$regex": new RegExp(filter, "i"),
            }
        }]
    })
    //the below map is used to send only neccessary things as a response and not private things like password
    let filteredUsers = users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id.toString(),
    }));
    filteredUsers = users.filter((user) => user._id != req.userId);


    res.json({
    user: filteredUsers
    });
})

module.exports = userRouter;