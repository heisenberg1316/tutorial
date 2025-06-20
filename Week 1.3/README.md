# IMPORTANT Summary of the video

## Array

### ❓ Q: Why am I able to change the array if I initialize it with `const`?

🟢 **Answer:**
Using `const` in JavaScript means that you're declaring that the binding of initialarray cannot be reassigned., **but it does not make the array immutable**. This is because arrays (and objects) in JavaScript are stored by reference. The const only locks the reference, not the internal data.

When you declare:

```js
const initialarray = [1, 2, 3];
initialarray[1] = 10; // Allowed
initialarray.push(4); // Allowed
initialarray = [4, 5, 6]; // Error: Assignment to constant variable
```
If you want to prevent modifications to the contents, we can use:

```js
Object.freeze(initialarray);
initialarray[1] = 99; // ❌ Has no effect in non-strict mode
```

---------------------------

## JSON

### ❓ Q: How to use JSON methods like JSON.parse and JSON.stringfy?

🟢 **Answer:**
JavaScript provides two core JSON methods:

1. ✅ JSON.stringify() — Convert Object → JSON String
```js
const user = { name: "Mukul", age: 21 };
const jsonString = JSON.stringify(user);
console.log(jsonString);
// Output: {"name":"Mukul","age":21}
```
📌 Use this when you want to:
- Send data to a server (e.g., in a POST request)
- Store objects in localStorage or files


2. ✅ JSON.parse() — Convert JSON String → Object
```js
const jsonData = '{"name":"Mukul","age":21}'; // ✅ Keys must be in double quotes
const userObj = JSON.parse(jsonData);
console.log(userObj.name); // Output: Mukul
```
⚠️ Important Note:
- When using JSON.parse(), the JSON string must have keys in double quotes ("), or it will throw an error.

