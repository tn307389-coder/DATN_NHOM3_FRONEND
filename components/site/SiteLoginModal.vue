<template>
  <div class="login-modal-overlay" v-if="showLogin" @click.self="showLogin = false">
    <div class="login-modal">
      <button class="modal-close" @click="showLogin = false">&times;</button>

      <div class="text-center mb-4">
        <img src="/logo1.jpg" alt="Logo" class="login-logo" />
        <h3 class="mt-3">Đăng nhập hệ thống</h3>
        <p class="text-muted mb-0">Vui lòng đăng nhập để tiếp tục</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Tên tài khoản hoặc CCCD</label>
          <input
            ref="userInput"
            v-model="username"
            type="text"
            class="form-control form-control-lg"
            placeholder="Nhập tên tài khoản hoặc CCCD"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="form-control form-control-lg"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary btn-lg w-100">
          Đăng nhập
        </button>
      </form>

      <div class="text-center mt-3">
        <small class="text-muted">TK demo: admin / admin123 (quản trị) — hocvien1 / 123456 (học viên) — giaovien1 / 123456 (giáo viên)</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSite } from "../../composables/useSite";
const { username, password, error, showLogin, userInput, handleLogin } = useSite();
</script>
