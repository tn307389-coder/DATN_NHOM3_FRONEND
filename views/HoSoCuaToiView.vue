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

    <!-- HỒ SƠ HỌC VIÊN (chỉ dành cho tài khoản học viên) -->
    <div v-if="role === 'HV'" class="card border-0 shadow-sm rounded-4 overflow-hidden mt-4">
      <div class="p-4 text-white" style="background:linear-gradient(135deg,#198754,#0f7a4d)">
        <div class="d-flex align-items-center gap-3">
          <div class="rounded-3 bg-white bg-opacity-25 p-2"><i class="bi bi-folder2-open fs-3"></i></div>
          <div>
            <h4 class="fw-bold mb-0">Hồ sơ học viên</h4>
            <small class="opacity-75">Hồ sơ đăng ký học của bạn</small>
          </div>
          <div v-if="coHoSo" class="ms-auto">
            <span class="badge rounded-pill px-3 py-2" :class="tinhtrangBadgeClass(hoSo?.tinhtrang)">
              {{ hoSo?.tinhtrang || '—' }}
            </span>
          </div>
        </div>
      </div>

      <div class="card-body p-4">
        <div v-if="!hoSoLoaded" class="text-center py-4 text-muted">Đang tải hồ sơ...</div>

        <div v-else-if="!coHoSo" class="text-center py-4">
          <i class="bi bi-folder display-1 text-muted"></i>
          <p class="text-muted mt-3 mb-1">Chưa có hồ sơ học viên.</p>
          <p class="small text-muted mb-0">
            Hồ sơ sẽ được tạo khi đăng ký khóa học của bạn được duyệt. Khi đó tài khoản học viên sẽ được cấp và gửi qua email.
          </p>
        </div>

        <template v-else>
          <div v-if="daChinhSua" class="alert alert-info d-flex align-items-center gap-2 rounded-pill">
            <i class="bi bi-lock-fill"></i> Hồ sơ đã được chỉnh sửa và khóa lại, không thể chỉnh sửa lần nữa.
          </div>
          <div v-else class="alert alert-warning d-flex align-items-center gap-2 rounded-pill">
            <i class="bi bi-pencil-square"></i> Hồ sơ chỉ được chỉnh sửa <b class="mx-1">một lần duy nhất</b>. Hãy kiểm tra kỹ trước khi lưu.
          </div>

          <div class="row g-3 mb-4">
            <div class="col-md-3">
              <small class="text-muted">Mã hồ sơ</small>
              <div class="fw-semibold">{{ hoSo?.mahs || '—' }}</div>
            </div>
            <div class="col-md-3">
              <small class="text-muted">Ngày đăng ký</small>
              <div class="fw-semibold">{{ formatDate(hoSo?.ngaydangky) }}</div>
            </div>
            <div class="col-md-3">
              <small class="text-muted">Tình trạng duyệt</small>
              <div><span class="badge rounded-pill px-3 py-2" :class="tinhtrangBadgeClass(hoSo?.tinhtrang)">{{ hoSo?.tinhtrang || '—' }}</span></div>
            </div>
            <div class="col-md-3">
              <small class="text-muted">CCCD</small>
              <div class="fw-semibold">{{ hocVien?.cccd || '—' }}</div>
            </div>
            <div v-if="hoSo?.ghichu" class="col-12">
              <small class="text-muted">Ghi chú</small>
              <div>{{ hoSo.ghichu }}</div>
            </div>
          </div>

          <form v-if="!daChinhSua" @submit.prevent="saveHoSo">
            <div class="row g-4">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Họ và tên</label>
                <input v-model="hsForm.hoten" class="form-control" placeholder="Nhập họ tên" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày sinh</label>
                <input v-model="hsForm.ngaysinh" type="date" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-gender-ambiguous me-1"></i>Giới tính</label>
                <select v-model="hsForm.gioitinh" class="form-select">
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-telephone me-1"></i>Số điện thoại</label>
                <input v-model="hsForm.sodienthoai" class="form-control" placeholder="Nhập SĐT" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-envelope me-1"></i>Email</label>
                <input v-model="hsForm.email" type="email" class="form-control" placeholder="Nhập email" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-geo-alt me-1"></i>Địa chỉ</label>
                <input v-model="hsForm.diachi" class="form-control" placeholder="Nhập địa chỉ" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-card-image me-1"></i>Ảnh căn cước</label>
                <input ref="anhCanhCuocInput" type="file" accept="image/*" class="form-control" @change="uploadHoSoFile($event, 'anhCanhCuoc')" />
                <img v-if="fileUrl(hsForm.anhCanhCuoc)" :src="fileUrl(hsForm.anhCanhCuoc)" alt="Ảnh căn cước" class="mt-2 rounded" style="max-height:90px;object-fit:cover" />
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-paperclip me-1"></i>File hồ sơ</label>
                <input ref="fileHoSoInput" type="file" class="form-control" @change="uploadHoSoFile($event, 'fileHoSo')" />
                <a v-if="hsForm.fileHoSo" :href="fileUrl(hsForm.fileHoSo)" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill mt-2">
                  <i class="bi bi-download me-1"></i>Xem file
                </a>
              </div>
            </div>

            <div class="d-flex justify-content-end mt-4 pt-3 border-top">
              <button type="submit" class="btn btn-success rounded-pill px-4" :disabled="savingHoSo">
                <span v-if="savingHoSo" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-check2-circle me-1"></i>
                Lưu hồ sơ (chỉ 1 lần)
              </button>
            </div>
          </form>

          <div v-else class="row g-4">
            <div class="col-md-6"><small class="text-muted">Họ và tên</small><div class="fw-semibold">{{ hocVien?.hoten || '—' }}</div></div>
            <div class="col-md-6"><small class="text-muted">Ngày sinh</small><div class="fw-semibold">{{ formatDate(hocVien?.ngaysinh) }}</div></div>
            <div class="col-md-6"><small class="text-muted">Giới tính</small><div class="fw-semibold">{{ hocVien?.gioitinh || '—' }}</div></div>
            <div class="col-md-6"><small class="text-muted">Số điện thoại</small><div class="fw-semibold">{{ hocVien?.sodienthoai || '—' }}</div></div>
            <div class="col-md-6"><small class="text-muted">Email</small><div class="fw-semibold">{{ hocVien?.email || '—' }}</div></div>
            <div class="col-md-6"><small class="text-muted">Địa chỉ</small><div class="fw-semibold">{{ hocVien?.diachi || '—' }}</div></div>
            <div v-if="hoSo?.anhCanhCuoc" class="col-md-6">
              <small class="text-muted">Ảnh căn cước</small><br />
              <img :src="fileUrl(hoSo.anhCanhCuoc)" alt="Ảnh căn cước" class="rounded mt-1" style="max-height:100px;object-fit:cover" />
            </div>
            <div v-if="hoSo?.fileHoSo" class="col-md-6">
              <small class="text-muted">File hồ sơ</small><br />
              <a :href="fileUrl(hoSo.fileHoSo)" target="_blank" class="btn btn-sm btn-outline-primary rounded-pill mt-1"><i class="bi bi-download me-1"></i>Xem file</a>
            </div>
          </div>
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

const hocVien = ref(null);
const hoSo = ref(null);
const hoSoLoaded = ref(false);
const coHoSo = ref(false);
const savingHoSo = ref(false);
const hsForm = ref({ hoten: "", ngaysinh: "", gioitinh: "", sodienthoai: "", email: "", diachi: "", anhCanhCuoc: "", fileHoSo: "" });
const anhCanhCuocInput = ref(null);
const fileHoSoInput = ref(null);

const daChinhSua = computed(() => !!hoSo.value?.daChinhSua);

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const tinhtrangBadgeClass = (t) => {
  const map = { "Đã duyệt": "bg-success bg-opacity-10 text-success", "Từ chối": "bg-danger bg-opacity-10 text-danger", "Bổ sung hồ sơ": "bg-warning bg-opacity-10 text-warning", "Đang xử lý": "bg-info bg-opacity-10 text-info", "CHỜ DUYỆT": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const fileUrl = (f) => {
  if (!f) return "";
  if (f.startsWith("http")) return f;
  const base = api.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:8081";
  return base + f;
};

const loadHoSoCuaToi = async () => {
  hoSoLoaded.value = false;
  try {
    const res = await api.get("/ho-so-hoc-vien/me");
    hoSo.value = res.data;
    coHoSo.value = true;
  } catch (e) {
    coHoSo.value = false;
    hoSo.value = null;
  } finally {
    hoSoLoaded.value = true;
  }
};

const loadHocVienCuaToi = async () => {
  try {
    const res = await api.get("/hoc-vien/me");
    hocVien.value = res.data;
    hsForm.value = {
      hoten: res.data.hoten || "",
      ngaysinh: res.data.ngaysinh || "",
      gioitinh: res.data.gioitinh || "",
      sodienthoai: res.data.sodienthoai || "",
      email: res.data.email || "",
      diachi: res.data.diachi || "",
      anhCanhCuoc: hoSo.value?.anhCanhCuoc || "",
      fileHoSo: hoSo.value?.fileHoSo || "",
    };
  } catch (e) { console.error(e); }
};

const uploadHoSoFile = async (e, field) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await api.post("/upload/ho-so", fd, { headers: { "Content-Type": "multipart/form-data" } });
    hsForm.value[field] = res.data.url;
    window.$toast?.add("Tải file thành công", "success");
  } catch (err) {
    console.error(err);
    window.$toast?.add("Tải file thất bại", "error");
  } finally { e.target.value = ""; }
};

const saveHoSo = async () => {
  if (!hsForm.value.hoten?.trim()) { window.$toast?.add("Họ tên không được để trống", "warning"); return; }
  savingHoSo.value = true;
  try {
    await api.put("/ho-so-hoc-vien/me", {
      hocVien: {
        hoten: hsForm.value.hoten,
        ngaysinh: hsForm.value.ngaysinh,
        gioitinh: hsForm.value.gioitinh,
        sodienthoai: hsForm.value.sodienthoai,
        email: hsForm.value.email,
        diachi: hsForm.value.diachi,
      },
      anhCanhCuoc: hsForm.value.anhCanhCuoc,
      fileHoSo: hsForm.value.fileHoSo,
    });
    window.$toast?.add("Đã lưu hồ sơ. Hồ sơ sẽ được khóa lại.", "success");
    await loadHoSoCuaToi();
    await loadHocVienCuaToi();
  } catch (err) {
    console.error(err);
    const msg = err.response?.data?.message || "Lưu hồ sơ thất bại";
    window.$toast?.add(msg, "error");
  } finally { savingHoSo.value = false; }
};

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

onMounted(async () => {
  await loadProfile();
  if (role.value === "HV") {
    await loadHoSoCuaToi();
    await loadHocVienCuaToi();
  }
});
</script>

<style scoped>
.skeleton-box { background: #ddd; border-radius: 8px; height: 20px; animation: pulse 1.5s infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
</style>
