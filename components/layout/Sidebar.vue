<template>
  <aside class="sidebar" :class="{'dark-mode': theme === 'dark'}">
    <div class="sidebar-brand">
      <div class="brand-icon">🚘</div>
      <div class="brand-text">
        <h4>DriveHub</h4>
        <small>Quản trị GPLX</small>
      </div>
    </div>

    <nav class="menu-scroll">
      <router-link
        v-for="item in visibleMenu"
        :key="item.path"
        :to="item.path"
        class="menu-item"
        active-class="active"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        <span class="menu-text">{{ item.name }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <small>© 2026 DATN Nhóm 3</small>
    </div>
  </aside>
</template>

<script setup>
import { computed, inject } from "vue";
import { allowedPaths, MENU } from "../../services/permissions";

const theme = inject("theme");
const user = JSON.parse(localStorage.getItem("user") || "{}");
const visibleMenu = computed(() => {
  const allowed = allowedPaths(user.maVaiTro);
  if (allowed === "ALL") return MENU;
  return MENU.filter((i) => allowed.includes(i.path));
});
</script>

<style scoped>
.sidebar {
  width: 264px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e9eef5;
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.sidebar-brand {
  height: 76px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 22px;
  border-bottom: 1px solid #eef2f7;
}

.brand-icon {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, #0d6efd, #38bdf8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 22px;
  box-shadow: 0 8px 18px rgba(13, 110, 253, 0.3);
}

.brand-text h4 {
  margin: 0;
  font-size: 19px;
  font-weight: 800;
  color: #111827;
  line-height: 1.1;
}

.brand-text small {
  color: #94a3b8;
  font-size: 12px;
}

.menu-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 14px 14px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #475569;
  padding: 11px 14px;
  text-decoration: none;
  font-size: 14.5px;
  font-weight: 600;
  border-radius: 12px;
  transition: background 0.18s, color 0.18s, transform 0.18s;
}

.menu-icon {
  width: 22px;
  text-align: center;
  font-size: 17px;
}

.menu-text {
  flex: 1;
}

.menu-item:hover {
  background: #f1f5f9;
  color: #0f172a;
}

.menu-item.active {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  box-shadow: 0 8px 18px rgba(13, 110, 253, 0.25);
}

.sidebar-footer {
  padding: 14px 22px;
  border-top: 1px solid #eef2f7;
  color: #94a3b8;
  font-size: 12px;
}

.menu-scroll::-webkit-scrollbar {
  width: 6px;
}
.menu-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 20px;
}
.menu-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Dark Mode */
.sidebar.dark-mode {
  background: #1e293b;
  border-right-color: #334155;
}

.dark-mode .sidebar-brand {
  border-bottom-color: #334155;
}

.dark-mode .brand-text h4 {
  color: #f1f5f9;
}

.dark-mode .menu-item {
  color: #94a3b8;
}

.dark-mode .menu-item:hover {
  background: #334155;
  color: #f1f5f9;
}

.dark-mode .sidebar-footer {
  border-top-color: #334155;
  color: #64748b;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    z-index: 1050;
    transition: left 0.3s ease;
    box-shadow: 4px 0 20px rgba(0, 0, 0, 0.15);
    border-right: none;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>
