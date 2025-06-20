/*
  Implement a class `Calculator` having below methods
    - initialise a result variable in the constructor and keep updating it after every arithmetic operation
    - add: takes a number and adds it to the result
    - subtract: takes a number and subtracts it from the result
    - multiply: takes a number and multiply it to the result
    - divide: takes a number and divide it to the result
    - clear: makes the `result` variable to 0
    - getResult: returns the value of `result` variable
    - calculate: takes a string expression which can take multi-arithmetic operations and give its result
      example input: `10 +   2 *    (   6 - (4 + 1) / 2) + 7`
      Points to Note: 
        1. the input can have multiple continuous spaces, you're supposed to avoid them and parse the expression correctly
        2. the input can have invalid non-numerical characters like `5 + abc`, you're supposed to throw error for such inputs

  Once you've implemented the logic, test your code by running
*/

class Calculator {
    constructor(){
        this.total = 0;
    }
    add(value){
        this.total += value;
    }
    subtract(value){
        this.total -= value;
    }
    multiply(value){
        this.total *= value;
    }
    divide(value){
        if(value==0) throw new Error("cannot divide by 0");
        this.total = this.total/value;
    }
    clear(){
        this.total = 0;
    }
    getResult(){
        return this.total;
    }
    calculate(expression) {
          // Remove extra spaces
          const cleaned = expression.replace(/\s+/g, '');

          // Check for invalid characters
          if (/[^-()\d/*+.]/.test(cleaned)) {
              throw new Error("Invalid characters in expression");
          }

          // Use eval safely
          try {
              const result = eval(cleaned);
              if (!isFinite(result)) {
                  throw new Error("Result is not finite");
              }
              this.total = result;
          }
          catch (e) {
              throw new Error("Invalid expression");
          }
    }
}

module.exports = Calculator;
