export const ROLE_ADMIN = "ADMIN";
export const ROLE_NV = "NV";
export const ROLE_GV = "GV";
export const ROLE_HV = "HV";

// Toàn bộ trang điều hướng (tên + icon + path)
export const MENU = [
  { path: "/dashboard", icon: "📊", name: "Dashboard" },
  { path: "/gv-portal", icon: "📊", name: "Bảng tin" },
  { path: "/hv-portal", icon: "📊", name: "Bảng tin" },
  { path: "/tai-khoan", icon: "👤", name: "Tài khoản" },
  { path: "/hoc-vien", icon: "👨‍🎓", name: "Học viên" },
  { path: "/ho-so-hoc-vien", icon: "📁", name: "Hồ sơ học viên" },
  { path: "/giao-vien", icon: "👨‍🏫", name: "Giáo viên" },
  { path: "/chuong-trinh-hoc", icon: "📚", name: "Chương trình học" },
  { path: "/quan-ly-khoa-hoc", icon: "🎓", name: "Khóa học" },
  { path: "/dang-ky-khoa-hoc", icon: "📝", name: "Đăng ký khóa học" },
  { path: "/lop-hoc", icon: "🏷️", name: "Lớp học" },
  { path: "/mon-hoc", icon: "📖", name: "Môn học" },
  { path: "/phong-hoc", icon: "🏫", name: "Phòng học" },
  { path: "/xe-tap-lai", icon: "🚗", name: "Xe tập lái" },
  { path: "/xe", icon: "🚘", name: "Xe" },
  { path: "/phan-cong", icon: "📋", name: "Phân công" },
  { path: "/ca-hoc", icon: "⏰", name: "Ca học" },
  { path: "/lich-hoc", icon: "📅", name: "Lịch học" },
  { path: "/diem-danh", icon: "✅", name: "Điểm danh" },
  { path: "/bang-diem-thuong-xuyen", icon: "📊", name: "Bảng điểm thường xuyên" },
  { path: "/thanh-toan", icon: "💰", name: "Thanh toán" },
  { path: "/phong-thi", icon: "🏢", name: "Phòng thi" },
  { path: "/ca-thi", icon: "⏱️", name: "Ca thi" },
  { path: "/lich-thi", icon: "📆", name: "Lịch thi" },
  { path: "/ket-qua-thi", icon: "🏆", name: "Kết quả thi" },
  { path: "/thi-sat-hach", icon: "📝", name: "Thi sát hạch" },
  { path: "/tra-gplx", icon: "🪪", name: "Trả GPLX" },
  { path: "/quan-ly-hang-gplx", icon: "🪪", name: "Hạng GPLX" },
  { path: "/thong-bao", icon: "🔔", name: "Thông báo" },
  { path: "/nhat-ky-he-thong", icon: "🧾", name: "Nhật ký hệ thống" },
  { path: "/ho-so-cua-toi", icon: "🙋", name: "Hồ sơ của tôi" },
  { path: "/dich-vu-hoc-vien", icon: "🛎️", name: "Dịch vụ học viên" },
  { path: "/duyet-anh", icon: "🖼️", name: "Duyệt ảnh" },
  { path: "/lich-cua-toi", icon: "📅", name: "Lịch của tôi" },
  { path: "/lich-su-bao-tri-xe", icon: "🔧", name: "Bảo trì xe" },
  { path: "/quan-ly-tin-tuc", icon: "📰", name: "Tin tức" },
];

const nvPages = [
  "/hoc-vien",
  "/ho-so-hoc-vien",
  "/giao-vien",
  "/chuong-trinh-hoc",
  "/quan-ly-khoa-hoc",
  "/dang-ky-khoa-hoc",
  "/lop-hoc",
  "/mon-hoc",
  "/phong-hoc",
  "/xe",
  "/xe-tap-lai",
  "/phan-cong",
  "/ca-hoc",
  "/lich-hoc",
  "/phong-thi",
  "/ca-thi",
  "/lich-thi",
  "/thi-sat-hach",
  "/quan-ly-hang-gplx",
  "/thong-bao",
  "/duyet-anh",
  "/lich-cua-toi",
  "/lich-su-bao-tri-xe",
  "/quan-ly-tin-tuc",
];

const gvView = [
  "/gv-portal",
  "/giao-vien",
  "/chuong-trinh-hoc",
  "/lop-hoc",
  "/mon-hoc",
  "/phong-hoc",
  "/xe",
  "/xe-tap-lai",
  "/phan-cong",
  "/lich-cua-toi",
];

const gvEdit = [
  "/diem-danh",
  "/bang-diem-thuong-xuyen",
  "/ca-thi",
  "/lich-thi",
  "/thi-sat-hach",
];

const hvView = [
  "/hv-portal",
  "/dich-vu-hoc-vien",
  "/chuong-trinh-hoc",
  "/quan-ly-khoa-hoc",
  "/lop-hoc",
  "/mon-hoc",
  "/phong-hoc",
  "/ca-hoc",
  "/lich-hoc",
  "/lich-thi",
  "/diem-danh",
  "/phong-thi",
  "/ca-thi",
  "/ket-qua-thi",
  "/thi-sat-hach",
  "/bang-diem-thuong-xuyen",
  "/lich-cua-toi",
];

// role -> { path: "view" | "edit" }
export const ROLE_PAGES = { ADMIN: {}, NV: {}, GV: {}, HV: {} };
MENU.forEach((m) => (ROLE_PAGES.ADMIN[m.path] = "edit"));
nvPages.forEach((p) => (ROLE_PAGES.NV[p] = "edit"));
gvView.forEach((p) => (ROLE_PAGES.GV[p] = "view"));
gvEdit.forEach((p) => (ROLE_PAGES.GV[p] = "edit"));
hvView.forEach((p) => (ROLE_PAGES.HV[p] = "view"));

// Hồ sơ của tôi: tất cả vai trò đều xem được
["ADMIN", "NV", "GV", "HV"].forEach((r) => (ROLE_PAGES[r]["/ho-so-cua-toi"] = "view"));

// Danh sách đường dẫn được phép của vai trò (để lọc menu + guard)
const adminExclude = ["/gv-portal", "/hv-portal", "/dich-vu-hoc-vien"];
export function allowedPaths(role) {
  if (role === ROLE_ADMIN) return MENU.map((m) => m.path).filter((p) => !adminExclude.includes(p));
  return Object.keys(ROLE_PAGES[role] || {});
}

// "edit" | "view" | null (null = không có quyền)
export function getPageMode(role, path) {
  return (ROLE_PAGES[role] && ROLE_PAGES[role][path]) || null;
}

export function canAccess(role, path) {
  return getPageMode(role, path) !== null;
}

// Trang đích sau khi đăng nhập
export function roleHome(role) {
  if (role === ROLE_ADMIN) return "/dashboard";
  if (role === ROLE_GV) return "/gv-portal";
  if (role === ROLE_HV) return "/hv-portal";
  const paths = allowedPaths(role);
  return paths.length ? paths[0] : "/login";
}
