import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import CartPage from "./pages/CartPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/cart", component: CartPage },
  ],
});
