<template>
  <div>
    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="p-4 text-white" style="background:linear-gradient(135deg,#0d6efd,#2563eb)">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-3 bg-white bg-opacity-25 p-2"><i class="bi bi-person-badge fs-3"></i></div>
          <div><h4 class="fw-bold mb-0">Hồ sơ của tôi</h4><small class="opacity-75">Quản lý thông tin cá nhân</small></div>
        </div>
      </div>

      <div class="card-body p-4">
        <div v-if="loading" class="text-center py-4">
          <div class="skeleton-circle mb-3" style="width:80px;height:80px;border-radius:50%;background:#ddd;animation:pulse 1.5s infinite;margin:0 auto"></div>
          <div class="skeleton-box" style="width:200px;height:20px;margin:0 auto"></div>
        </div>

        <template v-else>
          <div class="d-flex flex-wrap align-items-center gap-4 mb-4 pb-3 border-bottom">
            <div class="position-relative" style="width:80px;height:80px">
              <img v-if="profile.anh" :src="avatarSrc" alt="Avatar" class="rounded-circle border border-3 border-white shadow-sm" style="width:80px;height:80px;object-fit:cover" />
              <span v-else class="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" style="width:80px;height:80px;background:linear-gradient(135deg,#0d6efd,#2563eb);font-size:28px">{{ initials }}</span>
              <button class="btn btn-light btn-sm position-absolute rounded-circle shadow-sm" style="right:-2px;bottom:-2px;width:28px;height:28px;display:flex;align-items:center;justify-content:center" title="Đổi ảnh" @click="triggerUpload"><i class="bi bi-camera"></i></button>
              <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFileChange" />
            </div>
            <div>
              <h4 class="fw-bold mb-1">{{ profile.hoten || 'Người dùng' }}</h4>
              <span class="badge rounded-pill px-3 py-2" :class="roleBadgeClass">{{ roleLabel }}</span>
            </div>
            <div v-if="pendingAnh" class="ms-auto">
              <div class="d-flex align-items-center gap-2">
                <img v-if="pendingAnh.url" :src="pendingAnh.url" alt="Preview" style="width:48px;height:48px;object-fit:cover;border-radius:8px" />
                <span class="badge rounded-pill px-3 py-2" :class="pendingAnh.trangthai === 'CHO_DUYET' ? 'bg-warning bg-opacity-10 text-warning' : pendingAnh.trangthai === 'TU_CHOI' ? 'bg-danger bg-opacity-10 text-danger' : 'bg-success bg-opacity-10 text-success'">
                  {{ pendingAnh.trangthai === 'CHO_DUYET' ? 'Chờ duyệt' : pendingAnh.trangthai === 'TU_CHOI' ? 'Bị từ chối' : 'Đã duyệt' }}
                </span>
              </div>
            </div>
          </div>

          <form @submit.prevent="saveProfile">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold small text-muted"><i class="bi bi-person me-1"></i>Tên đăng nhập</label>
                <div class="form-control-plaintext fw-semibold ps-0">{{ profile.tendangnhap }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small text-muted"><i class="bi bi-shield me-1"></i>Vai trò</label>
                <div class="form-control-plaintext ps-0"><span class="badge rounded-pill px-3 py-2" :class="roleBadgeClass">{{ roleLabel }}</span></div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-card-text me-1"></i>Họ và tên</label>
                <input v-model="form.hoten" class="form-control" :class="errors.hoten ? 'is-invalid' : ''" placeholder="Nhập họ tên" />
                <div v-if="errors.hoten" class="invalid-feedback">{{ errors.hoten }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-envelope me-1"></i>Email</label>
                <input v-model="form.email" type="email" class="form-control" :class="errors.email ? 'is-invalid' : ''" placeholder="Nhập email" />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-telephone me-1"></i>Số điện thoại</label>
                <input v-model="form.soDienThoai" class="form-control" :class="errors.soDienThoai ? 'is-invalid' : ''" placeholder="Nhập SĐT" />
                <div v-if="errors.soDienThoai" class="invalid-feedback">{{ errors.soDienThoai }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small text-muted"><i class="bi bi-toggle-on me-1"></i>Trạng thái</label>
                <div class="form-control-plaintext ps-0">
                  <span class="badge rounded-pill px-3 py-2" :class="profile.trangthai === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-secondary bg-opacity-10 text-secondary'">
                    {{ statusLabel }}
                  </span>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top">
              <button type="submit" class="btn btn-primary rounded-pill px-4" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i>
                Lưu thay đổi
              </button>
            </div>
          </form>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../services/api";
import { useSite } from "../composables/useSite";

const { role, displayName } = useSite();
const profile = ref({});
const form = ref({ hoten: "", email: "", soDienThoai: "" });
const loading = ref(false);
const saving = ref(false);
const fileInput = ref(null);
const pendingAnh = ref(null);
const errors = ref({});

const avatarSrc = computed(() => profile.value.anh || "");

const initials = computed(() => {
  const n = (profile.value.hoten || displayName.value || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
});

const roleLabel = computed(() => {
  const map = { ADMIN: "Quản trị viên", NV: "Nhân viên", GV: "Giáo viên", HV: "Học viên" };
  return map[role.value] || role.value || "—";
});

const roleBadgeClass = computed(() => {
  const map = { ADMIN: "bg-danger bg-opacity-10 text-danger", NV: "bg-info bg-opacity-10 text-info", GV: "bg-success bg-opacity-10 text-success", HV: "bg-primary bg-opacity-10 text-primary" };
  return map[role.value] || "bg-secondary bg-opacity-10 text-secondary";
});

const statusLabel = computed(() => {
  if (profile.value.trangthai === "ACTIVE") return "Đang hoạt động";
  if (profile.value.trangthai === "INACTIVE") return "Không hoạt động";
  return profile.value.trangthai || "—";
});

const loadProfile = async () => {
  loading.value = true;
  try {
    const res = await api.get("/tai-khoan/me");
    profile.value = res.data;
    form.value = { hoten: res.data.hoten || "", email: res.data.email || "", soDienThoai: res.data.soDienThoai || "" };
    await loadPendingAnh();
  } catch (e) { console.error(e); window.$toast?.add("Không tải được hồ sơ", "error"); }
  finally { loading.value = false; }
};

const loadPendingAnh = async () => {
  try { pendingAnh.value = (await api.get("/anh-cho-duyet/cua-toi")).data || null; }
  catch (e) { pendingAnh.value = null; }
};

const triggerUpload = () => fileInput.value?.click();

const onFileChange = async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/anh-cho-duyet", fd, { headers: { "Content-Type": "multipart/form-data" } });
    pendingAnh.value = res.data;
    window.$toast?.add("Đã gửi ảnh, chờ quản trị viên duyệt", "success");
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || "Tải ảnh thất bại (dung lượng/chuẩn file không hợp lệ)";
    window.$toast?.add(msg, "error");
  }
  finally { e.target.value = ""; }
};

const validate = () => {
  const e = {};
  if (!form.value.hoten?.trim()) e.hoten = "Họ tên không được để trống";
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = "Email không hợp lệ";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const saveProfile = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const res = await api.put("/tai-khoan/me", { hoten: form.value.hoten, email: form.value.email, soDienThoai: form.value.soDienThoai });
    profile.value = { ...profile.value, ...res.data };
    window.$toast?.add("Lưu thay đổi thành công", "success");
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || "Lưu thất bại";
    window.$toast?.add(msg, "error");
  }
  finally { saving.value = false; }
};

onMounted(loadProfile);
</script>

<style scoped>
.skeleton-box { background: #ddd; border-radius: 8px; height: 20px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
