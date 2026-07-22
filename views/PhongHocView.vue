<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-3 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-building fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng phòng</small></div>
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
      title="Quản lý phòng học"
      subtitle="Danh sách phòng học của trung tâm"
      search-placeholder="Tìm kiếm phòng học..."
      endpoint="/phong-hoc"
      id-key="maphong"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
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
        <p class="text-muted mt-2 mb-0">Chưa có phòng học nào</p>
        <button v-if="!isHV" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm phòng đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="phongHocModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa phòng học' : 'Thêm phòng học' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-door-open me-1"></i>Tên phòng <span class="text-danger">*</span></label>
              <input v-model="form.tenphong" class="form-control" placeholder="Ví dụ: Phòng 101" :class="errors.tenphong ? 'is-invalid' : ''" />
              <div v-if="errors.tenphong" class="invalid-feedback">{{ errors.tenphong }}</div>
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold small"><i class="bi bi-people me-1"></i>Sức chứa <span class="text-danger">*</span></label>
              <input v-model="form.succhua" type="number" class="form-control" placeholder="Nhập sức chứa" :class="errors.succhua ? 'is-invalid' : ''" />
              <div v-if="errors.succhua" class="invalid-feedback">{{ errors.succhua }}</div>
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
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import { useMyScope } from "../composables/useMyScope";

const { isHV, myMalop, loadMyScope } = useMyScope();

const columns = [
  { key: "maphong", label: "Mã phòng" },
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ maphong: null, tenphong: "", succhua: "", trangthai: "" });
const errors = ref({});

const filterCount = (s) => rows.value.filter((r) => r.trangthai === s).length;

const trangThaiBadge = (t) => {
  const map = { "Đang sử dụng": "bg-info bg-opacity-10 text-info", "Trống": "bg-success bg-opacity-10 text-success", "Bảo trì": "bg-warning bg-opacity-10 text-warning" };
  return map[t] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try {
    const res = await getAll("/phong-hoc");
    let list = res.data;
    if (isHV.value && myMalop.value.length) {
      const lopSet = myMalop.value.map(String);
      const lich = (await getAll("/lich-hoc")).data || [];
      const myPhong = new Set(
        lich.filter((l) => l.lopHoc && lopSet.includes(String(l.lopHoc.malop))).map((l) => l.phongHoc?.maphong).filter(Boolean).map(String)
      );
      list = list.filter((p) => myPhong.has(String(p.maphong)));
    }
    rows.value = list;
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu phòng học", "error"); }
};

const resetForm = () => {
  form.value = { maphong: null, tenphong: "", succhua: "", trangthai: "" };
  errors.value = {};
};

const validate = () => {
  const e = {};
  if (!form.value.tenphong?.trim()) e.tenphong = "Tên phòng không được để trống";
  if (!form.value.succhua || Number(form.value.succhua) <= 0) e.succhua = "Sức chứa phải lớn hơn 0";
  if (!form.value.trangthai) e.trangthai = "Chưa chọn trạng thái";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("phongHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("phongHocModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = { ...form.value, succhua: form.value.succhua ? Number(form.value.succhua) : null };
    if (isEdit.value) { await updateData("/phong-hoc", form.value.maphong, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/phong-hoc", data); window.$toast?.add("Thêm phòng thành công", "success"); }
    closeModal();
    await loadData();
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
