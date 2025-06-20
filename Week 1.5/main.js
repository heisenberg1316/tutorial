const { promises } = require("dns");
const fs = require("fs");

function onDone(data){
    console.log(data);
}

//without promises
function wrapper(cb){ //requires a callback function
    fs.readFile("a.txt", "utf-8", function(err, data){
        console.log("inside without promises");
        cb(data);
    })
}
wrapper(onDone);


//with promises
function wrapper2(){ //notice no callback function
    return new Promise(function(resolve){
        fs.readFile("a.txt", "utf-8", function(err, data){
            console.log("inside with promises");
            resolve(data);
        })  
    })
}
wrapper2().then(onDone);

