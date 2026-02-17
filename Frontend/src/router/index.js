import { createRouter, createWebHistory } from "vue-router";

import LoginView from "@/components/LoginView.vue";
import Register_User from "@/components/Register/Register_User.vue";
const routes = [
  {
    path: "/",
    name: "login",
    component: LoginView,
  },
  {
    path: "/Register",
    name: "register",
    component: Register_User,
  },
  {
    path: "/SendEmail",
    name: "send-email",
    component: () => import("@/components/Register/SendEmail.vue"),
  }
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
