<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-trophy fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng kết quả</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Đạt') }}</h3><small class="opacity-75">Đạt</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('Không đạt') }}</h3><small class="opacity-75">Không đạt</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý kết quả thi"
      subtitle="Kết quả thi sát hạch của học viên"
      search-placeholder="Tìm kiếm kết quả..."
      endpoint="/ket-qua-thi"
      id-key="makq"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-ketqua="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="value === 'Đạt' ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
          {{ value }}
        </span>
      </template>
      <template #cell-diem="{ value }">
        <span class="fw-semibold">{{ value ?? '—' }}</span>
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0,50) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-trophy display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có kết quả thi nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd"><i class="bi bi-plus-lg me-1"></i> Thêm kết quả đầu tiên</button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="ketQuaModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa kết quả' : 'Thêm kết quả' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person me-1"></i>Học viên <span class="text-danger">*</span></label>
                <select v-model="form.mahv" class="form-select" :class="errors.mahv ? 'is-invalid' : ''">
                  <option value="">-- Chọn học viên --</option>
                  <option v-for="hv in hocVienList" :key="hv.mahv" :value="hv.mahv">{{ hv.hoten }}</option>
                </select>
                <div v-if="errors.mahv" class="invalid-feedback">{{ errors.mahv }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar-event me-1"></i>Lịch thi <span class="text-danger">*</span></label>
                <select v-model="form.malichthi" class="form-select" :class="errors.malichthi ? 'is-invalid' : ''">
                  <option value="">-- Chọn lịch thi --</option>
                  <option v-for="lt in lichThiList" :key="lt.malichthi" :value="lt.malichthi">{{ lt.caThi?.tencathi || 'Ca' }} - {{ lt.ngaythi }}</option>
                </select>
                <div v-if="errors.malichthi" class="invalid-feedback">{{ errors.malichthi }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-star me-1"></i>Điểm <span class="text-danger">*</span></label>
                <input v-model="form.diem" type="number" step="0.1" class="form-control" placeholder="Nhập điểm" :class="errors.diem ? 'is-invalid' : ''" />
                <div v-if="errors.diem" class="invalid-feedback">{{ errors.diem }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-flag me-1"></i>Kết quả <span class="text-danger">*</span></label>
                <select v-model="form.ketqua" class="form-select" :class="errors.ketqua ? 'is-invalid' : ''">
                  <option value="">-- Chọn --</option>
                  <option value="Đạt">Đạt</option>
                  <option value="Không đạt">Không đạt</option>
                </select>
                <div v-if="errors.ketqua" class="invalid-feedback">{{ errors.ketqua }}</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Ghi chú</label>
                <textarea v-model="form.ghichu" class="form-control" rows="3" placeholder="Nhập ghi chú"></textarea>
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
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";

const columns = [
  { key: "makq", label: "Mã" },
  { key: "hocvien", label: "Học viên" },
  { key: "lichthi", label: "Lịch thi" },
  { key: "diem", label: "Điểm" },
  { key: "ketqua", label: "Kết quả" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const hocVienList = ref([]);
const lichThiList = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ makq: null, mahv: "", malichthi: "", diem: "", ketqua: "", ghichu: "" });
const errors = ref({});

const filterCount = (s) => rows.value.filter((r) => r.ketqua === s).length;

const loadData = async () => {
  try {
    const res = await getAll("/ket-qua-thi");
    rows.value = (res.data || []).map((item) => ({
      makq: item.makq, hocvien: item.hocVien?.hoten || "", lichthi: item.lichThi?.ngaythi || "",
      diem: item.diem, ketqua: item.ketqua, ghichu: item.ghichu,
      mahv: item.hocVien?.mahv, malichthi: item.lichThi?.malichthi,
    }));
  } catch (e) { console.log(e); }
};

const loadHocVien = async () => { try { hocVienList.value = (await getAll("/hoc-vien")).data || []; } catch (e) { console.log(e); } };
const loadLichThi = async () => { try { lichThiList.value = (await getAll("/lich-thi")).data || []; } catch (e) { console.log(e); } };

const resetForm = () => { form.value = { makq: null, mahv: "", malichthi: "", diem: "", ketqua: "", ghichu: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.mahv) e.mahv = "Chưa chọn học viên";
  if (!form.value.malichthi) e.malichthi = "Chưa chọn lịch thi";
  if (form.value.diem === "" || form.value.diem === null) e.diem = "Chưa nhập điểm";
  if (!form.value.ketqua) e.ketqua = "Chưa chọn kết quả";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("ketQuaModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("ketQuaModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      makq: form.value.makq, hocVien: { mahv: Number(form.value.mahv) }, lichThi: { malichthi: Number(form.value.malichthi) },
      diem: Number(form.value.diem), ketqua: form.value.ketqua, ghichu: form.value.ghichu,
    };
    if (isEdit.value) { await updateData("/ket-qua-thi", form.value.makq, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/ket-qua-thi", data); window.$toast?.add("Thêm kết quả thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await Promise.all([loadHocVien(), loadLichThi()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
