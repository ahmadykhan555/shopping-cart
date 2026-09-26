import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import CartPage from "./pages/CartPage.vue";
import CheckoutSuccessPage from "./pages/CheckoutSuccessPage.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: HomePage },
    { path: "/cart", component: CartPage },
    { path: "/checkout/success", component: CheckoutSuccessPage },
  ],
});
