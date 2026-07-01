import { createRouter, createWebHistory } from "vue-router";
import HocVienView from "../views/HocVienView.vue";
import GiaoVienView from "../views/GiaoVienView.vue";
import ChuongTrinhHocView from "../views/ChuongTrinhHocView.vue";
import PhongHocView from "../views/PhongHocView.vue";
import XeTapLaiView from "../views/XeTapLaiView.vue";
import ThanhToanView from "../views/ThanhToanView.vue";

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
    path: "/giao-vien",
    component: GiaoVienView,
  },
  {
    path: "/chuong-trinh-hoc",
    component: ChuongTrinhHocView,
  },
  {
    path: "/phong-hoc",
    component: PhongHocView,
  },
  {
    path: "/xe-tap-lai",
    component: XeTapLaiView,
  },
  {
    path: "/thanh-toan",
    component: ThanhToanView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;