<template>
  <div class="sidebar">
    <div class="sidebar-brand">
      <div class="brand-icon">
        🚘
      </div>

      <div>
        <h4>DriveHub</h4>
        <small>GPLX System</small>
      </div>
    </div>

    <div class="menu-scroll">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="menu-item"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
const menuItems = [
  { path: "/", icon: "📊", name: "Dashboard" },
  { path: "/tai-khoan", icon: "👤", name: "Tài khoản" },
  { path: "/hoc-vien", icon: "👨‍🎓", name: "Học viên" },
  { path: "/ho-so-hoc-vien", icon: "📁", name: "Hồ sơ học viên" },
  { path: "/giao-vien", icon: "👨‍🏫", name: "Giáo viên" },
  { path: "/chuong-trinh-hoc", icon: "📚", name: "Chương trình học" },
  { path: "/khoa-hoc", icon: "🎓", name: "Khóa học" },
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
  { path: "/hang-gplx", icon: "🪪", name: "Hạng GPLX" },
  { path: "/thong-bao", icon: "🔔", name: "Thông báo" },
  { path: "/nhat-ky-he-thong", icon: "🧾", name: "Nhật ký hệ thống" },
];
</script>

<style scoped>
.sidebar {
  width: 270px;
  height: 100vh;
  min-height: 100vh;
  background: linear-gradient(180deg, #111827, #1f2937);
  color: white;
  overflow: hidden;
  position: sticky;
  top: 0;
  flex-shrink: 0;
  box-shadow: 4px 0 18px rgba(0, 0, 0, 0.18);
}

.sidebar-brand {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0d6efd, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-size: 22px;
  box-shadow: 0 8px 18px rgba(13, 110, 253, 0.35);
}

.sidebar-brand h4 {
  margin: 0;
  font-size: 20px;
  font-weight: 800;
  color: white;
}

.sidebar-brand small {
  color: #9ca3af;
  font-size: 12px;
}

.menu-scroll {
  height: calc(100vh - 76px);
  overflow-y: auto;
  padding: 14px 12px 24px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #d1d5db;
  padding: 13px 14px;
  margin-bottom: 6px;
  text-decoration: none;
  font-size: 15px;
  font-weight: 600;
  border-radius: 14px;
  transition: 0.25s;
}

.menu-icon {
  width: 24px;
  text-align: center;
  font-size: 18px;
}

.menu-text {
  flex: 1;
}

.menu-item:hover {
  background: rgba(13, 110, 253, 0.18);
  color: white;
  transform: translateX(4px);
}

.router-link-active {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: white;
  box-shadow: 0 8px 18px rgba(13, 110, 253, 0.28);
}

.menu-scroll::-webkit-scrollbar {
  width: 6px;
}

.menu-scroll::-webkit-scrollbar-thumb {
  background: #4b5563;
  border-radius: 20px;
}

.menu-scroll::-webkit-scrollbar-track {
  background: transparent;
}
</style>