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
import HoSoCuaToiView from "../views/HoSoCuaToiView.vue";
import DuyetAnhView from "../views/DuyetAnhView.vue";
import LichCuaToiView from "../views/LichCuaToiView.vue";
import LichSuBaoTriXeView from "../views/LichSuBaoTriXeView.vue";
import TinTucManagerView from "../views/TinTucManagerView.vue";
import GvPortalView from "../views/GvPortalView.vue";
import HvPortalView from "../views/HvPortalView.vue";

// Trang công khai (website)
import GioiThieuView from "../views/GioiThieuView.vue";
import HangGplxPublicView from "../views/HangGplxPublicView.vue";
import KhoaHocPublicView from "../views/KhoaHocPublicView.vue";
import BangGiaView from "../views/BangGiaView.vue";
import TinTucView from "../views/TinTucView.vue";
import LienHeView from "../views/LienHeView.vue";
import TrangChuView from "../views/TrangChuView.vue";

import { canAccess, roleHome } from "../services/permissions";

function currentRole() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.maVaiTro || null;
  } catch (e) {
    return null;
  }
}

// Các đường dẫn trang công khai (không cần đăng nhập)
const publicPaths = [
  "/login",
  "/trang-chu",
  "/gioi-thieu",
  "/hang-gplx",
  "/khoa-hoc",
  "/bang-gia",
  "/tin-tuc",
  "/lien-he",
];

const routes = [
  { path: "/login", redirect: "/trang-chu" },
  { path: "/trang-chu", component: TrangChuView },
  { path: "/gioi-thieu", component: GioiThieuView },
  { path: "/hang-gplx", component: HangGplxPublicView },
  { path: "/khoa-hoc", component: KhoaHocPublicView },
  { path: "/bang-gia", component: BangGiaView },
  { path: "/tin-tuc", component: TinTucView },
  { path: "/lien-he", component: LienHeView },

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
  { path: "/quan-ly-hang-gplx", component: HangGPLXView },
  { path: "/xe", component: XeView },
  { path: "/quan-ly-khoa-hoc", component: KhoaHocView },
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
  { path: "/ho-so-cua-toi", component: HoSoCuaToiView },
  { path: "/duyet-anh", component: DuyetAnhView },
  { path: "/lich-cua-toi", component: LichCuaToiView },
  { path: "/lich-su-bao-tri-xe", component: LichSuBaoTriXeView },
  { path: "/quan-ly-tin-tuc", component: TinTucManagerView },
  { path: "/gv-portal", component: GvPortalView },
  { path: "/hv-portal", component: HvPortalView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from) => {
  const token = localStorage.getItem("token");

  // Trang công khai: cho phép truy cập không cần đăng nhập
  if (publicPaths.includes(to.path)) {
    // Nếu đã đăng nhập mà vào trang login thì về trang chủ role
    if (to.path === "/login" && token) {
      return roleHome(currentRole());
    }
    return;
  }

  if (!token) {
    return "/trang-chu";
  }

  const role = currentRole();
  if (!role) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return "/trang-chu";
  }

  if (to.path === "/") {
    return roleHome(role);
  }

  if (!canAccess(role, to.path)) {
    return roleHome(role);
  }
});

export default router;
