import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/ses",
    redirect: "/",
  },
  {
    path: "/",
    name: "ses",
    component: () => import("../views/forecast/SingleExponentialSmoothing.vue"),
  },

  {
    path: "/des-brown",
    name: "des-brown",
    component: () =>
      import("../views/forecast/DoubleExponentialSmoothingBrown.vue"),
  },
  {
    path: "/des-holt",
    name: "des-holt",
    component: () =>
      import("../views/forecast/DoubleExponentialSmoothingHolt.vue"),
  },

  { path: "/:catchAll(.*)", component: () => import("../views/Error404.vue") },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
