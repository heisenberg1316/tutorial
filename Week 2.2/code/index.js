const express = require("express");
const app = express();
const port = process.env.port || 3000;

app.use(express.json());

app.get("/", function(req, res){
    console.log("hello ji");
    res.send("hello world");
})

 
app.listen(port, () => {
    console.log("app is listening on port ", port);
});
