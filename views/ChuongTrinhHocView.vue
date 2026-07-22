<template>
  <div>
    <SimpleTablePage
      title="Quản lý chương trình học"
      subtitle="Danh sách chương trình đào tạo lái xe"
      search-placeholder="Tìm kiếm chương trình học..."
      endpoint="/chuong-trinh-hoc"
      id-key="macth"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-hangbang="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hangBangBadge(value)">{{ value }}</span>
      </template>
      <template #cell-hocphi="{ value }">
        {{ value ? Number(value).toLocaleString('vi-VN') + '₫' : '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-book display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có chương trình học nào</p>
        <button class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm chương trình đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="chuongTrinhHocModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa chương trình học' : 'Thêm chương trình học' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Tên chương trình <span class="text-danger">*</span></label>
                <input v-model="form.tenchuongtrinh" class="form-control" placeholder="Nhập tên chương trình" :class="errors.tenchuongtrinh ? 'is-invalid' : ''" />
                <div v-if="errors.tenchuongtrinh" class="invalid-feedback">{{ errors.tenchuongtrinh }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-mortarboard me-1"></i>Hạng bằng <span class="text-danger">*</span></label>
                <select v-model="form.hangbang" class="form-select" :class="errors.hangbang ? 'is-invalid' : ''">
                  <option value="">-- Chọn hạng bằng --</option>
                  <option v-for="h in hangBangOptions" :key="h" :value="h">{{ h }}</option>
                </select>
                <div v-if="errors.hangbang" class="invalid-feedback">{{ errors.hangbang }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-cash me-1"></i>Học phí <span class="text-danger">*</span></label>
                <input v-model="form.hocphi" type="number" class="form-control" placeholder="Nhập học phí" :class="errors.hocphi ? 'is-invalid' : ''" />
                <div v-if="errors.hocphi" class="invalid-feedback">{{ errors.hocphi }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small"><i class="bi bi-journal me-1"></i>LT <span class="text-danger">*</span></label>
                <input v-model="form.sobuoilythuyet" type="number" class="form-control" placeholder="Số buổi" :class="errors.sobuoilythuyet ? 'is-invalid' : ''" />
                <div v-if="errors.sobuoilythuyet" class="invalid-feedback">{{ errors.sobuoilythuyet }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small"><i class="bi bi-steering me-1"></i>TH <span class="text-danger">*</span></label>
                <input v-model="form.sobuoithuchanh" type="number" class="form-control" placeholder="Số buổi" :class="errors.sobuoithuchanh ? 'is-invalid' : ''" />
                <div v-if="errors.sobuoithuchanh" class="invalid-feedback">{{ errors.sobuoithuchanh }}</div>
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

const hangBangOptions = ["A1", "A2", "B1", "B2", "C", "D", "E"];

const columns = [
  { key: "macth", label: "Mã CT" },
  { key: "tenchuongtrinh", label: "Tên chương trình" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "hocphi", label: "Học phí" },
  { key: "sobuoilythuyet", label: "Lý thuyết" },
  { key: "sobuoithuchanh", label: "Thực hành" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ macth: null, tenchuongtrinh: "", hangbang: "", hocphi: "", sobuoilythuyet: "", sobuoithuchanh: "" });
const errors = ref({});

const hangBangBadge = (h) => {
  const map = { A1: "bg-light text-secondary", A2: "bg-secondary bg-opacity-10 text-secondary", B1: "bg-primary bg-opacity-10 text-primary", B2: "bg-info bg-opacity-10 text-info", C: "bg-success bg-opacity-10 text-success", D: "bg-warning bg-opacity-10 text-warning", E: "bg-danger bg-opacity-10 text-danger" };
  return map[h] || "bg-light text-muted";
};

const loadData = async () => {
  try {
    const res = await getAll("/chuong-trinh-hoc");
    rows.value = res.data || [];
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const resetForm = () => {
  form.value = { macth: null, tenchuongtrinh: "", hangbang: "", hocphi: "", sobuoilythuyet: "", sobuoithuchanh: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tenchuongtrinh?.trim()) e.tenchuongtrinh = "Tên chương trình không được để trống";
  if (!form.value.hangbang) e.hangbang = "Chưa chọn hạng bằng";
  if (!form.value.hocphi || Number(form.value.hocphi) <= 0) e.hocphi = "Học phí phải lớn hơn 0";
  if (!form.value.sobuoilythuyet || Number(form.value.sobuoilythuyet) <= 0) e.sobuoilythuyet = "Số buổi phải lớn hơn 0";
  if (!form.value.sobuoithuchanh || Number(form.value.sobuoithuchanh) <= 0) e.sobuoithuchanh = "Số buổi phải lớn hơn 0";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("chuongTrinhHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("chuongTrinhHocModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      macth: form.value.macth, tenchuongtrinh: form.value.tenchuongtrinh, hangbang: form.value.hangbang,
      hocphi: form.value.hocphi ? Number(form.value.hocphi) : null,
      sobuoilythuyet: form.value.sobuoilythuyet ? Number(form.value.sobuoilythuyet) : null,
      sobuoithuchanh: form.value.sobuoithuchanh ? Number(form.value.sobuoithuchanh) : null,
    };
    if (isEdit.value) { await updateData("/chuong-trinh-hoc", form.value.macth, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/chuong-trinh-hoc", data); window.$toast?.add("Thêm thành công", "success"); }
    closeModal();
    await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(loadData);
</script>
