import { createRouter, createWebHistory } from "vue-router"

const routes = [
  { path: "/", redirect: "/hoc-vien" },
  { path: "/dashboard", name: "Dashboard", component: () => import("../views/DashboardView.vue") },
  { path: "/hoc-vien", name: "HocVien", component: () => import("../views/HocVienView.vue") },
  { path: "/giao-vien", name: "GiaoVien", component: () => import("../views/GiaoVienView.vue") },
  { path: "/chuong-trinh-hoc", name: "ChuongTrinhHoc", component: () => import("../views/ChuongTrinhHocView.vue") },
  { path: "/lich-hoc", name: "LichHoc", component: () => import("../views/LichHocView.vue") },
  { path: "/phan-cong", name: "PhanCong", component: () => import("../views/PhanCongView.vue") },
  { path: "/phong-hoc", name: "PhongHoc", component: () => import("../views/PhongHocView.vue") },
  { path: "/xe-tap-lai", name: "XeTapLai", component: () => import("../views/XeTapLaiView.vue") },
  { path: "/ho-so-hoc-vien", name: "HoSoHocVien", component: () => import("../views/HoSoHocVienView.vue") },
  { path: "/thi-sat-hach", name: "ThiSatHach", component: () => import("../views/ThiSatHachView.vue") },
  { path: "/tra-gplx", name: "TraGPLX", component: () => import("../views/TraGPLXView.vue") },
  { path: "/thanh-toan", name: "ThanhToan", component: () => import("../views/ThanhToanView.vue") },
  { path: "/tai-khoan", name: "TaiKhoan", component: () => import("../views/TaiKhoanView.vue") },
]

const router = createRouter({ history: createWebHistory(), routes })
export default router
