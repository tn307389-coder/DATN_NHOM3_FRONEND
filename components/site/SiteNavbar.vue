<template>
  <header class="site-header">
    <div class="navbar">
      <div class="nav-inner">
        <router-link to="/trang-chu" class="brand">
          <img src="/logo1.jpg" alt="Logo" class="brand-logo" />
          <span>
            DriveHub
            <small>Trung tâm Đào tạo Lái xe</small>
          </span>
        </router-link>

        <nav class="nav-links">
          <router-link to="/trang-chu">Trang chủ</router-link>
          <router-link to="/gioi-thieu">Giới thiệu</router-link>
          <router-link to="/hang-gplx">Hạng GPLX</router-link>
          <router-link to="/khoa-hoc">Khóa học</router-link>
          <router-link to="/bang-gia">Bảng giá</router-link>
          <router-link to="/tin-tuc">Tin tức</router-link>
          <router-link to="/lien-he">Liên hệ</router-link>

          <button v-if="!loggedIn" class="login-btn nav-login" @click="openLogin()">
            <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
          </button>
          <template v-else>
            <router-link to="/ho-so-cua-toi" class="user-info">
              <span class="avatar">{{ initials }}</span>
              <span class="user-name">{{ displayName }}</span>
            </router-link>
            <button class="login-btn nav-login" @click="logout()">
              <i class="bi bi-box-arrow-right"></i> Đăng xuất
            </button>
          </template>
        </nav>
      </div>
    </div>

    <nav v-if="isMember" class="site-submenu">
      <div class="submenu-inner">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="submenu-link"
          :class="{ active: item.path === currentPath }"
        >
          <span class="submenu-icon">{{ item.icon }}</span> {{ item.name }}
        </router-link>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useSite } from "../../composables/useSite";
import { MENU, ROLE_PAGES } from "../../services/permissions";

const route = useRoute();
const { loggedIn, role, displayName, showLogin, logout } = useSite();
const openLogin = () => (showLogin.value = true);

const initials = computed(() => {
  const n = (displayName.value || "").trim();
  if (!n) return "?";
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
});

const isMember = computed(() => loggedIn.value && ["GV", "HV"].includes(role.value));
const currentPath = computed(() => route.path);
const items = computed(() => {
  const allowed = ROLE_PAGES[role.value] || {};
  const pages = MENU.filter((m) => allowed[m.path]);
  return [{ path: "/trang-chu", name: "Trang chủ", icon: "🏠" }, ...pages];
});
</script>
