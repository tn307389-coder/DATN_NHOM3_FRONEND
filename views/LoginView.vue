<template>
  <div class="login-page">
    <div class="login-container">
      <div class="text-center mb-4">
        <img src="/logo1.jpg" alt="Logo" class="login-page-logo" />
        <h4 class="fw-bold mt-2" style="color: var(--text-primary)">DriveHub</h4>
        <p style="color: var(--text-secondary)" class="small">Trung tâm đào tạo lái xe chuyên nghiệp</p>
      </div>

      <div class="d-flex mb-4 auth-tabs">
        <button class="auth-tab flex-fill text-center py-2 fw-bold rounded-3"
          :class="authTab === 'login' ? 'active' : ''"
          @click="authTab = 'login'">Đăng nhập</button>
        <button class="auth-tab flex-fill text-center py-2 fw-bold rounded-3"
          :class="authTab === 'register' ? 'active' : ''"
          @click="authTab = 'register'">Đăng ký</button>
      </div>

      <!-- Login -->
      <form v-if="authTab === 'login'" @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label">Tên tài khoản</label>
          <input ref="userInput" v-model="username" type="text" class="form-control form-control-lg"
            placeholder="Nhập tên tài khoản" />
        </div>
        <div class="mb-3">
          <label class="form-label">Mật khẩu</label>
          <input v-model="password" type="password" class="form-control form-control-lg"
            placeholder="Nhập mật khẩu" />
        </div>
        <div class="form-check mb-3">
          <input v-model="remember" type="checkbox" class="form-check-input" id="remember" />
          <label class="form-check-label" for="remember" style="color: var(--text-secondary)">Ghi nhớ mật khẩu</label>
        </div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="loggingIn">Đăng nhập</button>
        <div class="text-center mt-3 mb-2">
          <small style="color: var(--text-muted)">─ hoặc ─</small>
        </div>
        <div ref="googleBtnRef" class="w-100 d-flex justify-content-center"></div>
        <div class="text-center mt-3">
          <small style="color: var(--text-muted)">
            Chưa có tài khoản?
            <a href="#" style="color: var(--accent)" class="fw-semibold" @click.prevent="authTab = 'register'">Đăng ký ngay</a>
          </small>
        </div>
      </form>

      <!-- Register -->
      <form v-if="authTab === 'register'" @submit.prevent="submitRegister">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Họ và tên <span class="text-danger">*</span></label>
            <input v-model="registerForm.hoten" type="text" class="form-control" placeholder="Nguyễn Văn A" required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
            <input v-model="registerForm.ngaysinh" type="date" class="form-control" required />
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Giới tính <span class="text-danger">*</span></label>
            <select v-model="registerForm.gioitinh" class="form-select" required>
              <option value="">-- Chọn --</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Gmail <span class="text-danger">*</span></label>
            <div class="input-group">
              <input v-model="registerForm.email" type="email" class="form-control" placeholder="user@gmail.com"
                :disabled="otpVerified" />
              <button class="btn btn-outline-primary" type="button" @click="sendOtp"
                :disabled="otpSending || otpVerified || !registerForm.email">
                <span v-if="otpSending" class="spinner-border spinner-border-sm"></span>
                <span v-else-if="otpTimer > 0 && otpSent">{{ otpTimer }}s</span>
                <span v-else-if="otpVerified"><i class="bi bi-check-lg"></i></span>
                <span v-else>Gửi OTP</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="otpSent && !otpVerified" class="row">
          <div class="col-md-6 offset-md-6 mb-3">
            <label class="form-label">Mã OTP</label>
            <div class="input-group">
              <input v-model="otpCode" class="form-control" placeholder="Nhập mã 6 số" maxlength="6" />
              <button class="btn btn-outline-success" type="button" @click="verifyOtp"
                :disabled="otpVerifying || otpCode.length < 6">
                <span v-if="otpVerifying" class="spinner-border spinner-border-sm"></span>
                <span v-else>Xác thực</span>
              </button>
            </div>
          </div>
        </div>
        <div v-if="otpVerified" class="row">
          <div class="col-md-6 offset-md-6 mb-3">
            <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
              <i class="bi bi-check-circle me-1"></i>Đã xác thực OTP
            </span>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
            <input v-model="registerForm.sodienthoai" type="text" class="form-control" placeholder="0912..." required />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
            <input v-model="registerForm.diachi" type="text" class="form-control" placeholder="Quận/Huyện, Tỉnh/TP"
              required />
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Khóa học đăng ký <span class="text-danger">*</span></label>
          <select v-model="registerForm.makh" class="form-select" required>
            <option value="">-- Chọn khóa học --</option>
            <option v-for="kh in khoaHocList" :key="kh.makh" :value="kh.makh">{{ kh.tenkhoahoc }} [{{ kh.hangBang }}]</option>
          </select>
         </div>
         <div class="mb-3">
           <label class="form-label">Hạng GPLX</label>
           <select v-model="registerForm.maHang" class="form-select">
             <option value="">-- Chọn hạng GPLX --</option>
             <option v-for="hg in hangGPLXList" :key="hg.id" :value="hg.maHang">{{ hg.tenHang }}</option>
           </select>
         </div>
         <div v-if="registerError" class="alert alert-danger py-2">{{ registerError }}</div>
        <div v-if="registerSuccess" class="alert alert-success py-2">{{ registerSuccess }}</div>
        <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="registerLoading">
          {{ registerLoading ? "Đang gửi..." : "Gửi đăng ký" }}
        </button>
        <div class="text-center mt-3">
          <small style="color: var(--text-muted)">
            Đã có tài khoản?
            <a href="#" style="color: var(--accent)" class="fw-semibold" @click.prevent="authTab = 'login'">Đăng nhập</a>
          </small>
        </div>
      </form>

      <div class="text-center mt-3">
        <small style="color: var(--text-muted)">TK demo: admin / admin123 (quản trị) — hocvien1 / 123456 (học viên) —
          giaovien1 / 123456 (giáo viên)</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { getPageMode, roleHome } from "../services/permissions";
import { useSite } from "../composables/useSite";
import { useWebSocket } from "../composables/useWebSocket";

const router = useRouter();
const { authTab, registerForm, registerLoading, registerError, registerSuccess, khoaHocList, hangGPLXList,
  otpSent, otpVerified, otpCode, otpSending, otpVerifying, otpTimer, sendOtp, verifyOtp,
  submitRegister, loadKhoaHocPublic, loadHangGPLX, loggedIn, role, displayName, authVersion, handleGoogleLogin,
  renderGoogleButton } = useSite();
const { connect: wsConnect, disconnect: wsDisconnect } = useWebSocket();

const username = ref("");
const password = ref("");
const error = ref("");
const userInput = ref(null);
const remember = ref(false);
const loggingIn = ref(false);
const googleBtnRef = ref(null);

onMounted(() => {
  if (loggedIn.value) {
    router.push(roleHome(role.value));
    return;
  }
  loadKhoaHocPublic();
  loadHangGPLX();
  nextTick(() => {
    renderGoogleButton(googleBtnRef, handleGoogleLogin);
  });
});

watch(authTab, async () => {
  error.value = "";
  registerError.value = "";
  registerSuccess.value = "";
  await nextTick();
  if (authTab.value === "login") {
    renderGoogleButton(googleBtnRef, handleGoogleLogin);
  }
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }
  loggingIn.value = true;
  try {
    const res = await api.post("/login", { tendangnhap: username.value, matkhau: password.value });
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      loggedIn.value = true;
      role.value = res.data.data.maVaiTro;
      displayName.value = res.data.data.hoten || res.data.data.tenTaiKhoan || res.data.data.tenvaitro || "Người dùng";
      authVersion.value++;
      router.push(roleHome(res.data.data.maVaiTro));
      wsConnect();
    } else {
      error.value = res.data.message;
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Đăng nhập thất bại";
  } finally {
    loggingIn.value = false;
  }
};
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0b1120 0%, #111827 50%, #1a2332 100%);
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 480px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 32px 28px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.login-page-logo {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  object-fit: cover;
  border: 2px solid rgba(212, 168, 83, 0.3);
}

.auth-tabs {
  gap: 4px;
}

.auth-tab {
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary, #94a3b8);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
}

.auth-tab:hover {
  background: rgba(255, 255, 255, 0.08);
}

.auth-tab.active {
  background: linear-gradient(135deg, #d4a853, #c99a3e);
  color: #0b1120;
  border-color: transparent;
  font-weight: 700;
}

:deep(.form-control),
:deep(.form-select) {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-primary, #f1f5f9);
  padding: 10px 14px;
}

:deep(.form-control:focus),
:deep(.form-select:focus) {
  border-color: #d4a853;
  box-shadow: 0 0 0 4px rgba(212, 168, 83, 0.15);
  background: rgba(255, 255, 255, 0.08);
}

:deep(.form-control::placeholder) {
  color: rgba(255, 255, 255, 0.3);
}

:deep(.btn-primary) {
  background: linear-gradient(135deg, #d4a853, #c99a3e);
  border: none;
  color: #0b1120;
  font-weight: 700;
  padding: 12px;
  border-radius: 12px;
}

:deep(.btn-primary:hover) {
  background: linear-gradient(135deg, #e4b85e, #d4a853);
}

:deep(.btn-primary:disabled) {
  opacity: 0.6;
}

:deep(.form-check-label) {
  color: var(--text-secondary, #94a3b8) !important;
}

:deep(.alert) {
  border-radius: 10px;
}
</style>