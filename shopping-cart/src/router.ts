import { createRouter, createWebHistory } from "vue-router";

const APP_TITLE = "Neuffer";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "home",
      path: "/",
      component: () => import("./pages/HomePage.vue"),
      meta: { title: "Home" },
    },
    {
      name: "cart",
      path: "/cart",
      component: () => import("./pages/CartPage.vue"),
      meta: { title: "Cart" },
    },
    {
      name: "checkout-success",
      path: "/checkout/success",
      component: () => import("./pages/CheckoutSuccessPage.vue"),
      meta: { title: "Order success" },
    },
    // todo add catch all for 404
  ],
});

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === "string" ? to.meta.title : null;
  document.title = pageTitle ? `${pageTitle} | ${APP_TITLE}` : APP_TITLE;
});

export default router;
