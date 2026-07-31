<template>
  <div>
    <!-- STAT CARDS -->
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-tags fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongLop }}</h3><small class="opacity-75">Tổng lớp</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ dangHocCount }}</h3><small class="opacity-75">Đang học</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ ketThucCount }}</h3><small class="opacity-75">Kết thúc</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý lớp học"
      subtitle="Danh sách lớp học của trung tâm"
      search-placeholder="Tìm kiếm lớp học..."
      endpoint="/lop-hoc"
      id-key="malop"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(value)">{{ value }}</span>
      </template>
      <template #cell-ngaybatdau="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-ngayketthuc="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #empty-state>
        <i class="bi bi-tags display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có lớp học nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm lớp đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="lopHocModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa lớp học' : 'Thêm lớp học' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Tên lớp <span class="text-danger">*</span></label>
              <input v-model="form.tenlop" class="form-control" placeholder="Nhập tên lớp" :class="errors.tenlop ? 'is-invalid' : ''" />
              <div v-if="errors.tenlop" class="invalid-feedback">{{ errors.tenlop }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Khóa học <span class="text-danger">*</span></label>
              <select v-model="form.makh" class="form-select" :class="errors.makh ? 'is-invalid' : ''">
                <option value="">-- Chọn khóa học --</option>
                <option v-for="kh in khoaHocList" :key="kh.makh" :value="kh.makh">{{ kh.tenkhoahoc }}</option>
              </select>
              <div v-if="errors.makh" class="invalid-feedback">{{ errors.makh }}</div>
            </div>
             <div class="mb-3">
               <label class="form-label fw-semibold small"><i class="bi bi-person-workspace me-1"></i>Giáo viên <span class="text-danger">*</span></label>
               <select v-model="form.magv" class="form-select" :class="errors.magv ? 'is-invalid' : ''">
                 <option value="">-- Chọn giáo viên --</option>
                 <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
               </select>
               <div v-if="errors.magv" class="invalid-feedback">{{ errors.magv }}</div>
             </div>
             <div class="row g-3">
               <div class="col-md-4">
                 <label class="form-label fw-semibold small"><i class="bi bi-people me-1"></i>Sĩ số <span class="text-danger">*</span></label>
                 <input v-model="form.soluong" type="number" class="form-control" placeholder="Nhập sĩ số" :class="errors.soluong ? 'is-invalid' : ''" />
                 <div v-if="errors.soluong" class="invalid-feedback">{{ errors.soluong }}</div>
               </div>
               <div class="col-md-6">
                 <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày bắt đầu <span class="text-danger">*</span></label>
                 <input v-model="form.ngaybatdau" type="date" class="form-control" :class="errors.ngaybatdau ? 'is-invalid' : ''" />
                 <div v-if="errors.ngaybatdau" class="invalid-feedback">{{ errors.ngaybatdau }}</div>
               </div>
               <div class="col-md-6">
                 <label class="form-label fw-semibold small"><i class="bi bi-calendar-check me-1"></i>Ngày kết thúc <span class="text-danger">*</span></label>
                 <input v-model="form.ngayketthuc" type="date" class="form-control" :class="errors.ngayketthuc ? 'is-invalid' : ''" />
                 <div v-if="errors.ngayketthuc" class="invalid-feedback">{{ errors.ngayketthuc }}</div>
               </div>
             </div>
            <div class="mt-3">
              <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" :class="errors.trangthai ? 'is-invalid' : ''">
                <option value="">-- Chọn trạng thái --</option>
                <option v-for="item in trangThaiLopOptions" :key="item.ma" :value="item.ma">{{ item.ten }}</option>
              </select>
              <div v-if="errors.trangthai" class="invalid-feedback">{{ errors.trangthai }}</div>
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
import { onMounted, ref, computed } from "vue";
import { Modal } from "bootstrap";
import api from "../services/api";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "malop", label: "Mã lớp" },
  { key: "tenlop", label: "Tên lớp" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "soluong", label: "Sĩ số" },
  { key: "ngaybatdau", label: "Ngày BĐ" },
  { key: "ngayketthuc", label: "Ngày KT" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const khoaHocList = ref([]);
const giaoVienList = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ malop: null, tenlop: "", makh: "", magv: "", soluong: "", ngaybatdau: "", ngayketthuc: "", trangthai: "" });
const errors = ref({});
const trangThaiLopOptions = ref([]);

const tongLop = computed(() => rows.value.length);
const dangHocCount = computed(() => rows.value.filter((r) => r.trangthai === 'Đang học').length);
const ketThucCount = computed(() => rows.value.filter((r) => r.trangthai === 'Đã kết thúc').length);

const filterCount = (status) => rows.value.filter((r) => r.trangthai === status).length;

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const trangThaiBadge = (t) => {
  const map = { "Đang học": "bg-success bg-opacity-10 text-success", "Đã kết thúc": "bg-danger bg-opacity-10 text-danger", "Tạm dừng": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try {
    const res = await getAll("/lop-hoc");
    rows.value = (res.data || []).map((item) => ({
      ...item,
      khoahoc: item.khoaHoc?.tenkhoahoc || "",
      giaovien: item.giaoVien?.hoten || "",
      makh: item.khoaHoc?.makh || "",
      magv: item.giaoVien?.magv || "",
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu lớp học", "error"); }
};

const loadKhoaHoc = async () => {
  try { khoaHocList.value = (await getAll("/khoa-hoc")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải khóa học", "error"); }
};

const loadGiaoVien = async () => {
  try { giaoVienList.value = (await getAll("/giao-vien")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải giáo viên", "error"); }
};

const loadTrangThaiLop = async () => {
  try { const res = await api.get("/danh-muc/trang-thai-lop"); trangThaiLopOptions.value = res.data || []; }
  catch (e) { console.log(e); }
};

const resetForm = () => {
  form.value = { malop: null, tenlop: "", makh: "", magv: "", soluong: "", ngaybatdau: "", ngayketthuc: "", trangthai: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tenlop?.trim()) e.tenlop = "Tên lớp không được để trống";
  if (!form.value.makh) e.makh = "Chưa chọn khóa học";
  if (!form.value.magv) e.magv = "Chưa chọn giáo viên";
  if (!form.value.soluong || Number(form.value.soluong) <= 0) e.soluong = "Sĩ số phải lớn hơn 0";
  if (!form.value.ngaybatdau) e.ngaybatdau = "Chưa chọn ngày bắt đầu";
  if (!form.value.ngayketthuc) e.ngayketthuc = "Chưa chọn ngày kết thúc";
  if (!form.value.trangthai) e.trangthai = "Chưa chọn trạng thái";
  if (form.value.ngaybatdau && form.value.ngayketthuc && form.value.ngaybatdau > form.value.ngayketthuc)
    e.ngayketthuc = "Ngày kết thúc phải sau ngày bắt đầu";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("lopHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("lopHocModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => {
  isEdit.value = true;
  form.value = { malop: row.malop, tenlop: row.tenlop, makh: row.makh, magv: row.magv, soluong: row.soluong, ngaybatdau: row.ngaybatdau, ngayketthuc: row.ngayketthuc, trangthai: row.trangthai };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      malop: form.value.malop, tenlop: form.value.tenlop,
      khoaHoc: { makh: Number(form.value.makh) },
      giaoVien: { magv: Number(form.value.magv) },
      soluong: form.value.soluong ? Number(form.value.soluong) : null,
      ngaybatdau: form.value.ngaybatdau, ngayketthuc: form.value.ngayketthuc, trangthai: form.value.trangthai,
    };
    if (isEdit.value) { await updateData("/lop-hoc", form.value.malop, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/lop-hoc", data); window.$toast?.add("Thêm lớp thành công", "success"); }
    closeModal();
    await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await Promise.all([loadKhoaHoc(), loadGiaoVien(), loadTrangThaiLop()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
