import { createRouter, createWebHistory } from "vue-router";
import { APP_ROUTES } from "@/consts";

const APP_TITLE = "Neuffer";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: APP_ROUTES.DEFAULT,
    },
    {
      name: "cart",
      path: APP_ROUTES.CART,
      component: () => import("./pages/CartPage.vue"),
      meta: { title: "Cart" },
    },
    {
      name: "checkout-success",
      path: APP_ROUTES.CHECKOUT_SUCCESS,
      component: () => import("./pages/CheckoutSuccessPage.vue"),
      meta: { title: "Order success" },
    },
    {
      name: "not-found",
      path: "/:pathMatch(.*)*",
      redirect: APP_ROUTES.DEFAULT,
    },
  ],
});

router.afterEach((to) => {
  const pageTitle = typeof to.meta.title === "string" ? to.meta.title : null;
  document.title = pageTitle ? `${pageTitle} | ${APP_TITLE}` : APP_TITLE;
});

export default router;
