import { createApp } from "vue";
import App from "./App.vue";

// Adjust path if your CSS file is elsewhere
import "./style.css";

// Import Router
import router from "./router";

// Import Store
import store from "./store";

// Import Library
import "flowbite";

const app = createApp(App);

app.use(store).use(router).mount("#app");
