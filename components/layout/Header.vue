<template>
  <header class="app-header">
    <div class="header-left">
      <button class="mobile-menu-btn d-md-none" @click="toggleSidebar">
        <i class="bi bi-list"></i>
      </button>
      <div class="page-breadcrumb">
        <small class="crumb-root">Quản trị</small>
        <span class="crumb-sep">/</span>
        <strong class="crumb-current">{{ pageTitle }}</strong>
      </div>
    </div>

    <div class="header-right">
      <span class="role-badge">{{ roleLabel }}</span>

      <button class="theme-toggle" :title="theme === 'dark' ? 'Sáng' : 'Tối'" @click="toggleTheme">
        <i :class="theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-fill'"></i>
      </button>

      <div class="user-info">
        <img src="/logo1.jpg" class="avatar" alt="Avatar" />
        <div class="user-text">
          <strong>{{ user?.hoten || "Người dùng" }}</strong>
          <small>{{ user?.vaitro || user?.tenvaitro || "" }}</small>
        </div>
      </div>

      <button class="logout-btn" title="Đăng xuất" @click="logout">
        <i class="bi bi-box-arrow-right"></i>
        <span>Đăng xuất</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { computed, inject } from "vue";
import { useRoute } from "vue-router";
import { useSite } from "../../composables/useSite";
import { MENU } from "../../services/permissions";

const { logout } = useSite();
const route = useRoute();
const theme = inject("theme");
const toggleTheme = inject("toggleTheme");

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    return {};
  }
});

const roleLabel = computed(() => {
  switch (user.value.maVaiTro) {
    case "ADMIN":
      return "Quản trị viên";
    case "NV":
      return "Nhân viên";
    case "GV":
      return "Giáo viên";
    case "HV":
      return "Học viên";
    default:
      return "Người dùng";
  }
});

const pageTitle = computed(() => {
  const found = MENU.find((m) => m.path === route.path);
  return found ? found.name : "Trang quản trị";
});

const toggleSidebar = () => {
  document.querySelector('.sidebar')?.classList.toggle('open');
};
</script>

<style scoped>
.app-header {
  height: 76px;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 999;
  border-bottom: 1px solid #e9eef5;
  box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
}

.crumb-root {
  color: #94a3b8;
  font-weight: 600;
}

.crumb-sep {
  color: #cbd5e1;
}

.crumb-current {
  color: #0f172a;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.role-badge {
  background: #eef2ff;
  color: #4338ca;
  border-radius: 999px;
  padding: 6px 12px;
  font-size: 12.5px;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.user-text strong {
  font-size: 14px;
  color: #111827;
}

.user-text small {
  font-size: 12px;
  color: #94a3b8;
}

.avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid #e9eef5;
  background: #f1f5f9;
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #475569;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  border-radius: 12px;
  font-weight: 600;
  font-size: 13.5px;
  padding: 8px 14px;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  color: #475569;
  cursor: pointer;
  transition: 0.2s;
}

.theme-toggle:hover {
  background: #e2e8f0;
  color: #0f172a;
}

/* Dark Mode Styles */
:deep(.dark-mode) .app-header {
  background: #1e293b;
  border-bottom-color: #334155;
}

:deep(.dark-mode) .crumb-root,
:deep(.dark-mode) .crumb-sep,
:deep(.dark-mode) .crumb-current {
  color: #cbd5e1;
}

:deep(.dark-mode) .user-text strong {
  color: #f1f5f9;
}

:deep(.dark-mode) .role-badge {
  background: #334155;
  color: #a5b4fc;
}

:deep(.dark-mode) .avatar {
  border-color: #334155;
}

:deep(.dark-mode) .logout-btn {
  background: #334155;
  border-color: #475569;
  color: #cbd5e1;
}

:deep(.dark-mode) .logout-btn:hover {
  background: #475569;
  color: #f1f5f9;
}

.mobile-menu-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  background: #f1f5f9;
  color: #475569;
  font-size: 20px;
  margin-right: 12px;
  cursor: pointer;
}

.mobile-menu-btn:hover {
  background: #e2e8f0;
}

@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
}
</style>
