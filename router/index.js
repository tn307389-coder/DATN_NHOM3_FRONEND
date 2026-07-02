import { createRouter, createWebHistory } from "vue-router";
import HocVienView from "../views/HocVienView.vue";
import HoSoHocVienView from "../views/HoSoHocVienView.vue";

const routes = [
  {
    path: "/",
    redirect: "/hoc-vien",
  },
  {
    path: "/hoc-vien",
    component: HocVienView,
  },
  {
    path: "/ho-so-hoc-vien",
    component: HoSoHocVienView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
