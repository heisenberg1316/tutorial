/*
Write a function that calculates the time (in seconds) it takes for the JS code to calculate sum from 1 to n, given n as the input.
Try running it for
1. Sum from 1-100
2. Sum from 1-100000
3. Sum from 1-1000000000
Hint - use Date class exposed in JS
There is no automated test for this one, this is more for you to understand time goes up as computation goes up
*/

function calculateTime(n) {
  const start = new Date(); // get start time
  console.log("start is ", start);
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }

  const end = new Date(); // get end time
  console.log("end is ", end);
  const timeTaken = (end - start) / 1000; // convert ms to seconds
  return timeTaken;
}

console.log("Total time taken is " + calculateTime(500000000) + " seconds");

// Output
// start is  2025-06-08T10:23:58.365Z
// end is  2025-06-08T10:23:58.880Z
// Total time taken is 0.515 seconds

