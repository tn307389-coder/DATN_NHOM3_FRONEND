<template>
  <nav class="app-header">
    <div class="d-flex align-items-center gap-3">
      <img src="/logo1.jpg" alt="Logo" class="header-logo" />

      <div>
        <h5 class="mb-0 fw-bold text-white">
          Hệ thống quản lý GPLX
        </h5>
        <small class="text-white-50">
          DriveHub Management System
        </small>
      </div>
    </div>

    <div class="dropdown">
      <a
        class="user-box dropdown-toggle"
        href="#"
        data-bs-toggle="dropdown"
      >
        <img
          src="/logo1.jpg"
          class="avatar"
          alt="Avatar"
        />

        <div class="text-start">
          <strong>{{ user?.hoten || "Admin" }}</strong>
          <small>{{ user?.vaitro || "Quản trị viên" }}</small>
        </div>
      </a>

      <ul class="dropdown-menu dropdown-menu-end shadow border-0">
        <li>
          <a class="dropdown-item" href="#">
            Hồ sơ cá nhân
          </a>
        </li>

        <li>
          <hr class="dropdown-divider" />
        </li>

        <li>
          <button class="dropdown-item text-danger" @click="logout">
            Đăng xuất
          </button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref(JSON.parse(localStorage.getItem("user")));

const logout = () => {
  localStorage.removeItem("isLogin");
  localStorage.removeItem("user");
  router.push("/login");
};
</script>

<style scoped>
.app-header {
  height: 76px;
  background: linear-gradient(135deg, #0d6efd, #084298);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 28px;
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.12);
}

.header-logo {
  width: 52px;
  height: 52px;
  object-fit: cover;
  border-radius: 14px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: white;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.14);
  transition: 0.25s;
}

.user-box:hover {
  background: rgba(255, 255, 255, 0.24);
  color: white;
}

.user-box strong {
  display: block;
  font-size: 15px;
  line-height: 1.2;
}

.user-box small {
  display: block;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.75);
}

.avatar {
  width: 42px;
  height: 42px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid white;
  background: white;
}

.dropdown-menu {
  border-radius: 14px;
  padding: 8px;
}

.dropdown-item {
  border-radius: 10px;
  font-weight: 500;
}
</style>