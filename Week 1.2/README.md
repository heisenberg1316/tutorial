# IMPORTANT Summary of the video

### ❓ Q: Why does my CPU usage graph show all cores being used even when running a single-threaded JavaScript loop?

🟢 **Answer:**

JavaScript (in Node.js or the browser) runs on a single thread, so it should ideally only use one logical CPU core.

However, your system has an Intel i3-1115G4 processor with:

- 🧩 2 physical cores
- 🧵 4 logical cores (due to Hyper-Threading)

The Windows CPU scheduler automatically moves threads between available logical cores for:

- ⚖️ Load balancing
- 🔥 Heat and power distribution
- ⚡ Energy efficiency

✅ As a result, your JavaScript loop (which is single-threaded) may jump between different cores, making it appear that all cores are being used — even though only one thread is active at any moment.


----------------------------------------


### ❓ Q: What is a function callback in JavaScript?

🟢 **Answer:**

A **callback function** is a function passed as an argument to another function, which is then invoked inside the outer function to complete some kind of routine or action.

Key points about callbacks:

- They allow asynchronous operations to be handled, such as event handling or API calls.
- Callbacks can be **synchronous** or **asynchronous**.
- They help in controlling the order of execution, especially in asynchronous code.
- Improper use of callback can lead to "callback hell".

Example:

```javascript
function greet(name, callback) {
  console.log("Hello " + name);
  callback();
}

function sayGoodbye() {
  console.log("Goodbye!");
}

greet("Alice", sayGoodbye);
```

Output:
Hello Alice
Goodbye!


----------------------------------------

### ❓ Q: What happens when `setTimeout` is used alongside a heavy loop?

🟢 **Answer:**

You're testing how `setTimeout` behaves when the main thread is busy.

### ✅ Code:

```javascript
function greet() {
    console.log("1 second happened, hello world");
}

setTimeout(greet, 1000); // Schedule greet() after 1000ms

for (let i = 0; i < 100000; i++) {
    console.log("value of i is", i);
}
```

### Step-by-Step Behavior:
- setTimeout(greet, 1000) schedules the greet() function to be queued after 1000 milliseconds.
- The for loop starts running immediately and prints values from 0 to 99999.
- Even if 1000ms passes during the loop, the greet() function:

    ❌ Does not interrupt the loop.
    ⏳ Waits in the event queue.
    ✅ Runs only after the loop (i.e., the call stack) finishes.

### Expected Output
  value of i is 0
  value of i is 1
  ...
  value of i is 99999
  1 second happened, hello world

### Why this happens ?
- JavaScript is single-threaded.
- The event loop delays executing greet() until the call stack is clear.
- So, setTimeout runs only after synchronous code (the loop) completes, even if the delay has technically passed.

----------------------------------------


