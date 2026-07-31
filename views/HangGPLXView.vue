<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-12">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-credit-card-2-front fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongHang }}</h3><small class="opacity-75">Tổng hạng GPLX</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý hạng GPLX"
      subtitle="Danh sách hạng giấy phép lái xe"
      search-placeholder="Tìm kiếm hạng GPLX..."
      endpoint="/hang-gplx"
      id-key="id"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-maHang="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hangBadge(value)">{{ value }}</span>
      </template>
      <template #cell-moTa="{ value }">
        {{ value && value.length > 80 ? value.slice(0,80) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-credit-card-2-front display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có hạng GPLX nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd"><i class="bi bi-plus-lg me-1"></i> Thêm hạng đầu tiên</button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="hangGplxModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa hạng GPLX' : 'Thêm hạng GPLX' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Mã hạng <span class="text-danger">*</span></label>
              <input v-model="form.maHang" class="form-control" placeholder="VD: B2" :class="errors.maHang ? 'is-invalid' : ''" />
              <div v-if="errors.maHang" class="invalid-feedback">{{ errors.maHang }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-card-text me-1"></i>Tên hạng <span class="text-danger">*</span></label>
              <input v-model="form.tenHang" class="form-control" placeholder="VD: Ô tô số sàn" :class="errors.tenHang ? 'is-invalid' : ''" />
              <div v-if="errors.tenHang" class="invalid-feedback">{{ errors.tenHang }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Mô tả</label>
              <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Nhập mô tả"></textarea>
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
  { key: "id", label: "ID" },
  { key: "maHang", label: "Mã hạng" },
  { key: "tenHang", label: "Tên hạng" },
  { key: "moTa", label: "Mô tả" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);
const tongHang = computed(() => rows.value.length);

const form = ref({ id: null, maHang: "", tenHang: "", moTa: "" });
const errors = ref({});

const hangBadge = (h) => {
  const map = { A1: "bg-light text-secondary", A2: "bg-secondary bg-opacity-10 text-secondary", B1: "bg-primary bg-opacity-10 text-primary", B2: "bg-info bg-opacity-10 text-info", C: "bg-success bg-opacity-10 text-success", D: "bg-warning bg-opacity-10 text-warning", E: "bg-danger bg-opacity-10 text-danger", F: "bg-dark bg-opacity-10 text-dark" };
  return map[h] || "bg-light text-muted";
};

const loadData = async () => {
  try { rows.value = (await getAll("/hang-gplx")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const resetForm = () => { form.value = { id: null, maHang: "", tenHang: "", moTa: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.maHang?.trim()) e.maHang = "Mã hạng không được để trống";
  if (!form.value.tenHang?.trim()) e.tenHang = "Tên hạng không được để trống";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("hangGplxModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("hangGplxModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { id: form.value.id, maHang: form.value.maHang, tenHang: form.value.tenHang, moTa: form.value.moTa };
    if (isEdit.value) { await updateData("/hang-gplx", form.value.id, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/hang-gplx", data); window.$toast?.add("Thêm hạng thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(loadData);
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
