<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-diagram-3 fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng phân công</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-person-workspace fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ gvCount }}</h3><small class="opacity-75">GV đã PC</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-truck fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ xeCount }}</h3><small class="opacity-75">Xe đã PC</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý phân công"
      subtitle="Phân công giáo viên và xe tập lái cho học viên"
      search-placeholder="Tìm kiếm phân công..."
      endpoint="/phan-cong"
      id-key="mapc"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-ngayphancong="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-hangbang="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hangBangBadge(value)">{{ value }}</span>
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0, 50) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-diagram-3 display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có phân công nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm phân công đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="phanCongModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa phân công' : 'Thêm phân công' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Học viên <span class="text-danger">*</span></label>
              <select v-model="form.mahv" class="form-select" :class="errors.mahv ? 'is-invalid' : ''">
                <option value="">-- Chọn học viên --</option>
                <option v-for="hv in hocVienList" :key="hv.mahv" :value="hv.mahv">{{ hv.hoten }} - {{ maskCccd(hv.cccd) }}</option>
              </select>
              <div v-if="errors.mahv" class="invalid-feedback">{{ errors.mahv }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-person-workspace me-1"></i>Giáo viên <span class="text-danger">*</span></label>
              <select v-model="form.magv" class="form-select" :class="errors.magv ? 'is-invalid' : ''">
                <option value="">-- Chọn giáo viên --</option>
                <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
              </select>
              <div v-if="errors.magv" class="invalid-feedback">{{ errors.magv }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-truck me-1"></i>Xe tập lái <span class="text-danger">*</span></label>
              <select v-model="form.maxetl" class="form-select" :class="errors.maxetl ? 'is-invalid' : ''">
                <option value="">-- Chọn xe tập lái --</option>
                <option v-for="xtl in xeTapLaiList" :key="xtl.maxetl" :value="xtl.maxetl">{{ xtl.xe?.bienso || '' }} - {{ xtl.hangbang }}</option>
              </select>
              <div v-if="errors.maxetl" class="invalid-feedback">{{ errors.maxetl }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày phân công <span class="text-danger">*</span></label>
              <input v-model="form.ngayphancong" type="date" class="form-control" :class="errors.ngayphancong ? 'is-invalid' : ''" />
              <div v-if="errors.ngayphancong" class="invalid-feedback">{{ errors.ngayphancong }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Ghi chú</label>
              <textarea v-model="form.ghichu" class="form-control" rows="3" placeholder="Nhập ghi chú" :class="errors.ghichu ? 'is-invalid' : ''"></textarea>
              <div v-if="errors.ghichu" class="invalid-feedback">{{ errors.ghichu }}</div>
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
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "mapc", label: "Mã PC" },
  { key: "hocvien", label: "Học viên" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "bienso", label: "Biển số" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "ngayphancong", label: "Ngày PC" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const hocVienList = ref([]);
const giaoVienList = ref([]);
const xeTapLaiList = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ mapc: null, mahv: "", magv: "", maxetl: "", ngayphancong: "", ghichu: "" });
const errors = ref({});

const gvCount = computed(() => new Set(rows.value.map((r) => r.giaovien)).size);
const xeCount = computed(() => new Set(rows.value.map((r) => r.bienso)).size);

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const hangBangBadge = (h) => {
  const map = { A1: "bg-light text-secondary", A2: "bg-secondary bg-opacity-10 text-secondary", B1: "bg-primary bg-opacity-10 text-primary", B2: "bg-info bg-opacity-10 text-info", C: "bg-success bg-opacity-10 text-success", D: "bg-warning bg-opacity-10 text-warning", E: "bg-danger bg-opacity-10 text-danger" };
  return map[h] || "bg-light text-muted";
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const loadData = async () => {
  try {
    const res = await getAll("/phan-cong");
    rows.value = (res.data || []).map((item) => ({
      mapc: item.mapc, hocvien: item.hocVien?.hoten || "", giaovien: item.giaoVien?.hoten || "",
      bienso: item.xeTapLai?.xe?.bienso || "", hangbang: item.xeTapLai?.hangbang || "",
      ngayphancong: item.ngayphancong, ghichu: item.ghichu,
      mahv: item.hocVien?.mahv || "", magv: item.giaoVien?.magv || "", maxetl: item.xeTapLai?.maxetl || "",
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu phân công", "error"); }
};

const loadHocVien = async () => {
  try { hocVienList.value = (await getAll("/hoc-vien")).data || []; }
  catch (e) { console.log(e); }
};
const loadGiaoVien = async () => {
  try { giaoVienList.value = (await getAll("/giao-vien")).data || []; }
  catch (e) { console.log(e); }
};
const loadXeTapLai = async () => {
  try { xeTapLaiList.value = (await getAll("/xe-tap-lai")).data || []; }
  catch (e) { console.log(e); }
};

const resetForm = () => {
  form.value = { mapc: null, mahv: "", magv: "", maxetl: "", ngayphancong: "", ghichu: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.mahv) e.mahv = "Chưa chọn học viên";
  if (!form.value.magv) e.magv = "Chưa chọn giáo viên";
  if (!form.value.maxetl) e.maxetl = "Chưa chọn xe tập lái";
  if (!form.value.ngayphancong) e.ngayphancong = "Chưa chọn ngày";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("phanCongModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("phanCongModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => {
  isEdit.value = true;
  form.value = { mapc: row.mapc, mahv: row.mahv, magv: row.magv, maxetl: row.maxetl, ngayphancong: row.ngayphancong, ghichu: row.ghichu };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      mapc: form.value.mapc, hocVien: { mahv: Number(form.value.mahv) }, giaoVien: { magv: Number(form.value.magv) },
      xeTapLai: { maxetl: Number(form.value.maxetl) }, ngayphancong: form.value.ngayphancong, ghichu: form.value.ghichu,
    };
    if (isEdit.value) { await updateData("/phan-cong", form.value.mapc, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/phan-cong", data); window.$toast?.add("Thêm phân công thành công", "success"); }
    closeModal();
    await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await Promise.all([loadHocVien(), loadGiaoVien(), loadXeTapLai()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
