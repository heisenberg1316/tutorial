const express = require("express");
const mainRouter = require("./routes/mainRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const connectDB = require("./config/db");
const accountRouter = require("./routes/accountRouter");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT
//or we can use body-parser also(npm-library)
app.use(express.json()); 
app.use(cors({
  origin: 'http://localhost:5173', // or whatever port your frontend runs on
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));


app.use("/api/v1",mainRouter);
app.use("/api/v1/user",userRouter);
app.use("/api/v1/account",accountRouter);
    
connectDB();

app.listen(PORT,() => {
    console.log("app is listening on PORT NO. ",PORT);
});
