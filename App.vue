<template>
  <div v-if="isAnonymous" class="site-layout">
    <SiteNavbar />
    <router-view />
    <ToastContainer />
    <ChatBox />
  </div>

  <div v-else class="app-layout" :class="{ 'dark-mode': theme === 'dark' }">
    <Sidebar />
    <div class="sidebar-overlay" @click="toggleSidebar"></div>

    <div class="main-content">
      <Header />

      <main class="content-area">
        <div class="page-container">
          <router-view />
        </div>
      </main>

      <Footer />
    </div>
    <ToastContainer />
  </div>

  <!-- Login / Register modal (global) -->
  <div class="login-modal-overlay" v-if="showLogin && route.path !== '/login'" @click.self="showLogin = false">
    <div class="login-modal">
      <button class="modal-close" @click="showLogin = false">&times;</button>

      <div class="text-center mb-3">
        <img src="/logo1.jpg" alt="Logo" class="login-logo" />
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
      <form v-if="authTab === 'login' && !showForgot" @submit.prevent="handleLogin">
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
          <label class="form-check-label" for="remember" style="color:var(--text-secondary)">Ghi nhớ mật khẩu</label>
        </div>
        <div class="text-end mb-2">
          <a href="#" class="small fw-semibold" style="color:var(--accent)" @click.prevent="openForgot">Quên mật khẩu?</a>
        </div>
        <div v-if="error" class="alert alert-danger py-2">{{ error }}</div>
        <button type="submit" class="btn btn-primary btn-lg w-100">Đăng nhập</button>
        <div class="text-center mt-3 mb-2">
          <small style="color:var(--text-muted)">─ hoặc ─</small>
        </div>
        <div ref="googleBtnRef" class="w-100 d-flex justify-content-center"></div>
        <div class="text-center mt-3">
          <small style="color:var(--text-muted)">
            Chưa có tài khoản?
            <a href="#" style="color:var(--accent)" class="fw-semibold" @click.prevent="authTab = 'register'">Đăng ký ngay</a>
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
              <input v-model="registerForm.email" type="email" class="form-control" placeholder="user@gmail.com" :disabled="otpVerified" />
              <button class="btn btn-outline-primary" type="button" @click="sendOtp" :disabled="otpSending || otpVerified || !registerForm.email">
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
              <button class="btn btn-outline-success" type="button" @click="verifyOtp" :disabled="otpVerifying || otpCode.length < 6">
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
            <input v-model="registerForm.diachi" type="text" class="form-control" placeholder="Quận/Huyện, Tỉnh/TP" required />
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
           <small style="color:var(--text-muted)">
             Đã có tài khoản?
             <a href="#" style="color:var(--accent)" class="fw-semibold" @click.prevent="authTab = 'login'">Đăng nhập</a>
           </small>
         </div>
       </form>

       <!-- Quên mật khẩu -->
       <form v-if="authTab === 'login' && showForgot" @submit.prevent="forgotStep === 1 ? sendForgotOtp() : resetForgotPassword()">
         <div class="forgot-panel">
           <div class="forgot-header">
             <div class="forgot-icon"><i class="bi bi-shield-lock"></i></div>
             <div>
               <h6 class="fw-bold mb-1">Quên mật khẩu?</h6>
               <p class="forgot-subtitle mb-0">Nhập email đăng ký để nhận mã xác thực</p>
             </div>
           </div>

           <!-- Bước 1: nhập email -->
           <template v-if="forgotStep === 1">
             <div class="mb-3">
               <label class="form-label">Email đăng ký</label>
               <div class="input-group">
                 <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                 <input v-model="forgotEmail" type="email" class="form-control form-control-lg"
                   placeholder="user@gmail.com" :disabled="forgotOtpSent" />
               </div>
             </div>
             <div v-if="forgotError" class="forgot-alert forgot-alert-error">
               <i class="bi bi-exclamation-triangle me-1"></i>{{ forgotError }}
             </div>
             <div v-if="forgotSuccess" class="forgot-alert forgot-alert-success">
               <i class="bi bi-check-circle me-1"></i>{{ forgotSuccess }}
             </div>
             <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="forgotLoading">
               <span v-if="forgotLoading" class="spinner-border spinner-border-sm me-1"></span>
               <span v-else><i class="bi bi-send me-1"></i></span>Gửi mã OTP
             </button>
             <div v-if="forgotOtpSent" class="d-flex align-items-center justify-content-between mt-3 forgot-sent-row">
               <span class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
                 <i class="bi bi-check-circle me-1"></i>Đã gửi{{ forgotTimer > 0 ? ` (${forgotTimer}s)` : "" }}
               </span>
               <a href="#" class="small fw-semibold" style="color:var(--accent)" @click.prevent="sendForgotOtp">Gửi lại</a>
             </div>
           </template>

           <!-- Bước 2: OTP + mật khẩu mới -->
           <template v-else>
             <div class="mb-3">
               <label class="form-label">Mã OTP</label>
               <div class="input-group">
                 <span class="input-group-text"><i class="bi bi-shield-check"></i></span>
                 <input v-model="forgotOtp" class="form-control form-control-lg" placeholder="Nhập mã 6 số" maxlength="6" />
               </div>
             </div>
             <div class="mb-3">
               <label class="form-label">Mật khẩu mới</label>
               <div class="input-group">
                 <span class="input-group-text"><i class="bi bi-key"></i></span>
                 <input v-model="forgotMatKhauMoi" :type="forgotShowPass ? 'text' : 'password'"
                   class="form-control form-control-lg" placeholder="Ít nhất 6 ký tự" />
                 <button type="button" class="btn btn-outline-secondary forgot-eye-btn" @click="forgotShowPass = !forgotShowPass">
                   <i :class="forgotShowPass ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                 </button>
               </div>
             </div>
             <div v-if="forgotError" class="forgot-alert forgot-alert-error">
               <i class="bi bi-exclamation-triangle me-1"></i>{{ forgotError }}
             </div>
             <div v-if="forgotSuccess" class="forgot-alert forgot-alert-success">
               <i class="bi bi-check-circle me-1"></i>{{ forgotSuccess }}
             </div>
             <button type="submit" class="btn btn-primary btn-lg w-100" :disabled="forgotLoading">
               {{ forgotLoading ? "Đang xử lý..." : "Đặt lại mật khẩu" }}
             </button>
           </template>

           <div class="text-center mt-3">
             <a href="#" class="small fw-semibold" style="color:var(--text-muted)" @click.prevent="closeForgot">
               <i class="bi bi-arrow-left me-1"></i>Quay lại đăng nhập
             </a>
           </div>
         </div>
       </form>

       <div class="text-center mt-3">
         <small style="color:var(--text-muted)">TK demo: admin / admin123 (quản trị) — hocvien1 / 123456 (học viên) — giaovien1 / 123456 (giáo viên)</small>
       </div>
     </div>
   </div>

   <!-- Tra cứu modal (global) -->
  <div class="login-modal-overlay" v-if="showTraCuu" @click.self="showTraCuu = false">
    <div class="login-modal" style="max-width:600px">
      <button class="modal-close" @click="showTraCuu = false">&times;</button>
      <div class="text-center mb-3">
        <img src="/logo1.jpg" alt="Logo" class="login-logo" />
        <h5 class="fw-bold mt-2" style="color:#fff">Tra cứu đăng ký khóa học</h5>
        <p style="color:var(--text-muted)" class="small">Nhập email đã đăng ký để tra cứu</p>
      </div>
      <div class="input-group mb-3">
        <input v-model="traCuuEmail" class="form-control" placeholder="Nhập email của bạn" @keyup.enter="traCuu" />
        <button class="btn btn-primary" @click="traCuu" :disabled="traCuuLoading">
          <span v-if="traCuuLoading" class="spinner-border spinner-border-sm"></span>
          <i v-else class="bi bi-search me-1"></i>Tìm
        </button>
      </div>
      <div v-if="traCuuError" class="alert alert-danger py-2 small">{{ traCuuError }}</div>
      <div v-if="traCuuData !== null && traCuuData.length === 0" class="text-center py-3" style="color:var(--text-muted)">
        <i class="bi bi-inbox fs-3 d-block mb-1"></i>Không tìm thấy đăng ký nào
      </div>
      <div v-if="traCuuData && traCuuData.length > 0" class="table-responsive">
        <table class="table align-middle mb-0" style="color:var(--text-secondary)">
          <thead style="background:rgba(255,255,255,0.04)">
            <tr><th class="fw-semibold">#</th><th class="fw-semibold">Khóa học</th><th class="fw-semibold">Ngày ĐK</th><th class="fw-semibold">Trạng thái</th></tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in traCuuData" :key="item.madk">
              <td>{{ i + 1 }}</td>
              <td class="fw-medium">{{ item.tenKhoaHoc }}</td>
              <td>{{ formatDate(item.ngaydangky) }}</td>
              <td><span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(item.trangthai)">{{ item.trangthai }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, provide, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "./services/api";
import { getPageMode, roleHome } from "./services/permissions";
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import Footer from "./components/layout/Footer.vue";
import SiteNavbar from "./components/site/SiteNavbar.vue";
import ChatBox from "./components/site/ChatBox.vue";
import ToastContainer from "./components/common/ToastContainer.vue";
import { useSite } from "./composables/useSite";
import { useWebSocket } from "./composables/useWebSocket";

const route = useRoute();
const router = useRouter();
const { role, authVersion, showLogin, loggedIn, displayName, authTab, registerForm, registerLoading, registerError, registerSuccess, khoaHocList, hangGPLXList, submitRegister, loadKhoaHocPublic, loadHangGPLX,
  otpSent, otpVerified, otpCode, otpSending, otpVerifying, otpTimer, sendOtp, verifyOtp, handleGoogleLogin, renderGoogleButton,
  showForgot, forgotStep, forgotEmail, forgotOtp, forgotMatKhauMoi, forgotError, forgotSuccess, forgotLoading, forgotOtpSent, forgotTimer, openForgot, closeForgot, sendForgotOtp, resetForgotPassword } = useSite();
const { connect: wsConnect, disconnect: wsDisconnect } = useWebSocket();

// Dark mode state
const isDarkMode = ref(false);
const theme = computed(() => isDarkMode.value ? "dark" : "light");

// Toggle dark mode
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  if (!isAnonymous.value) {
    document.documentElement.setAttribute("data-bs-theme", theme.value);
  }
  localStorage.setItem("theme", theme.value);
};

// Load theme preference on startup
if (typeof localStorage !== "undefined") {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
    isDarkMode.value = true;
  }
}

provide("theme", theme);
provide("toggleTheme", toggleTheme);

const user = computed(() => {
  authVersion.value;
  route.value;
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    return {};
  }
});

const isAnonymous = computed(() => {
  authVersion.value;
  return !user.value || !user.value.maVaiTro;
});

// Apply data-bs-theme only for logged-in users (admin layout)
const applyTheme = () => {
  if (!isAnonymous.value && isDarkMode.value) {
    document.documentElement.setAttribute("data-bs-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-bs-theme");
  }
};

watch([isAnonymous, isDarkMode], applyTheme, { immediate: true });
const readOnly = computed(() => getPageMode(user.value.maVaiTro, route.path) === "view");
provide("readOnly", readOnly);

// Mobile sidebar toggle
const toggleSidebar = () => {
  document.querySelector('.sidebar')?.classList.toggle('open');
};

// Track screen size for sidebar auto-hide
const handleResize = () => {
  if (window.innerWidth <= 768) {
    document.querySelector('.sidebar')?.classList.remove('open');
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('resize', handleResize);
}

// ===== Login state & handlers =====
const username = ref("");
const password = ref("");
const error = ref("");
const userInput = ref(null);
const remember = ref(localStorage.getItem("remember") === "true");

if (remember.value) {
  username.value = localStorage.getItem("saved_username") || "";
  password.value = localStorage.getItem("saved_password") || "";
}

const googleBtnRef = ref(null);
const forgotShowPass = ref(false);

const renderGoogleBtn = () => {
  renderGoogleButton(googleBtnRef, handleGoogleLogin);
};

watch(showLogin, async (val) => {
  if (val) {
    await nextTick();
    await nextTick();
    renderGoogleBtn();
    userInput.value?.focus();
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = "Vui lòng nhập đầy đủ thông tin";
    return;
  }
  try {
    const res = await api.post("/login", { tendangnhap: username.value, matkhau: password.value });
    if (res.data.success) {
      localStorage.setItem("token", res.data.data.token);
      localStorage.setItem("refreshToken", res.data.data.refreshToken || "");
      localStorage.setItem("user", JSON.stringify(res.data.data));
      showLogin.value = false;
      loggedIn.value = true;
      role.value = res.data.data.maVaiTro;
      displayName.value = res.data.data.hoten || res.data.data.tenTaiKhoan || res.data.data.tenvaitro || "Người dùng";
      authVersion.value++;
      if (remember.value) {
        localStorage.setItem("saved_username", username.value);
        localStorage.setItem("saved_password", password.value);
        localStorage.setItem("remember", "true");
      } else {
        localStorage.removeItem("saved_username");
        localStorage.removeItem("saved_password");
        localStorage.removeItem("remember");
      }
      router.push(roleHome(res.data.data.maVaiTro));
      wsConnect();
    } else {
      error.value = res.data.message;
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Đăng nhập thất bại";
  }
};

// Tra cứu đăng ký
const showTraCuu = ref(false);
const traCuuEmail = ref("");
const traCuuLoading = ref(false);
const traCuuError = ref("");
const traCuuData = ref(null);

const openTraCuu = () => { showTraCuu.value = true; traCuuError.value = ""; traCuuData.value = null; };

const traCuu = async () => {
  if (!traCuuEmail.value.trim()) { traCuuError.value = "Vui lòng nhập email"; return; }
  traCuuLoading.value = true;
  traCuuError.value = "";
  traCuuData.value = null;
  try {
    const res = await api.post("/dang-ky-khoa-hoc/tra-cuu", { email: traCuuEmail.value });
    if (res.data.success) traCuuData.value = res.data.data || [];
    else traCuuError.value = res.data.message;
  } catch (e) { traCuuError.value = "Tra cứu thất bại"; }
  finally { traCuuLoading.value = false; }
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const trangThaiBadge = (s) => {
  const map = { "Chờ duyệt": "bg-warning bg-opacity-10 text-warning", "Đã duyệt": "bg-info bg-opacity-10 text-info", "Đang học": "bg-success bg-opacity-10 text-success", "Hoàn thành": "bg-primary bg-opacity-10 text-primary", "Đã hủy": "bg-danger bg-opacity-10 text-danger" };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
};

loadKhoaHocPublic();
loadHangGPLX();

// WebSocket: connect if already logged in, disconnect on logout
onMounted(() => {
  if (loggedIn.value) wsConnect();
});
watch(loggedIn, (val) => {
  if (!val) wsDisconnect();
});
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f6fb;
  font-family: "Segoe UI", "Roboto", "Helvetica Neue", Arial,
    "Noto Sans", "Liberation Sans", sans-serif;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-area {
  flex: 1;
  padding: 28px;
  background: linear-gradient(180deg, #f3f6fb, #eef2f7);
}

.page-container {
  max-width: 100%;
  animation: fadeIn 0.25s ease-in-out;
}

.portal-layout {
  min-height: 100vh;
  background: #f3f6fb;
}

.portal-content {
  padding: 28px;
  background: linear-gradient(180deg, #f3f6fb, #eef2f7);
}

.portal-content .page-container {
  max-width: 1200px;
  margin: 0 auto;
  animation: fadeIn 0.25s ease-in-out;
}

:deep(.card) {
  border: none;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

:deep(.card-body) {
  padding: 24px;
}

:deep(h2) {
  font-weight: 800;
  color: #111827;
}

:deep(.text-muted) {
  color: #6b7280 !important;
}

:deep(.btn) {
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 14px;
}

:deep(.btn-primary) {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  border: none;
  box-shadow: 0 6px 16px rgba(13, 110, 253, 0.28);
}

:deep(.btn-primary:hover) {
  background: linear-gradient(135deg, #0b5ed7, #1d4ed8);
}

:deep(.form-control),
:deep(.form-select) {
  border-radius: 12px;
  border: 1px solid #dbe3ef;
  padding: 10px 14px;
}

:deep(.form-control:focus),
:deep(.form-select:focus) {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.12);
}

:deep(.table) {
  margin-bottom: 0;
  border-radius: 14px;
  overflow: hidden;
}

:deep(.table thead th) {
  background: #f8fafc;
  color: #111827;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px;
}

:deep(.table tbody td) {
  padding: 14px;
  color: #374151;
  vertical-align: middle;
}

:deep(.table tbody tr:hover) {
  background: #f1f5f9;
}

:deep(.badge) {
  border-radius: 999px;
  padding: 7px 10px;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile responsive */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1040;
}

@media (max-width: 768px) {
  .app-layout .sidebar {
    position: fixed;
    left: -280px;
    z-index: 1050;
    transition: left 0.3s ease;
  }

  .app-layout .sidebar.open {
    left: 0;
  }

  .sidebar-overlay.open {
    display: block;
  }

  .content-area {
    padding: 16px;
  }

  :deep(.card-body) {
    padding: 16px;
  }

  :deep(h2) {
    font-size: 1.5rem;
  }
}
</style>
