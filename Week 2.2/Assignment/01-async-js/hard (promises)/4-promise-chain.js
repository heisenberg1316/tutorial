/*
 * Write 3 different functions that return promises that resolve after t1, t2, and t3 seconds respectively.
 * Write a function that sequentially calls all 3 of these functions in order.
 * Return a promise chain which return the time in milliseconds it takes to complete the entire operation.
 * Compare it with the results from 3-promise-all.js
 */

function wait1(t) {
    return new Promise(resolve => setTimeout(resolve, t*1000));
}

function wait2(t) {
    return new Promise(resolve => setTimeout(resolve, t*1000));
}

function wait3(t) {
    return new Promise(resolve => setTimeout(resolve, t*1000));
}

function calculateTime(t1, t2, t3) {
    const start = Date.now();
     return wait1(t1)
    .then(() => wait2(t2))
    .then(() => wait3(t3))
    .then(() => Date.now() - start); // return elapsed time in ms
}

module.exports = calculateTime;

//comparison with promise.all
/*
    Let’s say you pass t1=1, t2=2, t3=3.
    In Promise.all, total time ≈ 3s (because they run in parallel)
    In this sequential version, time ≈ 1 + 2 + 3 = 6s → and the result will be around 6000 ms
*/