import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { roleHome } from "../services/permissions";

const username = ref("");
const password = ref("");
const error = ref("");
const showLogin = ref(false);
const userInput = ref(null);

let siteUser = {};
try {
  siteUser = JSON.parse(localStorage.getItem("user") || "{}");
} catch (e) {
  siteUser = {};
}
const loggedIn = ref(!!siteUser.maVaiTro);
const role = ref(siteUser.maVaiTro || "");
const displayName = ref(siteUser.hoten || siteUser.tenTaiKhoan || siteUser.tenvaitro || "Người dùng");
// Trigger để App.vue re-render đúng branch ngay sau login/logout
const authVersion = ref(0);

const logout = () => {
  const r = useRouter();
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  loggedIn.value = false;
    role.value = "";
    authVersion.value++;
    r.push("/");
};

const khoaHocList = ref([]);
const hangGPLXList = ref([]);
const showRegister = ref(false);
const registerLoading = ref(false);
const registerError = ref("");
const registerSuccess = ref("");
const authTab = ref("login");

const registerForm = ref({
  hoten: "",
  ngaysinh: "",
  gioitinh: "",
  sodienthoai: "",
  email: "",
  diachi: "",
  makh: "",
  maHang: "",
});

// OTP state
const otpSent = ref(false);
const otpVerified = ref(false);
const otpCode = ref("");
const otpSending = ref(false);
const otpVerifying = ref(false);
const otpTimer = ref(0);
let otpInterval = null;

// Quên mật khẩu state
const showForgot = ref(false);
const forgotStep = ref(1); // 1 = nhập email, 2 = OTP + mật khẩu mới
const forgotEmail = ref("");
const forgotOtp = ref("");
const forgotMatKhauMoi = ref("");
const forgotError = ref("");
const forgotSuccess = ref("");
const forgotLoading = ref(false);
const forgotOtpSent = ref(false);
const forgotTimer = ref(0);
let forgotInterval = null;

watch(showLogin, (val) => {
  if (val) {
    nextTick(() => userInput.value?.focus());
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
    // Reset OTP khi đóng modal
    otpSent.value = false;
    otpVerified.value = false;
    otpCode.value = "";
    if (otpInterval) { clearInterval(otpInterval); otpInterval = null; }
    otpTimer.value = 0;
  }
});

watch(showForgot, (val) => {
  if (!val) {
    forgotStep.value = 1;
    forgotEmail.value = "";
    forgotOtp.value = "";
    forgotMatKhauMoi.value = "";
    forgotError.value = "";
    forgotSuccess.value = "";
    forgotOtpSent.value = false;
    if (forgotInterval) { clearInterval(forgotInterval); forgotInterval = null; }
    forgotTimer.value = 0;
  }
});

watch(showRegister, (val) => {
  if (val) {
    document.body.style.overflow = "hidden";
    registerError.value = "";
    registerSuccess.value = "";
  } else {
    document.body.style.overflow = "";
  }
});

watch(authTab, () => {
  error.value = "";
  registerError.value = "";
  registerSuccess.value = "";
  showForgot.value = false;
  // Reset OTP khi chuyển tab
  otpSent.value = false;
  otpVerified.value = false;
  otpCode.value = "";
  if (otpInterval) { clearInterval(otpInterval); otpInterval = null; }
  otpTimer.value = 0;
});

const loadKhoaHocPublic = async () => {
  try {
    const res = await api.get("/khoa-hoc");
    khoaHocList.value = res.data;
  } catch (e) {
    console.log(e);
  }
};

const loadHangGPLX = async () => {
  try {
    const res = await api.get("/hang-gplx");
    hangGPLXList.value = res.data;
  } catch (e) {
    console.log(e);
  }
};

const submitRegister = async () => {
  registerError.value = "";
  registerSuccess.value = "";
  const f = registerForm.value;
  const requiredFields = [
    { key: "hoten", label: "Họ và tên" },
    { key: "ngaysinh", label: "Ngày sinh" },
    { key: "gioitinh", label: "Giới tính" },
    { key: "sodienthoai", label: "Số điện thoại" },
    { key: "email", label: "Email" },
    { key: "diachi", label: "Địa chỉ" },
    { key: "makh", label: "Khóa học" },
    { key: "maHang", label: "Hạng GPLX" },
  ];
  const missing = requiredFields
    .filter((rf) => !String(f[rf.key] ?? "").trim())
    .map((rf) => rf.label);
  if (missing.length) {
    registerError.value = "Vui lòng điền đầy đủ các thông tin: " + missing.join(", ");
    return;
  }

  if (!otpVerified.value) {
    registerError.value = "Vui lòng xác thực OTP trước khi gửi đăng ký";
    return;
  }

  registerLoading.value = true;
  try {
    const res = await api.post("/dang-ky-khoa-hoc/public", {
      hoten: f.hoten,
      ngaysinh: f.ngaysinh || null,
      gioitinh: f.gioitinh,
      sodienthoai: f.sodienthoai,
      email: f.email,
      diachi: f.diachi,
      makh: Number(f.makh),
      maHang: f.maHang || null,
    });
    if (res.data && res.data.success) {
      registerSuccess.value = res.data.message || "Đăng ký thành công";
      registerForm.value = {
        hoten: "",
        ngaysinh: "",
        gioitinh: "",
        sodienthoai: "",
        email: "",
        diachi: "",
        makh: "",
        maHang: "",
      };
      setTimeout(() => (showLogin.value = false), 1800);
    } else {
      registerError.value = res.data?.message || "Đăng ký thất bại";
    }
  } catch (err) {
    registerError.value = err.response?.data?.message || "Đăng ký thất bại";
    console.error(err);
  } finally {
    registerLoading.value = false;
  }
};

let googleScriptPromise = null;

const waitGoogleAccounts = (maxWait = 3000, interval = 50) => {
  return new Promise((resolve) => {
    let waited = 0;
    const check = () => {
      if (typeof google !== "undefined" && google.accounts) {
        resolve();
        return;
      }
      waited += interval;
      if (waited >= maxWait) {
        resolve();
        return;
      }
      setTimeout(check, interval);
    };
    check();
  });
};

const loadGoogleScript = () => {
  if (googleScriptPromise) return googleScriptPromise;
  if (typeof google !== "undefined" && google.accounts) {
    googleScriptPromise = Promise.resolve();
    return googleScriptPromise;
  }
  googleScriptPromise = new Promise((resolve) => {
    const existing = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existing) {
      const tryResolve = () => {
        if (typeof google !== "undefined" && google.accounts) {
          resolve();
          return;
        }
        setTimeout(tryResolve, 50);
      };
      existing.addEventListener("load", tryResolve);
      existing.addEventListener("error", () => resolve());
      if (existing.readyState === "complete" || existing.readyState === "loaded") {
        tryResolve();
      }
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      const tryResolve = () => {
        if (typeof google !== "undefined" && google.accounts) {
          resolve();
          return;
        }
        setTimeout(tryResolve, 50);
      };
      tryResolve();
    };
    script.onerror = () => resolve();
    document.head.appendChild(script);
  });
  return googleScriptPromise;
};

const renderGoogleButton = async (containerRef, onCredential, retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await loadGoogleScript();
    } catch (e) {
      console.error("Failed to load Google script", e);
    }
    if (!containerRef.value) {
      await new Promise((r) => setTimeout(r, 200));
      continue;
    }
    if (typeof google === "undefined" || !google.accounts) {
      await new Promise((r) => setTimeout(r, 200));
      continue;
    }
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    try {
      google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response.credential && onCredential) {
            onCredential(response.credential);
          }
        },
      });
      google.accounts.id.renderButton(containerRef.value, {
        type: "standard",
        shape: "pill",
        theme: "outline",
        size: "large",
        text: "signin_with",
        width: containerRef.value.offsetWidth || 300,
      });
      return;
    } catch (e) {
      console.error("Failed to render Google button, retry", i + 1, e);
      await new Promise((r) => setTimeout(r, 200));
    }
  }
};

export function useSite() {
  const router = useRouter();

  const goPortal = () => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    router.push(roleHome(u.maVaiTro));
  };

  const handleLogin = async () => {
    if (!username.value || !password.value) {
      error.value = "Vui lòng nhập đầy đủ thông tin";
      return;
    }
    try {
      const res = await api.post("/login", {
        tendangnhap: username.value,
        matkhau: password.value,
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        showLogin.value = false;
        loggedIn.value = true;
        role.value = res.data.data.maVaiTro;
        displayName.value =
          res.data.data.hoten ||
          res.data.data.tenTaiKhoan ||
          res.data.data.tenvaitro ||
          "Người dùng";
        authVersion.value++;
        router.push(roleHome(res.data.data.maVaiTro));
      } else {
        error.value = res.data.message;
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Đăng nhập thất bại";
      console.error(err);
    }
  };

  const openRegister = () => {
    if (!khoaHocList.value.length) loadKhoaHocPublic();
    if (!hangGPLXList.value.length) loadHangGPLX();
    authTab.value = "register";
    showLogin.value = true;
  };

  const handleGoogleLogin = async (idToken) => {
    try {
      const res = await api.post("/login/google", { idToken });
      if (res.data.success) {
        localStorage.setItem("token", res.data.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.data));
        showLogin.value = false;
        loggedIn.value = true;
        role.value = res.data.data.maVaiTro;
        displayName.value = res.data.data.hoten || res.data.data.tenTaiKhoan || "Người dùng";
        authVersion.value++;
        router.push(roleHome(res.data.data.maVaiTro));
      } else {
        error.value = res.data.message;
      }
    } catch (err) {
      error.value = err.response?.data?.message || "Đăng nhập Google thất bại";
    }
  };

  // OTP functions
  const sendOtp = async () => {
    const email = registerForm.value.email;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      registerError.value = "Vui lòng nhập email hợp lệ trước khi gửi OTP";
      return;
    }
    otpSending.value = true;
    registerError.value = "";
    try {
      const res = await api.post("/dang-ky-khoa-hoc/send-otp", { email });
      if (res.data.success) {
        otpSent.value = true;
        otpTimer.value = 60;
        if (otpInterval) clearInterval(otpInterval);
        otpInterval = setInterval(() => {
          otpTimer.value--;
          if (otpTimer.value <= 0) { clearInterval(otpInterval); otpInterval = null; }
        }, 1000);
        registerSuccess.value = "Mã OTP đã gửi đến email của bạn";
      } else {
        registerError.value = res.data.message;
      }
    } catch (e) {
      registerError.value = e.response?.data?.message || "Gửi OTP thất bại";
    } finally {
      otpSending.value = false;
    }
  };

  const verifyOtp = async () => {
    if (!otpCode.value || otpCode.value.length < 6) {
      registerError.value = "Vui lòng nhập mã OTP";
      return;
    }
    otpVerifying.value = true;
    registerError.value = "";
    try {
      const res = await api.post("/dang-ky-khoa-hoc/verify-otp", {
        email: registerForm.value.email,
        otp: otpCode.value,
      });
      if (res.data.success) {
        otpVerified.value = true;
        registerSuccess.value = "Xác thực OTP thành công!";
        if (otpInterval) { clearInterval(otpInterval); otpInterval = null; }
      } else {
        registerError.value = res.data.message;
      }
    } catch (e) {
      registerError.value = e.response?.data?.message || "Xác thực OTP thất bại";
    } finally {
      otpVerifying.value = false;
    }
  };

  // ===== Quên mật khẩu =====
  const openForgot = () => {
    showLogin.value = true;
    showForgot.value = true;
    forgotStep.value = 1;
    forgotEmail.value = "";
    forgotOtp.value = "";
    forgotMatKhauMoi.value = "";
    forgotError.value = "";
    forgotSuccess.value = "";
    forgotOtpSent.value = false;
  };

  const closeForgot = () => {
    showForgot.value = false;
  };

  const sendForgotOtp = async () => {
    if (!forgotEmail.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.value)) {
      forgotError.value = "Vui lòng nhập email hợp lệ";
      return;
    }
    forgotLoading.value = true;
    forgotError.value = "";
    try {
      const res = await api.post("/quen-mat-khau/send-otp", { email: forgotEmail.value });
      if (res.data.success) {
        forgotOtpSent.value = true;
        forgotTimer.value = 60;
        if (forgotInterval) clearInterval(forgotInterval);
        forgotInterval = setInterval(() => {
          forgotTimer.value--;
          if (forgotTimer.value <= 0) { clearInterval(forgotInterval); forgotInterval = null; }
        }, 1000);
        forgotSuccess.value = res.data.message || "Đã gửi mã OTP, kiểm tra email của bạn";
      } else {
        forgotError.value = res.data.message;
      }
    } catch (e) {
      forgotError.value = e.response?.data?.message || "Gửi OTP thất bại";
    } finally {
      forgotLoading.value = false;
    }
  };

  const verifyForgotOtp = async () => {
    if (!forgotOtp.value || forgotOtp.value.length < 6) {
      forgotError.value = "Vui lòng nhập mã OTP 6 số";
      return;
    }
    forgotLoading.value = true;
    forgotError.value = "";
    try {
      const res = await api.post("/quen-mat-khau/verify-otp", {
        email: forgotEmail.value,
        otp: forgotOtp.value,
      });
      if (res.data.success) {
        forgotStep.value = 2;
        forgotSuccess.value = "Xác thực OTP thành công, hãy đặt mật khẩu mới";
        if (forgotInterval) { clearInterval(forgotInterval); forgotInterval = null; }
      } else {
        forgotError.value = res.data.message;
      }
    } catch (e) {
      forgotError.value = e.response?.data?.message || "Xác thực OTP thất bại";
    } finally {
      forgotLoading.value = false;
    }
  };

  const resetForgotPassword = async () => {
    if (!forgotMatKhauMoi.value || forgotMatKhauMoi.value.length < 6) {
      forgotError.value = "Mật khẩu mới phải có ít nhất 6 ký tự";
      return;
    }
    forgotLoading.value = true;
    forgotError.value = "";
    try {
      const res = await api.post("/quen-mat-khau/reset-password", {
        email: forgotEmail.value,
        otp: forgotOtp.value,
        matKhauMoi: forgotMatKhauMoi.value,
      });
      if (res.data.success) {
        forgotSuccess.value = "Đặt lại mật khẩu thành công, vui lòng đăng nhập lại";
        setTimeout(() => {
          showForgot.value = false;
          showLogin.value = false;
          authTab.value = "login";
        }, 1500);
      } else {
        forgotError.value = res.data.message;
      }
    } catch (e) {
      forgotError.value = e.response?.data?.message || "Đặt lại mật khẩu thất bại";
    } finally {
      forgotLoading.value = false;
    }
  };

  // ===== Thanh toán QR (yêu cầu đăng nhập - Học viên) =====
  const khoiTaoThanhToan = async (madk) => {
    const res = await api.post("/thanh-toan/khoi-tao", { madk });
    return res.data;
  };

  const kiemTraTrangThaiThanhToan = async (matt) => {
    const res = await api.get(`/thanh-toan/${matt}/trang-thai`);
    return res.data;
  };

  const layThongTinThanhToan = async (matt) => {
    const res = await api.get(`/thanh-toan/${matt}/qr`);
    return res.data;
  };

  const xacNhanThanhToan = async (matt) => {
    const res = await api.post(`/thanh-toan/xac-nhan/${matt}`);
    return res.data;
  };

  // ===== Email thông báo kỳ đóng học phần (Admin/NV) =====
  const xemTruocNguoiNhan = async (makh = null) => {
    const params = makh ? { params: { makh } } : {};
    const res = await api.get("/email/thong-bao-ky-dong/preview", params);
    return res.data;
  };

  const guiThongBaoKyDong = async (data) => {
    const res = await api.post("/email/thong-bao-ky-dong", data);
    return res.data;
  };

  return {
    username, password, error, showLogin, userInput,
    loggedIn, role, displayName, authVersion, logout,
    khoaHocList, hangGPLXList, showRegister, registerLoading, registerError, registerSuccess, registerForm,
    authTab, goPortal, handleLogin, handleGoogleLogin, openRegister, submitRegister, loadKhoaHocPublic, loadHangGPLX,
    otpSent, otpVerified, otpCode, otpSending, otpVerifying, otpTimer, sendOtp, verifyOtp,
    showForgot, forgotStep, forgotEmail, forgotOtp, forgotMatKhauMoi, forgotError, forgotSuccess,
    forgotLoading, forgotOtpSent, forgotTimer, openForgot, closeForgot, sendForgotOtp, verifyForgotOtp, resetForgotPassword,
    loadGoogleScript, renderGoogleButton,
    khoiTaoThanhToan, kiemTraTrangThaiThanhToan, xacNhanThanhToan, layThongTinThanhToan,
    xemTruocNguoiNhan, guiThongBaoKyDong,
  };
}
