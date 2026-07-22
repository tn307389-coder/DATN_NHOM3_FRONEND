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
});

watch(showLogin, (val) => {
  if (val) {
    nextTick(() => userInput.value?.focus());
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
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
});

const loadKhoaHocPublic = async () => {
  try {
    const res = await api.get("/khoa-hoc");
    khoaHocList.value = res.data;
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
  ];
  const missing = requiredFields
    .filter((rf) => !String(f[rf.key] ?? "").trim())
    .map((rf) => rf.label);
  if (missing.length) {
    registerError.value = "Vui lòng điền đầy đủ các thông tin: " + missing.join(", ");
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
    authTab.value = "register";
    showLogin.value = true;
  };

  return {
    username,
    password,
    error,
    showLogin,
    userInput,
    loggedIn,
    role,
    displayName,
    authVersion,
    logout,
    khoaHocList,
    showRegister,
    registerLoading,
    registerError,
    registerSuccess,
    registerForm,
    authTab,
    goPortal,
    handleLogin,
    openRegister,
    submitRegister,
    loadKhoaHocPublic,
  };
}
