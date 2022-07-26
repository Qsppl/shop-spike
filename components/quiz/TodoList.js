'use strict';

import { define, store, html } from "/node_modules/hybrids/src/index.js"

const User = {
  id: true,
  firstName: "",
  lastName: "",
  [store.connect] : {
    get: id => {
      let data = new Map();
      data.set("2", {firstName: 'Karburator', lastName: "vitalyevich"})
      return data.get(id)
    },
  },
};

define({
  tag: "my-user-details",
  user: store(User),
  render: ({ user }) => html`
    <div>
      ${store.pending(user) && `Loading...`}
      ${store.error(user) && `Something went wrong...`}

      ${store.ready(user) && html`
        <p>${user.firstName} ${user.lastName}</p>
      `}
    </div>
  `,
});