import { createRouter, createWebHistory } from "vue-router";
import HocVienView from "../views/HocVienView.vue";

const routes = [
  {
    path: "/",
    redirect: "/hoc-vien",
  },
  {
    path: "/hoc-vien",
    component: HocVienView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;