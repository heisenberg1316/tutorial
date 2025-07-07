"use strict";
// interface User {
//     firstname : string,
//     lastname : string,
//     age : number,
//     email ?: string, //optional argument
// }
// function islegal(user : User) : boolean{
//     if(user.age > 18) return true;
//     return false;
// }
// function greet(id: number | string) : number{
//     console.log("hello");
//     return 2;
// }
// type keyInput = "up" | "down" | "left" | "right";
// enum Direction {
//     "Up",
//     "Down",
//     "Left",
//     "Right",
// }
// function doSomething(keyPressed : Direction){
//     console.log("keypressed is ", keyPressed);
// }
// doSomething(Direction.Left);
// function hello(cb : () => void) : void{
//     let ans = cb();
//     console.log("ans contains ", ans);
// }
// hello(() => {
//     console.log("hello ji");
//     return 10;
// })
//generic example
function fun(arg) {
    return arg;
}
let output1 = fun("hello");
let output2 = fun(2);
console.log("output1 is ", output1);
console.log("output2 is ", output2);
const user = {
    firstName: "harkirat",
    lastName: "singh",
    email: "email@gmail.com",
    age: 21,
};
console.log("userobj is ", user);
