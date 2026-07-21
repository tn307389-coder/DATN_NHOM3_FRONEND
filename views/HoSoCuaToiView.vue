<template>
  <div>
    <div class="card shadow-sm">
      <div class="card-body">
        <div class="d-flex align-items-center gap-3 mb-4">
          <div class="profile-avatar-wrap">
            <img
              v-if="profile.anh"
              :src="avatarSrc"
              alt="Ảnh đại diện"
              class="profile-avatar-img"
            />
            <span v-else class="profile-avatar">{{ initials }}</span>
            <button
              class="btn btn-sm btn-light avatar-edit-btn"
              title="Đổi ảnh"
              @click="triggerUpload"
            >
              <i class="bi bi-camera"></i>
            </button>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              class="d-none"
              @change="onFileChange"
            />
          </div>
          <div v-if="pendingAnh" class="mt-2">
            <div class="d-flex align-items-center gap-2">
              <img :src="pendingAnh.url" alt="Ảnh chờ duyệt" class="pending-thumb" />
              <span class="badge bg-warning text-dark">
                {{ pendingAnh.trangthai === "CHO_DUYET" ? "Đang chờ duyệt" : pendingAnh.trangthai === "TU_CHOI" ? "Đã bị từ chối" : "Đã duyệt" }}
              </span>
            </div>
            <small class="text-muted">Ảnh sẽ có hiệu lực sau khi được duyệt</small>
          </div>
          <div>
            <h4 class="fw-bold mb-0">{{ profile.hoten || "Người dùng" }}</h4>
            <span class="badge bg-primary">{{ roleLabel }}</span>
          </div>
        </div>

        <div v-if="loading" class="text-center py-4 text-muted">
          <div class="spinner-border text-primary"></div>
        </div>

        <div v-else>
          <form @submit.prevent="saveProfile">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label text-muted mb-1">Tên đăng nhập</label>
                <div class="form-control-plaintext fw-semibold">{{ profile.tendangnhap }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label text-muted mb-1">Vai trò</label>
                <div class="form-control-plaintext fw-semibold">{{ roleLabel }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label">Họ và tên</label>
                <input v-model="form.hoten" type="text" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số điện thoại</label>
                <input v-model="form.soDienThoai" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <div class="form-control-plaintext fw-semibold">{{ statusLabel }}</div>
              </div>
            </div>

            <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
            <div v-if="success" class="alert alert-success mt-3 mb-0">{{ success }}</div>

            <div class="d-flex justify-content-end mt-3">
              <button type="submit" class="btn btn-primary" :disabled="saving">
                <i class="bi bi-save"></i> Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../services/api";
import { useSite } from "../composables/useSite";

const { role, displayName } = useSite();
const profile = ref({});
const form = ref({ hoten: "", email: "", soDienThoai: "" });
const loading = ref(false);
const saving = ref(false);
const error = ref("");
const success = ref("");
const fileInput = ref(null);
const uploading = ref(false);
const pendingAnh = ref(null);

const avatarSrc = computed(() =>
  profile.value.anh ? profile.value.anh : ""
);

const initials = computed(() => {
  const n = (profile.value.hoten || displayName.value || "").trim();
  if (!n) return "?";
  return n
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
});

const roleLabel = computed(() => {
  const map = { ADMIN: "Quản trị viên", NV: "Nhân viên", GV: "Giáo viên", HV: "Học viên" };
  return map[role.value] || role.value || "—";
});

const statusLabel = computed(() => {
  if (profile.value.trangthai === "ACTIVE") return "Đang hoạt động";
  if (profile.value.trangthai === "INACTIVE") return "Không hoạt động";
  return profile.value.trangthai || "—";
});

const loadProfile = async () => {
  loading.value = true;
  error.value = "";
  try {
    const res = await api.get("/tai-khoan/me");
    profile.value = res.data;
    form.value = {
      hoten: res.data.hoten || "",
      email: res.data.email || "",
      soDienThoai: res.data.soDienThoai || "",
    };
    await loadPendingAnh();
  } catch (e) {
    console.error(e);
    error.value = "Không tải được hồ sơ của bạn";
  } finally {
    loading.value = false;
  }
};

const loadPendingAnh = async () => {
  try {
    const res = await api.get("/anh-cho-duyet/cua-toi");
    pendingAnh.value = res.data || null;
  } catch (e) {
    pendingAnh.value = null;
  }
};

const triggerUpload = () => fileInput.value?.click();

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  uploading.value = true;
  error.value = "";
  success.value = "";
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/anh-cho-duyet", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    pendingAnh.value = res.data;
    success.value = "Đã gửi ảnh, chờ quản trị viên duyệt";
  } catch (err) {
    console.error(err);
    error.value = "Tải ảnh thất bại";
  } finally {
    uploading.value = false;
    e.target.value = "";
  }
};

const saveProfile = async () => {
  saving.value = true;
  error.value = "";
  success.value = "";
  try {
    const res = await api.put("/tai-khoan/me", {
      hoten: form.value.hoten,
      email: form.value.email,
      soDienThoai: form.value.soDienThoai,
    });
    profile.value = { ...profile.value, ...res.data };
    success.value = "Lưu thay đổi thành công";
  } catch (err) {
    console.error(err);
    error.value = "Lưu thất bại";
  } finally {
    saving.value = false;
  }
};

onMounted(loadProfile);
</script>

<style scoped>
.profile-avatar-wrap {
  position: relative;
  width: 64px;
  height: 64px;
}
.profile-avatar-img,
.profile-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 22px;
  flex: 0 0 auto;
}
.avatar-edit-btn {
  position: absolute;
  right: -4px;
  bottom: -4px;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}
</style>
