<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-primary text-white h-100">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-person-workspace fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ tongGiaoVien }}</h3>
              <small class="opacity-75">Tổng giáo viên</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-info text-white h-100">
          <div class="card-body d-flex align-items-center gap-3 p-3">
            <div class="rounded-3 bg-white bg-opacity-25 p-3">
              <i class="bi bi-mortarboard fs-3"></i>
            </div>
            <div>
              <h3 class="mb-0 fw-bold">{{ b2Count }}</h3>
              <small class="opacity-75">Dạy B2</small>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-warning text-white h-100">
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
        <div class="card border-0 shadow-sm rounded-4 bg-gradient-pink text-white h-100">
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
    </div>

    <SimpleTablePage
      title="Quản lý giáo viên"
      subtitle="Danh sách giáo viên giảng dạy tại trung tâm"
      search-placeholder="Tìm kiếm giáo viên..."
      endpoint="/giao-vien"
      id-key="magv"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-hangday="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hangDayBadge(value)">{{ value }}</span>
      </template>
      <template #cell-gioitinh="{ value }">
        <span v-if="value === 'Nam'" class="badge rounded-pill bg-primary bg-opacity-10 text-primary px-3 py-2">
          <i class="bi bi-gender-male me-1"></i>{{ value }}
        </span>
        <span v-else class="badge rounded-pill bg-danger bg-opacity-10 text-danger px-3 py-2">
          <i class="bi bi-gender-female me-1"></i>{{ value }}
        </span>
      </template>
      <template #extra-actions="{ row }">
        <button class="btn btn-sm btn-outline-info rounded-circle me-1" title="Xem học viên quản lý" @click="openThongKe(row)">
          <i class="bi bi-people"></i>
        </button>
      </template>
      <template #empty-state>
        <i class="bi bi-person-workspace display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có giáo viên nào</p>
        <button v-if="canAdd" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm giáo viên đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="thongKeModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0 bg-info-subtle">
            <h5 class="modal-title fw-bold">
              <i class="bi bi-bar-chart-line text-info me-2"></i>
              Thống kê học viên — {{ thongKe.hotenGiaoVien || '' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3 mb-4">
              <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 bg-gradient-primary text-white">
                  <div class="card-body text-center p-4">
                    <i class="bi bi-people fs-1 opacity-75"></i>
                    <h2 class="fw-bold mt-2 mb-0">{{ thongKe.tongSoHocVien }}</h2>
                    <small class="opacity-75">Tổng học viên</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 bg-gradient-info text-white">
                  <div class="card-body text-center p-4">
                    <i class="bi bi-book fs-1 opacity-75"></i>
                    <h2 class="fw-bold mt-2 mb-0">{{ thongKe.soHocVienQuaLop }}</h2>
                    <small class="opacity-75">Qua lớp học</small>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card border-0 shadow-sm rounded-4 bg-gradient-success text-white">
                  <div class="card-body text-center p-4">
                    <i class="bi bi-diagram-3 fs-1 opacity-75"></i>
                    <h2 class="fw-bold mt-2 mb-0">{{ thongKe.soHocVienQuaPhanCong }}</h2>
                    <small class="opacity-75">Qua phân công</small>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="thongKe.tongSoHocVien > 0" class="mb-4">
              <label class="small text-muted fw-semibold mb-2">Tỷ lệ phân bố</label>
              <div class="d-flex gap-2 align-items-center mb-1">
                <small class="text-info" style="width:100px">Qua lớp học</small>
                <div class="progress flex-grow-1" style="height:10px;border-radius:5px">
                  <div class="progress-bar bg-info" role="progressbar" :style="{ width: lopPercent + '%' }" :aria-valuenow="lopPercent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">{{ lopPercent }}%</small>
              </div>
              <div class="d-flex gap-2 align-items-center">
                <small class="text-success" style="width:100px">Qua phân công</small>
                <div class="progress flex-grow-1" style="height:10px;border-radius:5px">
                  <div class="progress-bar bg-success" role="progressbar" :style="{ width: pcPercent + '%' }" :aria-valuenow="pcPercent" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
                <small class="text-muted">{{ pcPercent }}%</small>
              </div>
            </div>

            <h6 class="fw-bold mb-3">
              <i class="bi bi-list-ul me-1"></i> Danh sách học viên
            </h6>
            <div class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-info bg-gradient">
                  <tr>
                    <th class="fw-semibold">Mã HV</th>
                    <th class="fw-semibold">Họ tên</th>
                    <th class="fw-semibold">Số điện thoại</th>
                    <th class="fw-semibold">Nguồn</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="hv in thongKe.danhSachHocVien" :key="hv.mahv">
                    <td>{{ hv.mahv }}</td>
                    <td>
                      <span class="fw-medium">{{ hv.hoten }}</span>
                    </td>
                    <td>{{ hv.sodienthoai }}</td>
                    <td>
                      <span class="badge rounded-pill px-3 py-2" :class="hv.nguon === 'Lớp học' ? 'bg-info bg-opacity-10 text-info' : 'bg-success bg-opacity-10 text-success'">
                        {{ hv.nguon }}
                      </span>
                    </td>
                  </tr>
                  <tr v-if="!thongKe.danhSachHocVien || thongKe.danhSachHocVien.length === 0">
                    <td colspan="4" class="text-center text-muted py-4">
                      <i class="bi bi-inbox d-block fs-3 mb-1"></i>
                      Giáo viên chưa quản lý học viên nào
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="giaoVienModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-person-plus text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa giáo viên' : 'Thêm giáo viên' }}
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
                  <i class="bi bi-mortarboard me-1"></i> Hạng dạy <span class="text-danger">*</span>
                </label>
                <select v-model="form.hangday" class="form-select" :class="errors.hangday ? 'is-invalid' : ''">
                  <option value="">-- Chọn hạng dạy --</option>
                  <option value="A1">A1</option>
                  <option value="A2">A2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                  <option value="E">E</option>
                </select>
                <div v-if="errors.hangday" class="invalid-feedback">{{ errors.hangday }}</div>
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
  { key: "magv", label: "Mã GV" },
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "sodienthoai", label: "SĐT" },
  { key: "email", label: "Email" },
  { key: "diachi", label: "Địa chỉ" },
  { key: "hangday", label: "Hạng dạy" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const thongKe = ref({
  magv: null,
  hotenGiaoVien: "",
  soHocVienQuaLop: 0,
  soHocVienQuaPhanCong: 0,
  tongSoHocVien: 0,
  danhSachHocVien: [],
});

const form = ref({
  magv: null, hoten: "", ngaysinh: "", gioitinh: "",
  sodienthoai: "", email: "", diachi: "", hangday: "",
});

const errors = ref({});

const requiredFields = [
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "hangday", label: "Hạng dạy" },
  { key: "diachi", label: "Địa chỉ" },
];

const tongGiaoVien = computed(() => rows.value.length);
const b2Count = computed(() => rows.value.filter((r) => r.hangday === 'B2').length);
const maleCount = computed(() => rows.value.filter((r) => r.gioitinh === "Nam").length);
const femaleCount = computed(() => rows.value.filter((r) => r.gioitinh === "Nữ").length);

const lopPercent = computed(() => {
  const t = thongKe.value.tongSoHocVien;
  return t ? Math.round((thongKe.value.soHocVienQuaLop / t) * 100) : 0;
});
const pcPercent = computed(() => {
  const t = thongKe.value.tongSoHocVien;
  return t ? Math.round((thongKe.value.soHocVienQuaPhanCong / t) * 100) : 0;
});

const hangDayBadge = (hang) => {
  const map = {
    A1: "bg-light text-secondary", A2: "bg-secondary bg-opacity-10 text-secondary",
    B1: "bg-primary bg-opacity-10 text-primary", B2: "bg-info bg-opacity-10 text-info",
    C: "bg-success bg-opacity-10 text-success", D: "bg-warning bg-opacity-10 text-warning",
    E: "bg-danger bg-opacity-10 text-danger",
  };
  return map[hang] || "bg-light text-muted";
};

const loadData = async () => {
  try {
    const res = await getAll("/giao-vien");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    window.$toast?.add("Không thể tải dữ liệu giáo viên", "error");
  }
};

const openThongKe = async (row) => {
  try {
    const res = await api.get(`/giao-vien/${row.magv}/thong-ke-hoc-vien`);
    thongKe.value = res.data;
    Modal.getOrCreateInstance(document.getElementById("thongKeModal")).show();
  } catch (error) {
    console.log(error);
    window.$toast?.add("Không thể tải thống kê học viên", "error");
  }
};

const resetForm = () => {
  form.value = { magv: null, hoten: "", ngaysinh: "", gioitinh: "", sodienthoai: "", email: "", diachi: "", hangday: "" };
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
  errors.value = errs;
  return Object.keys(errs).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("giaoVienModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("giaoVienModal")).hide();

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
      await updateData("/giao-vien", form.value.magv, data);
      window.$toast?.add("Cập nhật thành công", "success");
    } else {
      await createData("/giao-vien", data);
      window.$toast?.add("Thêm giáo viên thành công", "success");
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
.bg-gradient-warning { background: linear-gradient(135deg, #ffc107, #e0a800); }
.bg-gradient-pink { background: linear-gradient(135deg, #d63384, #b82e72); }
.bg-gradient-success { background: linear-gradient(135deg, #198754, #146c43); }
</style>
