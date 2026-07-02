<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm px-4">
    <div class="container-fluid">
      <div class="d-flex align-items-center">
        <img src="/logo1.jpg" alt="Logo" style="height: 45px" />

        <span class="navbar-brand fw-bold ms-2">
          Hệ thống quản lý GPLX
        </span>
      </div>

      <div class="dropdown ms-auto">
        <a
          class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
          href="#"
          data-bs-toggle="dropdown"
        >
          <img
            src="/logo1.jpg"
            class="rounded-circle me-2"
            width="38"
            height="38"
            alt="Avatar"
          />

          <strong>{{ user?.hoten || "Admin" }}</strong>
        </a>

        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <a class="dropdown-item" href="#">Hồ sơ</a>
          </li>

          <li><hr class="dropdown-divider" /></li>

          <li>
            <button class="dropdown-item text-danger" @click="logout">
              Đăng xuất
            </button>
          </li>
        </ul>
      </div>
  <a
    class="d-flex align-items-center text-white text-decoration-none dropdown-toggle"
    href="#"
    data-bs-toggle="dropdown"
  >
    <img
      src="/logo1.jpg"
      class="rounded-circle me-2"
      width="38"
      height="38"
      alt="Avatar"
    />

    <strong>Admin</strong>
  </a>

      <ul class="dropdown-menu dropdown-menu-end">
       <li>
          <a class="dropdown-item" href="#">
            Hồ sơ
          </a>
        </li>

    <li><hr class="dropdown-divider" /></li>

    <li>
      <a class="dropdown-item text-danger" href="#">
        Đăng xuất
      </a>
    </li>
  </ul>
</div>
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