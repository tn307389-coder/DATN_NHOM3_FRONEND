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
import ThiSatHachView from "../views/ThiSatHachView.vue";
import TraGPLXView from "../views/TraGPLXView.vue";
import LoginView from "../views/LoginView.vue";
import HangGPLXView from "../views/HangGPLXView.vue";
import XeView from "../views/XeView.vue";
import KhoaHocView from "../views/KhoaHocView.vue";
import DangKyKhoaHocView from "../views/DangKyKhoaHocView.vue";
import LopHocView from "../views/LopHocView.vue";
import MonHocView from "../views/MonHocView.vue";
import CaHocView from "../views/CaHocView.vue";
import DiemDanhView from "../views/DiemDanhView.vue";
import BangDiemThuongXuyenView from "../views/BangDiemThuongXuyenView.vue";
import PhongThiView from "../views/PhongThiView.vue";
import CaThiView from "../views/CaThiView.vue";
import LichThiView from "../views/LichThiView.vue";
import KetQuaThiView from "../views/KetQuaThiView.vue";
import ThongBaoView from "../views/ThongBaoView.vue";
import NhatKyHeThongView from "../views/NhatKyHeThongView.vue";

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
  { path: "/hang-gplx", component: HangGPLXView },
{ path: "/xe", component: XeView },
{ path: "/khoa-hoc", component: KhoaHocView },
{ path: "/dang-ky-khoa-hoc", component: DangKyKhoaHocView },
{ path: "/lop-hoc", component: LopHocView },
{ path: "/mon-hoc", component: MonHocView },
{ path: "/ca-hoc", component: CaHocView },
{ path: "/diem-danh", component: DiemDanhView },
{ path: "/bang-diem-thuong-xuyen", component: BangDiemThuongXuyenView },
{ path: "/phong-thi", component: PhongThiView },
{ path: "/ca-thi", component: CaThiView },
{ path: "/lich-thi", component: LichThiView },
{ path: "/ket-qua-thi", component: KetQuaThiView },
{ path: "/thong-bao", component: ThongBaoView },
{ path: "/nhat-ky-he-thong", component: NhatKyHeThongView },
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
