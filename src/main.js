// import { createApp } from "vue";
// import store from "./store";
// import router from "./router";
// import "./style.css";
// import App from "./App.vue";

// createApp(App).use(store).use(router).mount("#app");

import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./style.css";

// ✅ Import Toastify and CSS
import Vue3Toastify from "vue3-toastify";
import "vue3-toastify/dist/index.css";

// ✅ Create app and use toast
const app = createApp(App);
app.use(store);
app.use(router);

// ✅ Register the toast plugin
app.use(Vue3Toastify, {
  autoClose: 3000,
  position: "top-right",
  theme: "colored",
});

app.mount("#app");

