import { createRouter, createWebHistory } from "vue-router";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("./pages/home/HomePage.vue"),
    },
    {
      name: "cart",
      path: "/cart",
      component: () => import("./pages/CartPage.vue"),
    },
    {
      name: "checkout-success",
      path: "/checkout/success",
      component: () => import("./pages/CheckoutSuccessPage.vue"),
    },
    // todo add catch all for 404
  ],
});
