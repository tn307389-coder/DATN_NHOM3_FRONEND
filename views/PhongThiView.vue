<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-building fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongPhongThi }}</h3><small class="opacity-75">Tổng phòng</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ hoatDongCount }}</h3><small class="opacity-75">Hoạt động</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-tools fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ baoTriCount }}</h3><small class="opacity-75">Bảo trì</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý phòng thi"
      subtitle="Danh sách phòng thi sát hạch"
      search-placeholder="Tìm kiếm phòng thi..."
      endpoint="/phong-thi"
      id-key="maphongthi"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(value)">{{ value }}</span>
      </template>
      <template #cell-succhua="{ value }">
        {{ value ? value + ' người' : '—' }}
      </template>
      <template #empty-state>
        <i class="bi bi-building display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có phòng thi nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm phòng thi đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="phongThiModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa phòng thi' : 'Thêm phòng thi' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-door-open me-1"></i>Tên phòng <span class="text-danger">*</span></label>
              <input v-model="form.tenphong" class="form-control" placeholder="Nhập tên phòng" :class="errors.tenphong ? 'is-invalid' : ''" />
              <div v-if="errors.tenphong" class="invalid-feedback">{{ errors.tenphong }}</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-people me-1"></i>Sức chứa <span class="text-danger">*</span></label>
                <input v-model="form.succhua" type="number" class="form-control" placeholder="Nhập sức chứa" :class="errors.succhua ? 'is-invalid' : ''" />
                <div v-if="errors.succhua" class="invalid-feedback">{{ errors.succhua }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-geo-alt me-1"></i>Địa điểm <span class="text-danger">*</span></label>
                <input v-model="form.diadiem" class="form-control" placeholder="Nhập địa điểm" :class="errors.diadiem ? 'is-invalid' : ''" />
                <div v-if="errors.diadiem" class="invalid-feedback">{{ errors.diadiem }}</div>
              </div>
            </div>
            <div class="mt-3">
              <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" :class="errors.trangthai ? 'is-invalid' : ''">
                <option value="">-- Chọn --</option>
                <option v-for="item in trangThaiPhongThiOptions" :key="item.ma" :value="item.ma">{{ item.ten }}</option>
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
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import api from "../services/api";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "maphongthi", label: "Mã" },
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "diadiem", label: "Địa điểm" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ maphongthi: null, tenphong: "", succhua: "", diadiem: "", trangthai: "" });
const errors = ref({});
const trangThaiPhongThiOptions = ref([]);

const tongPhongThi = computed(() => rows.value.length);
const hoatDongCount = computed(() => rows.value.filter((r) => r.trangthai === 'Hoạt động').length);
const baoTriCount = computed(() => rows.value.filter((r) => r.trangthai === 'Bảo trì').length);

const trangThaiBadge = (t) => {
  const map = { "Hoạt động": "bg-success bg-opacity-10 text-success", "Bảo trì": "bg-warning bg-opacity-10 text-warning", "Ngừng sử dụng": "bg-danger bg-opacity-10 text-danger" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try { rows.value = (await getAll("/phong-thi")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const loadTrangThaiPhongThi = async () => {
  try { const res = await api.get("/danh-muc/trang-thai-phong-thi"); trangThaiPhongThiOptions.value = res.data || []; }
  catch (e) { console.log(e); }
};

const resetForm = () => { form.value = { maphongthi: null, tenphong: "", succhua: "", diadiem: "", trangthai: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.tenphong?.trim()) e.tenphong = "Tên phòng không được để trống";
  if (!form.value.succhua || Number(form.value.succhua) <= 0) e.succhua = "Sức chứa phải lớn hơn 0";
  if (!form.value.diadiem?.trim()) e.diadiem = "Địa điểm không được để trống";
  if (!form.value.trangthai) e.trangthai = "Chưa chọn trạng thái";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("phongThiModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("phongThiModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { ...form.value, succhua: Number(form.value.succhua) };
    if (isEdit.value) { await updateData("/phong-thi", form.value.maphongthi, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/phong-thi", data); window.$toast?.add("Thêm phòng thi thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await loadTrangThaiPhongThi();
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
