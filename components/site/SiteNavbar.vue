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
@media (max-width: 768px) {
  .submenu-inner .d-flex {
    flex-wrap: nowrap !important;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .submenu-inner .d-flex::-webkit-scrollbar { display: none; }
  .submenu-link {
    white-space: nowrap;
  }
}
</style>
