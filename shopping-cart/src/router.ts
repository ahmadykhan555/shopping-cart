import { createRouter, createWebHistory } from "vue-router";

import CartPage from "./pages/CartPage.vue";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage.vue";
import HomePage from "./pages/home/HomePage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/cart", component: CartPage },
    { path: "/checkout/success", component: CheckoutSuccessPage },
  ],
});
