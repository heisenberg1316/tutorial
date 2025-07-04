const fs = require("fs");

console.log("Start writing to file...");

// Write to file asynchronously
fs.writeFile("b.txt", "Hello from ChatGPT async write!", "utf-8", (err) => {
    console.log("Inside writeFile callback");
    if (err) {
        console.log("Error writing file:", err.message);
        return;
    }
    console.log("File written successfully!");
});

console.log("Now doing something else while writing happens...");


/* Output ->
        Start writing to file...
        Now doing something else while writing happens...
        Inside writeFile callback
        File written successfully!
*/