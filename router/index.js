import { createRouter, createWebHistory } from "vue-router";

import DashboardView from "../views/DashboardView.vue";
import TaiKhoanView from "../views/TaiKhoanView.vue";
import HocVienView from "../views/HocVienView.vue";
import HoSoHocVienView from "../views/HoSoHocVienView.vue";
import GiaoVienView from "../views/GiaoVienView.vue";
import ChuongTrinhHocView from "../views/ChuongTrinhHocView.vue";
import PhongHocView from "../views/PhongHocView.vue";
import XeTapLaiView from "../views/XeTapLaiView.vue";
import ThanhToanView from "../views/ThanhToanView.vue";
import PhanCongView from "../views/PhanCongView.vue";
import LichHocView from "../views/LichHocView.vue";
import ThanhToanView from "../views/ThanhToanView.vue";
import ThiSatHachView from "../views/ThiSatHachView.vue";
import TraGPLXView from "../views/TraGPLXView.vue";
import LoginView from "../views/LoginView.vue";

const routes = [
  { path: "/login", component: LoginView },
  { path: "/", redirect: "/dashboard" },
  { path: "/dashboard", component: DashboardView },
  { path: "/tai-khoan", component: TaiKhoanView },
  { path: "/hoc-vien", component: HocVienView },
  { path: "/ho-so-hoc-vien", component: HoSoHocVienView },
  { path: "/giao-vien", component: GiaoVienView },
  { path: "/chuong-trinh-hoc", component: ChuongTrinhHocView },
  { path: "/phong-hoc", component: PhongHocView },
  { path: "/xe-tap-lai", component: XeTapLaiView },
  { path: "/phan-cong", component: PhanCongView },
  { path: "/lich-hoc", component: LichHocView },
  { path: "/thanh-toan", component: ThanhToanView },
  { path: "/thi-sat-hach", component: ThiSatHachView },
  { path: "/tra-gplx", component: TraGPLXView },

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
    path: "/ho-so-hoc-vien",
    component: HoSoHocVienView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.getItem("isLogin");

  if (to.path === "/login") {
    next();
    return;
  }

  if (!isLogin) {
    next("/login");
    return;
  }

  next();
});

export default router;
export default router;
