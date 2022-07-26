'use strict';

import {
  define,
  html,
  parent
} from "../../node_modules/hybrids/src/index.js";
import AppStore, {
  addTodo
} from "./AppStore.js";

function submit(host, event) {
  event.preventDefault();

  // If input is empty do nothing
  if (!host.input) return;

  // Call 'add' function from store definition
  // and add new todo
  addTodo(host.store, host.input);

  // Clear input
  host.input = "";
}

function handleInput(host, {
  target
}) {
  host.input = target.value;
}

export default define({
  tag: "app-form",
  store: parent(AppStore),
  input: "",
  render: ({
    input,
    store: {
      todos
    }
  }) => html `
    <h3>Form (${todos.length})</h3>

    <form onsubmit="${submit}">
      <input
        type="text"
        placeholder="Name"
        value="${input}"
        oninput="${handleInput}"
      />
      <button type="submit">Add</button>
    </form>
  `
});