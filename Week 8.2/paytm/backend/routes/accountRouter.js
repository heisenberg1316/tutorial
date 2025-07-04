const express = require("express");
const accountRouter = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const Account = require("../models/Account");   
const mongoose = require("mongoose");

accountRouter.get("/balance",authMiddleware, async (req, res) => {
    try{
        const account = await Account.findOne({
            userId: req.userId
        });
        res.json({
            balance: account.balance
        })
    }
    catch(err){
        res.json({
            message : "User not found",
            error : err
        })
    }
})

accountRouter.post("/transfer", authMiddleware, async (req, res) => {
    const session = await mongoose.startSession();
    try {
        session.startTransaction();

        let { amount, to } = req.body;

        // Basic validations
        if (!amount || typeof amount !== "number" || amount <= 0) {
            return res.status(400).json({ message: "Invalid amount provided" });
        }

        const senderId = new mongoose.Types.ObjectId(req.userId);
        const receiverId = new mongoose.Types.ObjectId(to);

        // Fetch sender account
        const senderAccount = await Account.findOne({ userId: senderId }).session(session);
        if (!senderAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Sender account not found" });
        }

        if (senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // Fetch receiver account
        const receiverAccount = await Account.findOne({ userId: receiverId }).session(session);
        if (!receiverAccount) {
            await session.abortTransaction();
            return res.status(404).json({ message: "Receiver account not found" });
        }

        // Perform the balance update
        await Account.updateOne(
            { userId: senderId },
            { $inc: { balance: -amount } },
            { session }
        );

        await Account.updateOne(
            { userId: receiverId },
            { $inc: { balance: amount } },
            { session }
        );

        // Commit the transaction
        await session.commitTransaction();
        return res.status(200).json({ message: "Transfer successful" });

    } catch (error) {
        // Abort the transaction in case of error
        await session.abortTransaction();
        console.error("Transfer failed:", error);
        return res.status(500).json({
            message: "Error during transfer",
            error: error.message || error
        });
    } finally {
        // Always end the session
        await session.endSession();
    }
});



module.exports = accountRouter;