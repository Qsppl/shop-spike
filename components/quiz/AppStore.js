'use strict';

import {
  define
} from "../../node_modules/hybrids/src/index.js";

// Custom property trasfrom for JSON support
// from element attribute.
function parseJSON(value = []) {
  return typeof value === "string" ? JSON.parse(value) : value;
}

export function addTodo(store, todo) {
  // If todo is empty do nothing
  if (!todo) return;

  // Set new list of todos
  store.todos = [...store.todos, todo];
}

export function removeTodo(store, index) {
  // Todos should be immutable, so we create
  // copy of current todos state
  const todos = store.todos.slice(0);

  // Remove index
  todos.splice(index, 1);

  // Finally set new todos list (new array)
  store.todos = todos;
}

export default define({
  tag: "app-store",
  todos: {
    set(host, value, lastValue) {
      return parseJSON(value)
    }
  }
});