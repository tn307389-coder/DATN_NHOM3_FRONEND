<template>
  <nav class="top-menu">
    <router-link to="/login" class="brand">
      <img src="/logo1.jpg" alt="Logo" class="brand-logo" />
      <div>
        <h5 class="mb-0 fw-bold">DriveHub</h5>
        <small>GPLX System</small>
      </div>
    </router-link>

    <div class="menu-links">
      <router-link
        v-for="item in menu"
        :key="item.path"
        :to="item.path"
        class="menu-link"
      >
        <span class="menu-icon">{{ item.icon }}</span>
        {{ item.name }}
      </router-link>
    </div>

    <div class="user-box">
      <div class="user-info">
        <strong>{{ user?.hoten || "" }}</strong>
        <small>{{ user?.vaitro || "" }}</small>
      </div>
      <button class="logout-btn" @click="logout">
        <i class="bi bi-box-arrow-right"></i> Đăng xuất
      </button>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { MENU, allowedPaths } from "../../services/permissions";
import { useSite } from "../../composables/useSite";

const { logout } = useSite();

const user = computed(() => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    return {};
  }
});

const role = computed(() => user.value.maVaiTro);

const menu = computed(() =>
  MENU.filter((m) => allowedPaths(role.value).includes(m.path))
);
</script>

<style scoped>
.top-menu {
  display: flex;
  align-items: center;
  gap: 18px;
  background: linear-gradient(135deg, #0d6efd, #084298);
  padding: 10px 24px;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
}

.brand-logo {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  object-fit: cover;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: #fff;
}

.brand small {
  color: rgba(255, 255, 255, 0.7);
}

.menu-links {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  flex-wrap: wrap;
}

.menu-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 10px;
  transition: 0.2s;
}

.menu-link:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.menu-link.router-link-active {
  background: #fff;
  color: #0d6efd;
}

.menu-icon {
  font-size: 15px;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-info {
  color: #fff;
  text-align: right;
  line-height: 1.2;
}

.user-info strong {
  display: block;
  font-size: 14px;
}

.user-info small {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.logout-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 14px;
  transition: 0.2s;
}

.logout-btn:hover {
  background: #fff;
  color: #dc3545;
  border-color: #fff;
}
</style>
