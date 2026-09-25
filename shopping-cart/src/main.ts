import "./assets/main.css";

import { createNotivue } from "notivue";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const notivue = createNotivue({
  position: "top-right",
  limit: 4,
});

createApp(App).use(router).use(notivue).mount("#app");
