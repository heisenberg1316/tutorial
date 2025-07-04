const fs = require("fs");

console.log("Start reading file...");

fs.readFile("a.txt", "utf-8", (err, data) => {
    console.log("inside readfile");
    if (err) {
        console.log("Error reading file:", err.message);
        return;
    }
    console.log("File content:", data);
});

console.log("Now doing an expensive operation...");

let total = 0;
async function expensiveOperation(){    
    // 🔁 Expensive loop (simulate heavy CPU work)
    for (let i = 0; i < 1000000000; i++) {
        if(i==10000){
            console.log("reached till 10000");
            try{
                console.log("now doing fetch call");
                let result = await fetch("https://jsonplaceholder.typicode.com/posts/1")
                console.log("data is fetched");
                result = await result.json();
                console.log("data is processed completely");
                console.log("result is ", result);
            }
            catch(err){
                console.log("err is ", err.message);
            }
        }
        total += 1;
    }
    console.log("loop is over");

}

expensiveOperation();

console.log("Expensive operation done. Total is:", total);


/* Output :->
        Start reading file...
        Now doing an expensive operation...
        reached till 10000
        now doing fetch call
        Expensive operation done. Total is: 10000
        inside readfile
        File content: hello ji
        data is fetched
        data is processed completely
        result is  {
            userId: 1,
            id: 1,
            title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
            body: 'quia et suscipit\n' +
                'suscipit recusandae consequuntur expedita et cum\n' +
                'reprehenderit molestiae ut ut quas totam\n' +
                'nostrum rerum est autem sunt rem eveniet architecto'
        }
        loop is over
*/