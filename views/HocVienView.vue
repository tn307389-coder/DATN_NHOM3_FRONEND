<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-primary text-white h-100 stat-card">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-people-fill fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ tongHocVien }}</h3>
              <small class="opacity-75">Tổng học viên</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-info text-white h-100 stat-card">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-gender-male fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ maleCount }}</h3>
              <small class="opacity-75">Nam</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-pink text-white h-100 stat-card">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-gender-female fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ femaleCount }}</h3>
              <small class="opacity-75">Nữ</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-success text-white h-100 stat-card">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-calendar-check fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ dangKyHomNay }}</h3>
              <small class="opacity-75">Đăng ký hôm nay</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý học viên"
      subtitle="Danh sách học viên của trung tâm"
      search-placeholder="Tìm kiếm học viên..."
      endpoint="/hoc-vien"
      id-key="mahv"
      :columns="columns"
      :rows="displayRows"
      :detail-enabled="true"
      :delete-confirm-message="deleteConfirmMessage"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #filters>
        <div class="d-flex gap-2">
          <select v-model="genderFilter" class="form-select form-select-sm w-auto">
            <option value="">Tất cả giới tính</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>
      </template>

      <template #detail="{ row }">
        <div class="text-center mb-4">
          <div class="stp-avatar mx-auto">{{ initials(row.hoten) }}</div>
          <h5 class="mt-3 mb-1">{{ row.hoten || "—" }}</h5>
          <span
            class="badge rounded-pill px-3 py-2"
            :class="row.gioitinh === 'Nam' ? 'bg-primary bg-opacity-10 text-primary' : 'bg-danger bg-opacity-10 text-danger'"
          >
            <i class="bi" :class="row.gioitinh === 'Nam' ? 'bi-gender-male' : 'bi-gender-female'"></i>
            {{ row.gioitinh || "—" }}
          </span>
        </div>
        <ul class="list-group list-group-flush stp-detail-list">
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-hash me-2"></i>Mã học viên</span>
            <strong>{{ row.mahv }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-calendar me-2"></i>Ngày sinh</span>
            <strong>{{ formatDate(row.ngaysinh) || "—" }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-card-text me-2"></i>CCCD</span>
            <strong>{{ maskCccd(row.cccd) || "—" }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-telephone me-2"></i>Số điện thoại</span>
            <strong>{{ row.sodienthoai || "—" }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-envelope me-2"></i>Email</span>
            <strong class="text-break">{{ row.email || "—" }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-start gap-3">
            <span class="text-muted mt-1"><i class="bi bi-geo-alt me-2"></i>Địa chỉ</span>
            <strong class="text-end text-break">{{ row.diachi || "—" }}</strong>
          </li>
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <span class="text-muted"><i class="bi bi-calendar-plus me-2"></i>Ngày đăng ký</span>
            <strong>{{ formatDate(row.ngaydangky) || "—" }}</strong>
          </li>
        </ul>
      </template>

      <template #cell-gioitinh="{ value }">
        <span v-if="value === 'Nam'" class="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
          <i class="bi bi-gender-male me-1"></i>{{ value }}
        </span>
        <span v-else class="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2">
          <i class="bi bi-gender-female me-1"></i>{{ value }}
        </span>
      </template>
      <template #cell-ngaysinh="{ value }">
        {{ value ? formatDate(value) : '' }}
      </template>
      <template #cell-cccd="{ value }">
        {{ maskCccd(value) }}
      </template>
      <template #empty-state>
        <i class="bi bi-people display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có học viên nào</p>
        <button v-if="canAdd" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm học viên đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="hocVienModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-person-plus text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa học viên' : 'Thêm học viên' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-person me-1"></i> Họ tên <span class="text-danger">*</span>
                </label>
                <input v-model="form.hoten" class="form-control" placeholder="Nhập họ tên" :class="errors.hoten ? 'is-invalid' : ''" />
                <div v-if="errors.hoten" class="invalid-feedback">{{ errors.hoten }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-calendar me-1"></i> Ngày sinh <span class="text-danger">*</span>
                </label>
                <input v-model="form.ngaysinh" type="date" class="form-control" :class="errors.ngaysinh ? 'is-invalid' : ''" />
                <div v-if="errors.ngaysinh" class="invalid-feedback">{{ errors.ngaysinh }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-gender-ambiguous me-1"></i> Giới tính <span class="text-danger">*</span>
                </label>
                <select v-model="form.gioitinh" class="form-select" :class="errors.gioitinh ? 'is-invalid' : ''">
                  <option value="">-- Chọn --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
                <div v-if="errors.gioitinh" class="invalid-feedback">{{ errors.gioitinh }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-card-text me-1"></i> CCCD <span class="text-danger">*</span>
                </label>
                <input v-model="form.cccd" class="form-control" placeholder="Nhập CCCD" :class="errors.cccd ? 'is-invalid' : ''" />
                <div v-if="errors.cccd" class="invalid-feedback">{{ errors.cccd }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-telephone me-1"></i> Số điện thoại <span class="text-danger">*</span>
                </label>
                <input v-model="form.sodienthoai" class="form-control" placeholder="Nhập số điện thoại" :class="errors.sodienthoai ? 'is-invalid' : ''" />
                <div v-if="errors.sodienthoai" class="invalid-feedback">{{ errors.sodienthoai }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-envelope me-1"></i> Email <span class="text-danger">*</span>
                </label>
                <input v-model="form.email" type="email" class="form-control" placeholder="Nhập email" :class="errors.email ? 'is-invalid' : ''" />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-calendar-plus me-1"></i> Ngày đăng ký <span class="text-danger">*</span>
                </label>
                <input v-model="form.ngaydangky" type="date" class="form-control" :class="errors.ngaydangky ? 'is-invalid' : ''" />
                <div v-if="errors.ngaydangky" class="invalid-feedback">{{ errors.ngaydangky }}</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small">
                  <i class="bi bi-geo-alt me-1"></i> Địa chỉ <span class="text-danger">*</span>
                </label>
                <textarea v-model="form.diachi" class="form-control" rows="3" placeholder="Nhập địa chỉ" :class="errors.diachi ? 'is-invalid' : ''"></textarea>
                <div v-if="errors.diachi" class="invalid-feedback">{{ errors.diachi }}</div>
              </div>
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
import { computed, inject, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import api from "../services/api";

const readOnly = inject("readOnly", ref(false));
const canAdd = computed(() => !readOnly.value);

const columns = [
  { key: "mahv", label: "Mã HV", sortable: true },
  { key: "hoten", label: "Họ tên", sortable: true },
  { key: "ngaysinh", label: "Ngày sinh", sortable: true },
  { key: "gioitinh", label: "Giới tính", sortable: true },
  { key: "cccd", label: "CCCD" },
  { key: "sodienthoai", label: "SĐT" },
  { key: "email", label: "Email" },
  { key: "diachi", label: "Địa chỉ" },
];

const rows = ref([]);
const genderFilter = ref("");
const displayRows = computed(() =>
  genderFilter.value
    ? rows.value.filter((r) => r.gioitinh === genderFilter.value)
    : rows.value
);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({
  mahv: null, hoten: "", ngaysinh: "", gioitinh: "", cccd: "",
  sodienthoai: "", email: "", diachi: "", ngaydangky: "",
});
const errors = ref({});
const requiredFields = [
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "cccd", label: "CCCD" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "diachi", label: "Địa chỉ" },
];

const tongHocVien = computed(() => rows.value.length);
const maleCount = computed(() => rows.value.filter((r) => r.gioitinh === "Nam").length);
const femaleCount = computed(() => rows.value.filter((r) => r.gioitinh === "Nữ").length);
const today = new Date().toISOString().slice(0, 10);
const dangKyHomNay = computed(() => rows.value.filter((r) => r.ngaydangky === today).length);

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date + "T00:00:00");
  return d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const initials = (name) => {
  if (!name) return "?";
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const loadData = async () => {
  try {
    const res = await getAll("/hoc-vien");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    window.$toast?.add("Không thể tải dữ liệu học viên", "error");
  }
};

const deleteConfirmMessage = async (row) => {
  try {
    const res = await api.get(`/hoc-vien/${row.mahv}/so-du-lieu-lien-quan`);
    const c = res.data || {};
    const labels = {
      dangKyKhoaHoc: "đăng ký khóa học",
      thanhToan: "thanh toán",
      hoSoHocVien: "hồ sơ",
      diemDanh: "lần điểm danh",
      phanCong: "phân công",
      bangDiemThuongXuyen: "dòng điểm thường xuyên",
      thiSatHach: "lần thi sát hạch",
      ketQuaThi: "kết quả thi",
      traGPLX: "trả GPLX",
    };
    const parts = Object.entries(c)
      .filter(([, v]) => Number(v) > 0)
      .map(([k, v]) => `${v} ${labels[k] || k}`);
    if (parts.length === 0) {
      return `Bạn có chắc muốn xóa học viên "${row.hoten}" không?`;
    }
    return `Học viên "${row.hoten}" đang liên kết với: ${parts.join(", ")}.\nBạn có chắc muốn xóa?`;
  } catch (e) {
    console.log(e);
    return `Bạn có chắc muốn xóa học viên "${row.hoten}" không?`;
  }
};

const resetForm = () => {
  form.value = { mahv: null, hoten: "", ngaysinh: "", gioitinh: "", cccd: "", sodienthoai: "", email: "", diachi: "", ngaydangky: "" };
  errors.value = {};
};

const validate = () => {
  const errs = {};
  requiredFields.forEach((f) => {
    if (!String(form.value[f.key] ?? "").trim()) errs[f.key] = `${f.label} không được để trống`;
  });
  if (form.value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) errs.email = "Email không hợp lệ";
  if (form.value.sodienthoai && !/^[0-9]{10,11}$/.test(form.value.sodienthoai.replace(/\D/g, "")))
    errs.sodienthoai = "Số điện thoại không hợp lệ";
  if (form.value.cccd && !/^[0-9]{9,12}$/.test(form.value.cccd.replace(/\D/g, "")))
    errs.cccd = "CCCD không hợp lệ";
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("hocVienModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("hocVienModal")).hide();

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (row) => {
  isEdit.value = true;
  form.value = { ...row };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { ...form.value };
    if (isEdit.value) {
      await updateData("/hoc-vien", form.value.mahv, data);
      window.$toast?.add("Cập nhật thành công", "success");
    } else {
      await createData("/hoc-vien", data);
      window.$toast?.add("Thêm học viên thành công", "success");
    }
    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    window.$toast?.add("Lưu thất bại", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.bg-gradient-primary { background: linear-gradient(135deg, #0d6efd, #0a58ca); }
.bg-gradient-info { background: linear-gradient(135deg, #0dcaf0, #0aa2c0); }
.bg-gradient-pink { background: linear-gradient(135deg, #d63384, #b82e72); }
.bg-gradient-success { background: linear-gradient(135deg, #198754, #146c43); }

.stat-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
.stat-card:hover { transform: translateY(-4px); box-shadow: 0 0.75rem 1.5rem rgba(13, 110, 253, 0.12) !important; }

.stp-avatar {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #0d6efd, #6610f2);
  box-shadow: 0 0.5rem 1rem rgba(13, 110, 253, 0.25);
}
.stp-detail-list .list-group-item { padding: 0.85rem 0.25rem; }
</style>
