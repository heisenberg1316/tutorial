const express = require("express");
const zod = require("zod");
const app = express();

const kidneySchema = zod.array(zod.number()); //schema for array of numbers
app.use(express.json());

app.post("/health-checkup", function(req, res){
    console.log("req. body is ", req.body);
    const kidneys = req.body.kidneys;
    const response = kidneySchema.safeParse(kidneys);
    return res.send({
        response
    });
})


app.listen(3000, () => {
    console.log("App is listening on port 3000");
})