const express = require("express");
const app = express();
const db = require("./db/index.js");
const cors = require("cors");
const {createTodo, updateTodo} = require("./types.js");
const todo = require("./models/Todo.js");
require("dotenv").config();

app.use(express.json());
app.use(cors());
db();

app.post("/todos", async (req, res) => {
    const createPayload = req.body;
    const parsedPayload = createTodo.safeParse(createPayload);
    console.log("cratepayload is ", createPayload)
    if(!parsedPayload.success){
        return res.status(411).json({
            message : "You sent the wrong inputs"
        })
    }

    await todo.create({
        title : createPayload.title,
        description : createPayload.description,
        completed : false,
    })

    return res.status(200).json({
        msg : "Todo created",
    })
})


app.get("/todos", async (req, res) => {
    const todos = await todo.find({});
    return res.status(200).json({
        msg : "Todo fetched",
        data : todos,
    })
})

app.put("/completed", async (req, res) => {
    const todoData = req.body;
    const parsedTodo = updateTodo.safeParse(todoData);
    if(!parsedTodo.success){
        return res.status(411).json({
            message : "You sent the wrong todo"
        })
    }

    await todo.updateOne({_id : req.body.id,}, {
        completed : true,
    })

    return res.status(200).json({
        msg : "Todo updated",
    })

})

app.listen(3000, () => {
    console.log("app is listening on port 3000");
})