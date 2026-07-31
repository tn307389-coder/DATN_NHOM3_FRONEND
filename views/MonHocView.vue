<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-book fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongMon }}</h3><small class="opacity-75">Tổng môn</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-journal fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ lyThuyetCount }}</h3><small class="opacity-75">Lý thuyết</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-steering fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ thucHanhCount }}</h3><small class="opacity-75">Thực hành</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý môn học"
      subtitle="Danh sách môn học lý thuyết và thực hành"
      search-placeholder="Tìm kiếm môn học..."
      endpoint="/mon-hoc"
      id-key="mamh"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-loaimonhoc="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="loaiBadge(value)">{{ value }}</span>
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0, 50) + '...' : value }}
      </template>
      <template #empty-state>
        <i class="bi bi-book display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có môn học nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm môn đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="monHocModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa môn học' : 'Thêm môn học' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Tên môn học <span class="text-danger">*</span></label>
              <input v-model="form.tenmonhoc" class="form-control" placeholder="Nhập tên môn học" :class="errors.tenmonhoc ? 'is-invalid' : ''" />
              <div v-if="errors.tenmonhoc" class="invalid-feedback">{{ errors.tenmonhoc }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Loại môn <span class="text-danger">*</span></label>
              <select v-model="form.loaimonhoc" class="form-select" :class="errors.loaimonhoc ? 'is-invalid' : ''">
                <option value="">-- Chọn loại môn --</option>
                <option v-for="item in loaiMonOptions" :key="item.ma" :value="item.ma">{{ item.ten }}</option>
              </select>
              <div v-if="errors.loaimonhoc" class="invalid-feedback">{{ errors.loaimonhoc }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-clock me-1"></i>Số tiết <span class="text-danger">*</span></label>
              <input v-model="form.sotiet" type="number" class="form-control" placeholder="Nhập số tiết" :class="errors.sotiet ? 'is-invalid' : ''" />
              <div v-if="errors.sotiet" class="invalid-feedback">{{ errors.sotiet }}</div>
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
import api from "../services/api";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "mamh", label: "Mã môn" },
  { key: "tenmonhoc", label: "Tên môn học" },
  { key: "loaimonhoc", label: "Loại môn" },
  { key: "sotiet", label: "Số tiết" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);
const loaiMonOptions = ref([]);

const form = ref({ mamh: null, tenmonhoc: "", loaimonhoc: "", sotiet: "", ghichu: "" });
const errors = ref({});

const tongMon = computed(() => rows.value.length);
const lyThuyetCount = computed(() => rows.value.filter((r) => r.loaimonhoc === 'Lý thuyết').length);
const thucHanhCount = computed(() => rows.value.filter((r) => r.loaimonhoc === 'Thực hành').length);

const loaiBadge = (v) => {
  const map = { "Lý thuyết": "bg-primary bg-opacity-10 text-primary", "Thực hành": "bg-success bg-opacity-10 text-success", "Mô phỏng": "bg-warning bg-opacity-10 text-warning" };
  return map[v] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try { rows.value = (await getAll("/mon-hoc")).data || []; }
  catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu môn học", "error"); }
};

const loadLoaiMon = async () => {
  try { const res = await api.get("/danh-muc/loai-mon"); loaiMonOptions.value = res.data || []; }
  catch (e) { console.log(e); }
};

const resetForm = () => {
  form.value = { mamh: null, tenmonhoc: "", loaimonhoc: "", sotiet: "", ghichu: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tenmonhoc?.trim()) e.tenmonhoc = "Tên môn không được để trống";
  if (!form.value.loaimonhoc) e.loaimonhoc = "Chưa chọn loại môn";
  if (!form.value.sotiet || Number(form.value.sotiet) <= 0) e.sotiet = "Số tiết phải lớn hơn 0";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("monHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("monHocModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { ...form.value, sotiet: Number(form.value.sotiet) };
    if (isEdit.value) { await updateData("/mon-hoc", form.value.mamh, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/mon-hoc", data); window.$toast?.add("Thêm môn học thành công", "success"); }
    closeModal();
    await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await loadLoaiMon();
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
