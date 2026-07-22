<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-12">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng ca thi</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý ca thi"
      subtitle="Danh sách ca thi sát hạch"
      search-placeholder="Tìm kiếm ca thi..."
      endpoint="/ca-thi"
      id-key="macathi"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-giobatdau="{ value }">
        <span class="fw-semibold">{{ value ? value.slice(0,5) : '' }}</span>
      </template>
      <template #cell-gioketthuc="{ value }">
        <span class="fw-semibold">{{ value ? value.slice(0,5) : '' }}</span>
      </template>
      <template #empty-state>
        <i class="bi bi-clock display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có ca thi nào</p>
        <button v-if="!isHV" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm ca thi đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="caThiModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa ca thi' : 'Thêm ca thi' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Tên ca thi <span class="text-danger">*</span></label>
              <input v-model="form.tencathi" class="form-control" placeholder="VD: Ca thi sáng" :class="errors.tencathi ? 'is-invalid' : ''" />
              <div v-if="errors.tencathi" class="invalid-feedback">{{ errors.tencathi }}</div>
            </div>
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-sunrise me-1"></i>Giờ bắt đầu <span class="text-danger">*</span></label>
                <input v-model="form.giobatdau" type="time" class="form-control" :class="errors.giobatdau ? 'is-invalid' : ''" />
                <div v-if="errors.giobatdau" class="invalid-feedback">{{ errors.giobatdau }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-sunset me-1"></i>Giờ kết thúc <span class="text-danger">*</span></label>
                <input v-model="form.gioketthuc" type="time" class="form-control" :class="errors.gioketthuc ? 'is-invalid' : ''" />
                <div v-if="errors.gioketthuc" class="invalid-feedback">{{ errors.gioketthuc }}</div>
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
import { useMyScope } from "../composables/useMyScope";

const { isHV, myMakh, loadMyScope } = useMyScope();

const columns = [
  { key: "macathi", label: "Mã" },
  { key: "tencathi", label: "Tên ca" },
  { key: "giobatdau", label: "Bắt đầu" },
  { key: "gioketthuc", label: "Kết thúc" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ macathi: null, tencathi: "", giobatdau: "", gioketthuc: "" });
const errors = ref({});

const loadData = async () => {
  try {
    const res = await getAll("/ca-thi");
    let list = res.data;
    if (isHV.value && myMakh.value.length) {
      const khSet = myMakh.value.map(String);
      const lich = (await getAll("/lich-thi")).data || [];
      const myCa = new Set(lich.filter((l) => l.khoaHoc && khSet.includes(String(l.khoaHoc.makhoahoc))).map((l) => l.caThi?.macathi).filter(Boolean).map(String));
      list = list.filter((c) => myCa.has(String(c.macathi)));
    }
    rows.value = list;
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const resetForm = () => { form.value = { macathi: null, tencathi: "", giobatdau: "", gioketthuc: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.tencathi?.trim()) e.tencathi = "Tên ca không được để trống";
  if (!form.value.giobatdau) e.giobatdau = "Chưa chọn giờ BĐ";
  if (!form.value.gioketthuc) e.gioketthuc = "Chưa chọn giờ KT";
  if (form.value.giobatdau && form.value.gioketthuc && form.value.giobatdau >= form.value.gioketthuc)
    e.gioketthuc = "Giờ KT phải sau giờ BĐ";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("caThiModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("caThiModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    if (isEdit.value) { await updateData("/ca-thi", form.value.macathi, form.value); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/ca-thi", form.value); window.$toast?.add("Thêm ca thi thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await loadMyScope();
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
