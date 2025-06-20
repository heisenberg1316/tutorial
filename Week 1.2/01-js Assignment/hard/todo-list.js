/*
  Implement a class `Todo` having below methods
    - add(todo): adds todo to list of todos
    - remove(indexOfTodo): remove todo from list of todos
    - update(index, updatedTodo): update todo at given index
    - getAll: returns all todos
    - get(indexOfTodo): returns todo at given index
    - clear: deletes all todos

  Once you've implemented the logic, test your code by running
*/

class Todo {
    constructor() {
        this.todos = []; // initialize empty array to hold todos
    }

    // Add a new todo
    add(todo) {
        this.todos.push(todo);
    }

    // Remove a todo by index
    remove(index) {
        if(index >= 0 && index < this.todos.length) {
            this.todos.splice(index, 1);
        }
    }

    // Update a todo at a specific index
    update(index, updatedTodo) {
        if(index >= 0 && index < this.todos.length) {
          this.todos[index] = updatedTodo;
        }
    }

    // Get all todos
    getAll() {
        return this.todos;
    }

    // Get a single todo by index
    get(index) {
        if(index >= 0 && index < this.todos.length) {
          return this.todos[index];
        }
        return null;
    }

    // Clear all todos
    clear() {
        this.todos = []; // simply reassign to a new empty array
    }
}

module.exports = Todo;


module.exports = Todo;
