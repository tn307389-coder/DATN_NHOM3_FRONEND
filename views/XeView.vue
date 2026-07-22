<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-truck fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng xe</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Đang sử dụng') }}</h3><small class="opacity-75">Đang sử dụng</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-door-open fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Trống') }}</h3><small class="opacity-75">Trống</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-tools fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Bảo trì') }}</h3><small class="opacity-75">Bảo trì</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý xe"
      subtitle="Danh sách xe của trung tâm"
      search-placeholder="Tìm kiếm xe..."
      endpoint="/xe"
      id-key="maxe"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(value)">{{ value }}</span>
      </template>
      <template #extra-actions="{ row }">
        <button class="btn btn-sm btn-outline-secondary rounded-circle me-1" title="Quản lý bảo trì" @click="goToBaoTri(row)">
          <i class="bi bi-wrench"></i>
        </button>
      </template>
      <template #empty-state>
        <i class="bi bi-truck display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có xe nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm xe đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="xeModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa xe' : 'Thêm xe' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-upc-scan me-1"></i>Biển số <span class="text-danger">*</span></label>
              <input v-model="form.bienso" class="form-control" placeholder="Ví dụ: 51A-12345" :class="errors.bienso ? 'is-invalid' : ''" />
              <div v-if="errors.bienso" class="invalid-feedback">{{ errors.bienso }}</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-car-front me-1"></i>Loại xe <span class="text-danger">*</span></label>
                <input v-model="form.loaixe" class="form-control" placeholder="VD: Xe số sàn" :class="errors.loaixe ? 'is-invalid' : ''" />
                <div v-if="errors.loaixe" class="invalid-feedback">{{ errors.loaixe }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-building me-1"></i>Hãng xe <span class="text-danger">*</span></label>
                <input v-model="form.hangxe" class="form-control" placeholder="VD: Toyota Vios" :class="errors.hangxe ? 'is-invalid' : ''" />
                <div v-if="errors.hangxe" class="invalid-feedback">{{ errors.hangxe }}</div>
              </div>
            </div>
            <div class="mt-3 mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Năm sản xuất <span class="text-danger">*</span></label>
              <input v-model="form.namsanxuat" type="number" class="form-control" placeholder="VD: 2020" :class="errors.namsanxuat ? 'is-invalid' : ''" />
              <div v-if="errors.namsanxuat" class="invalid-feedback">{{ errors.namsanxuat }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" :class="errors.trangthai ? 'is-invalid' : ''">
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Trống">Trống</option>
                <option value="Bảo trì">Bảo trì</option>
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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const router = useRouter();

const columns = [
  { key: "maxe", label: "Mã xe" },
  { key: "bienso", label: "Biển số" },
  { key: "loaixe", label: "Loại xe" },
  { key: "hangxe", label: "Hãng xe" },
  { key: "namsanxuat", label: "Năm SX" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ maxe: null, bienso: "", loaixe: "", hangxe: "", namsanxuat: "", trangthai: "" });
const errors = ref({});

const filterCount = (s) => rows.value.filter((r) => r.trangthai === s).length;

const trangThaiBadge = (t) => {
  const map = { "Đang sử dụng": "bg-info bg-opacity-10 text-info", "Trống": "bg-success bg-opacity-10 text-success", "Bảo trì": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const goToBaoTri = (row) => {
  router.push({ path: "/lich-su-bao-tri-xe", query: { maxe: row.maxe } });
};

const loadData = async () => {
  try {
    const res = await getAll("/xe");
    rows.value = res.data;
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu xe", "error"); }
};

const resetForm = () => {
  form.value = { maxe: null, bienso: "", loaixe: "", hangxe: "", namsanxuat: "", trangthai: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.bienso?.trim()) e.bienso = "Biển số không được để trống";
  if (!form.value.loaixe?.trim()) e.loaixe = "Loại xe không được để trống";
  if (!form.value.hangxe?.trim()) e.hangxe = "Hãng xe không được để trống";
  if (!form.value.namsanxuat || Number(form.value.namsanxuat) < 2000 || Number(form.value.namsanxuat) > new Date().getFullYear() + 1)
    e.namsanxuat = "Năm sản xuất không hợp lệ";
  if (!form.value.trangthai) e.trangthai = "Chưa chọn trạng thái";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("xeModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("xeModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { ...form.value, namsanxuat: form.value.namsanxuat ? Number(form.value.namsanxuat) : null };
    if (isEdit.value) { await updateData("/xe", form.value.maxe, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/xe", data); window.$toast?.add("Thêm xe thành công", "success"); }
    closeModal();
    await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(loadData);
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
