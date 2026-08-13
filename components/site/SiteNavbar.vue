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

        <button class="hamburger" @click="mobileMenu = !mobileMenu" :aria-label="mobileMenu ? 'Đóng menu' : 'Mở menu'">
          <span class="hamburger-line" :class="{ active: mobileMenu }"></span>
          <span class="hamburger-line" :class="{ active: mobileMenu }"></span>
          <span class="hamburger-line" :class="{ active: mobileMenu }"></span>
        </button>
      </div>
    </div>

    <div v-if="mobileMenu" class="mobile-overlay" @click="mobileMenu = false"></div>
    <div v-if="mobileMenu" class="mobile-menu" :class="{ open: mobileMenu }">
      <router-link to="/trang-chu" @click="mobileMenu = false">Trang chủ</router-link>
      <router-link to="/gioi-thieu" @click="mobileMenu = false">Giới thiệu</router-link>
      <router-link to="/hang-gplx" @click="mobileMenu = false">Hạng GPLX</router-link>
      <router-link to="/khoa-hoc" @click="mobileMenu = false">Khóa học</router-link>
      <router-link to="/bang-gia" @click="mobileMenu = false">Bảng giá</router-link>
      <router-link to="/tin-tuc" @click="mobileMenu = false">Tin tức</router-link>
      <router-link to="/lien-he" @click="mobileMenu = false">Liên hệ</router-link>
      <div v-if="!loggedIn" class="mobile-login">
        <button class="login-btn w-100" @click="mobileMenu = false; openLogin()">
          <i class="bi bi-box-arrow-in-right"></i> Đăng nhập
        </button>
      </div>
      <template v-else>
        <router-link to="/ho-so-cua-toi" @click="mobileMenu = false" class="user-info">
          <span class="avatar">{{ initials }}</span> {{ displayName }}
        </router-link>
        <button class="login-btn w-100" @click="mobileMenu = false; logout()">
          <i class="bi bi-box-arrow-right"></i> Đăng xuất
        </button>
      </template>
    </div>

    <nav v-if="isMember" class="site-submenu">
      <div class="submenu-inner">
        <div class="d-flex align-items-center gap-2 flex-wrap w-100">
          <router-link
            v-if="currentPath !== portalPath"
            :to="portalPath"
            class="btn btn-sm btn-outline-primary rounded-pill px-3 back-btn"
          >
            <i class="bi bi-arrow-left me-1"></i> Quay lại
          </router-link>
          <router-link
            v-for="item in items"
            :key="item.path"
            :to="item.path"
            class="submenu-link"
            :class="{ active: item.path === currentPath }"
          >
            <span class="submenu-icon">{{ item.icon }}</span>
            <span class="submenu-label">{{ item.name }}</span>
          </router-link>
          <button class="btn btn-sm btn-outline-danger rounded-pill px-3 ms-auto logout-sub-btn" @click="logout()">
            <i class="bi bi-box-arrow-right me-1"></i> Đăng xuất
          </button>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { useSite } from "../../composables/useSite";
import { MENU, ROLE_PAGES } from "../../services/permissions";

const route = useRoute();
const { loggedIn, role, displayName, showLogin, logout } = useSite();
const openLogin = () => (showLogin.value = true);
const mobileMenu = ref(false);

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
const portalPath = computed(() => role.value === "GV" ? "/gv-portal" : "/hv-portal");
const items = computed(() => {
  const allowed = ROLE_PAGES[role.value] || {};
  const pages = MENU.filter((m) => allowed[m.path]);
  const portal = { path: portalPath.value, name: "Bảng tin", icon: "📊" };
  return [portal, { path: "/trang-chu", name: "Trang chủ", icon: "🏠" }, ...pages];
});
</script>

<style scoped>
.back-btn {
  flex-shrink: 0;
  font-weight: 500;
  border-width: 2px;
}
.logout-sub-btn {
  flex-shrink: 0;
  font-weight: 500;
  border-width: 2px;
}
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  z-index: 1001;
}
.hamburger-line {
  width: 24px;
  height: 2px;
  background: var(--text-primary);
  border-radius: 2px;
  transition: all 0.3s ease;
}
.hamburger-line.active:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}
.hamburger-line.active:nth-child(2) {
  opacity: 0;
}
.hamburger-line.active:nth-child(3) {
  transform: rotate(-45deg) translate(5px, -5px);
}
.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 998;
}
.mobile-menu {
  display: none;
  position: fixed;
  top: 0;
  right: -280px;
  width: 280px;
  height: 100vh;
  background: var(--bg-secondary);
  border-left: 1px solid var(--border-glass);
  padding: 80px 24px 24px;
  z-index: 999;
  transition: right 0.3s ease;
  flex-direction: column;
  gap: 4px;
}
.mobile-menu.open {
  right: 0;
}
.mobile-menu a,
.mobile-menu button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 12px 16px;
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  font-weight: 500;
  transition: background 0.2s;
}
.mobile-menu a:hover,
.mobile-menu button:hover {
  background: rgba(255, 255, 255, 0.06);
}
.mobile-login {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-glass);
}
@media (max-width: 992px) {
  .nav-links {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .mobile-overlay {
    display: block;
  }
  .mobile-menu {
    display: flex;
  }
}
@media (max-width: 768px) {
  .submenu-inner .d-flex {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .submenu-inner .d-flex::-webkit-scrollbar {
    display: none;
  }
  .submenu-link {
    white-space: nowrap;
  }
}
</style>
