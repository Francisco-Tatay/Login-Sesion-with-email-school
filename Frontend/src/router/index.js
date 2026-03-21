import { createRouter, createWebHistory } from "vue-router";
import DashboardUsers from "@/components/DashBoard/DashboardUsers.vue";
import LandingPage from "@/components/LandingPage.vue";
import LoginView from "@/components/LoginView.vue";
import Register_User from "@/components/Register/Register_User.vue";
import LoginDeletePage from "@/components/LoginDeletePage.vue";
const routes = [
  {
    path: "/",
    name: "home",
    component: LandingPage,
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "register",
    component: Register_User,
  },
  {
    path: "/send-email",
    name: "send-email",
    component: () => import("@/components/Register/SendEmail.vue"),
  },
  {
    path: "/login/delete",
    name: "login-delete",
    component: LoginDeletePage,
  },
  {
    path: "/Register",
    redirect: "/register",
  },
  {
    path: "/SendEmail",
    redirect: "/send-email",
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: DashboardUsers,
  },
  {
    path: "/Dashboard",
    redirect: "/dashboard",
  },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
export default router;
