<template>
  <div>
    <!-- STAT CARDS -->
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-people fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ taiKhoanList.length }}</h3><small class="opacity-75">Tổng tài khoản</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ activeCount }}</h3><small class="opacity-75">Hoạt động</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-lock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ lockedCount }}</h3><small class="opacity-75">Khóa</small></div>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-4">
        <div class="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
          <div class="d-flex gap-2 flex-wrap">
            <div class="input-group" style="max-width:280px">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input v-model="keyword" class="form-control border-start-0 ps-0" placeholder="Tìm kiếm tài khoản..." />
            </div>
            <select v-model="roleFilter" class="form-select" style="max-width:180px">
              <option value="">Tất cả vai trò</option>
              <option v-for="r in roles" :key="r.maVaiTro" :value="r.maVaiTro">{{ r.tenVaiTro }}</option>
            </select>
          </div>
          <button class="btn btn-primary rounded-pill px-4 shadow-sm" @click="openAdd">
            <i class="bi bi-plus-lg me-1"></i> Thêm tài khoản
          </button>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary bg-gradient">
              <tr>
                <th class="fw-semibold">STT</th>
                <th class="fw-semibold">Tên đăng nhập</th>
                <th class="fw-semibold">Họ tên</th>
                <th class="fw-semibold">Vai trò</th>
                <th class="fw-semibold">Trạng thái</th>
                <th class="fw-semibold text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredTaiKhoan" :key="item.matk">
                <td>{{ index + 1 }}</td>
                <td><span class="fw-medium">{{ item.tendangnhap }}</span></td>
                <td>{{ item.hoten }}</td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" :class="roleBadge(item.vaitro?.maVaiTro)">{{ item.vaitro?.tenVaiTro || '' }}</span>
                </td>
                <td>
                  <span class="badge rounded-pill px-3 py-2" :class="item.trangthai === 'ACTIVE' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                    <i :class="item.trangthai === 'ACTIVE' ? 'bi bi-check-circle' : 'bi bi-lock'" class="me-1"></i>
                    {{ item.trangthai === 'ACTIVE' ? 'Hoạt động' : 'Khóa' }}
                  </span>
                </td>
                <td class="text-center text-nowrap">
                  <button class="btn btn-sm btn-outline-warning rounded-circle me-1" title="Sửa" @click="openEdit(item)">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="btn btn-sm btn-outline-danger rounded-circle" title="Xóa" @click="removeTaiKhoan(item)">
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredTaiKhoan.length === 0">
                <td colspan="6" class="text-center text-muted py-4">
                  <i class="bi bi-inbox d-block fs-3 mb-1"></i>
                  Không có tài khoản nào
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="text-muted mt-3 small">
          <i class="bi bi-list-ul me-1"></i> Hiển thị {{ filteredTaiKhoan.length }} tài khoản
        </div>
      </div>
    </div>

    <!-- MODAL THÊM/SỬA -->
    <div class="modal fade" id="taiKhoanModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-person-plus text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa tài khoản' : 'Thêm tài khoản' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Tên đăng nhập <span class="text-danger">*</span></label>
              <input v-model="form.tendangnhap" class="form-control" placeholder="Nhập tên đăng nhập" :class="errors.tendangnhap ? 'is-invalid' : ''" />
              <div v-if="errors.tendangnhap" class="invalid-feedback">{{ errors.tendangnhap }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-key me-1"></i>Mật khẩu <span v-if="!isEdit" class="text-danger">*</span></label>
              <input v-model="form.matkhau" type="password" class="form-control" :placeholder="isEdit ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'" :class="errors.matkhau ? 'is-invalid' : ''" />
              <div v-if="errors.matkhau" class="invalid-feedback">{{ errors.matkhau }}</div>
              <small v-if="isEdit" class="text-muted">Để trống nếu không muốn thay đổi mật khẩu</small>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-card-text me-1"></i>Họ tên <span class="text-danger">*</span></label>
              <input v-model="form.hoten" class="form-control" placeholder="Nhập họ tên" :class="errors.hoten ? 'is-invalid' : ''" />
              <div v-if="errors.hoten" class="invalid-feedback">{{ errors.hoten }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-envelope me-1"></i>Email</label>
              <input v-model="form.email" type="email" class="form-control" placeholder="Nhập email" :class="errors.email ? 'is-invalid' : ''" />
              <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-shield me-1"></i>Vai trò <span class="text-danger">*</span></label>
              <select v-model="form.maVaiTro" class="form-select" :class="errors.maVaiTro ? 'is-invalid' : ''">
                <option value="">-- Chọn vai trò --</option>
                <option v-for="r in roles" :key="r.maVaiTro" :value="r.maVaiTro">{{ r.tenVaiTro }}</option>
              </select>
              <div v-if="errors.maVaiTro" class="invalid-feedback">{{ errors.maVaiTro }}</div>
            </div>
            <div v-if="isEdit" class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-toggle-on me-1"></i>Trạng thái</label>
              <select v-model="form.trangthai" class="form-select">
                <option :value="true">Hoạt động</option>
                <option :value="false">Khóa</option>
              </select>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy</button>
            <button class="btn rounded-pill px-4" :class="isEdit ? 'btn-warning' : 'btn-primary'" @click="saveData" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else :class="isEdit ? 'bi bi-check-lg' : 'bi bi-plus-lg'" class="me-1"></i>
              {{ isEdit ? 'Cập nhật' : 'Thêm mới' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import api from "../services/api";
import { getAllTaiKhoan, addTaiKhoan, updateTaiKhoan, deleteTaiKhoan } from "../services/taiKhoanService";

const roles = ref([]);
const taiKhoanList = ref([]);
const keyword = ref("");
const roleFilter = ref("");
const isEdit = ref(false);
const saving = ref(false);
const form = ref({ matk: null, tendangnhap: "", matkhau: "", hoten: "", email: "", maVaiTro: "", trangthai: true });
const errors = ref({});
const activeCount = computed(() => taiKhoanList.value.filter((i) => i.trangthai === "ACTIVE").length);
const lockedCount = computed(() => taiKhoanList.value.filter((i) => i.trangthai !== "ACTIVE").length);
const filteredTaiKhoan = computed(() => {
  return taiKhoanList.value.filter((item) => {
    const kw = !keyword.value || (item.tendangnhap?.toLowerCase().includes(keyword.value.toLowerCase()) || item.hoten?.toLowerCase().includes(keyword.value.toLowerCase()));
    const role = !roleFilter.value || (item.vaitro && item.vaitro.maVaiTro === roleFilter.value);
    return kw && role;
  });
});

const roleBadge = (maVaiTro) => {
  const map = { ADMIN: "bg-danger bg-opacity-10 text-danger", NV: "bg-info bg-opacity-10 text-info", GV: "bg-warning bg-opacity-10 text-warning", HV: "bg-success bg-opacity-10 text-success" };
  return map[maVaiTro] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadTaiKhoan = async () => {
  try { const res = await getAllTaiKhoan(); taiKhoanList.value = res.data; }
  catch (e) { console.error(e); window.$toast?.add("Không thể tải dữ liệu tài khoản", "error"); }
};

const loadRoles = async () => {
  try { const res = await api.get("/danh-muc/vai-tro"); roles.value = (res.data || []).map((i) => ({ maVaiTro: i.ma, tenVaiTro: i.ten })); }
  catch (e) { console.error(e); }
};

const resetForm = () => {
  form.value = { matk: null, tendangnhap: "", matkhau: "", hoten: "", email: "", maVaiTro: "", trangthai: true };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tendangnhap?.trim()) e.tendangnhap = "Tên đăng nhập không được để trống";
  if (!isEdit.value && !form.value.matkhau) e.matkhau = "Mật khẩu không được để trống";
  if (!form.value.hoten?.trim()) e.hoten = "Họ tên không được để trống";
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) e.email = "Email không hợp lệ";
  if (!form.value.maVaiTro) e.maVaiTro = "Chưa chọn vai trò";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("taiKhoanModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("taiKhoanModal")).hide();

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (item) => {
  isEdit.value = true;
  form.value = {
    matk: item.matk, tendangnhap: item.tendangnhap, matkhau: "",
    hoten: item.hoten, email: item.email,
    maVaiTro: item.vaitro ? item.vaitro.maVaiTro : "NV",
    trangthai: item.trangthai === "ACTIVE",
  };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    if (isEdit.value) {
      const payload = { ...form.value };
      await updateTaiKhoan(payload.matk, payload);
      window.$toast?.add("Cập nhật tài khoản thành công", "success");
    } else {
      await addTaiKhoan({ ...form.value });
      window.$toast?.add("Thêm tài khoản thành công", "success");
    }
    closeModal();
    await loadTaiKhoan();
  } catch (e) {
    console.error(e);
    window.$toast?.add("Lưu thất bại", "error");
  } finally {
    saving.value = false;
  }
};

const removeTaiKhoan = async (item) => {
  if (!confirm(`Bạn có chắc muốn xóa tài khoản "${item.tendangnhap}"?`)) return;
  try {
    await deleteTaiKhoan(item.matk);
    await loadTaiKhoan();
    window.$toast?.add("Xóa tài khoản thành công", "success");
  } catch (e) {
    console.error(e);
    window.$toast?.add("Xóa tài khoản thất bại", "error");
  }
};

onMounted(async () => {
  await loadRoles();
  await loadTaiKhoan();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
.table-primary.bg-gradient { background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%) !important; }
.table > :not(caption) > * > * { padding: 0.65rem 0.5rem; }
.btn-outline-warning { border-color: #ffc107; color: #ffc107; }
.btn-outline-warning:hover { background: #ffc107; color: #fff; }
.btn-outline-danger { border-color: #dc3545; color: #dc3545; }
.btn-outline-danger:hover { background: #dc3545; color: #fff; }
</style>
