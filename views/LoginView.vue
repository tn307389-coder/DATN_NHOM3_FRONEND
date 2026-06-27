 <template>
  <div class="login-page">
    <div class="login-card">
      <div class="text-center mb-4">
        <img src="/logo1.jpg" alt="Logo" class="login-logo" />
        <h3 class="mt-3">Đăng nhập hệ thống DRiveHub</h3>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Tên tài khoản hoặc CCCD</label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Nhập tên tài khoản hoặc CCCD"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div v-if="error" class="alert alert-danger py-2">
          {{ error }}
        </div>

        <button type="submit" class="btn btn-primary w-100">
          Đăng nhập
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const username = ref("");
const password = ref("");
const error = ref("");

const handleLogin = () => {
  if (!username.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }

  // Tạm thời frontend test
  if (username.value === "admin" && password.value === "123") {
    localStorage.setItem("isLogin", "true");
    router.push("/");
  } else {
    error.value = "Tên tài khoản hoặc mật khẩu không đúng";
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0d6efd, #1e293b);
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 420px;
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
}

.login-logo {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
}
</style>