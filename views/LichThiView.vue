<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar-event fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongLichThi }}</h3><small class="opacity-75">Tổng lịch thi</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar-check fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ todayCount }}</h3><small class="opacity-75">Hôm nay</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar3 fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ weekCount }}</h3><small class="opacity-75">Tuần này</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý lịch thi"
      subtitle="Danh sách lịch thi sát hạch"
      search-placeholder="Tìm kiếm lịch thi..."
      endpoint="/lich-thi"
      id-key="malichthi"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-ngaythi="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0,50) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-calendar-event display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có lịch thi nào</p>
        <button v-if="!isHV" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm lịch thi đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="lichThiModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa lịch thi' : 'Thêm lịch thi' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Khóa học <span class="text-danger">*</span></label>
                <select v-model="form.makhoahoc" class="form-select" :class="errors.makhoahoc ? 'is-invalid' : ''">
                  <option value="">-- Chọn khóa học --</option>
                  <option v-for="kh in khoaHocList" :key="kh.makhoahoc" :value="kh.makhoahoc">{{ kh.tenkhoahoc }}</option>
                </select>
                <div v-if="errors.makhoahoc" class="invalid-feedback">{{ errors.makhoahoc }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-building me-1"></i>Phòng thi <span class="text-danger">*</span></label>
                <select v-model="form.maphongthi" class="form-select" :class="errors.maphongthi ? 'is-invalid' : ''">
                  <option value="">-- Chọn phòng --</option>
                  <option v-for="pt in phongThiList" :key="pt.maphongthi" :value="pt.maphongthi">{{ pt.tenphong }}</option>
                </select>
                <div v-if="errors.maphongthi" class="invalid-feedback">{{ errors.maphongthi }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-clock me-1"></i>Ca thi <span class="text-danger">*</span></label>
                <select v-model="form.macathi" class="form-select" :class="errors.macathi ? 'is-invalid' : ''">
                  <option value="">-- Chọn ca --</option>
                  <option v-for="ct in caThiList" :key="ct.macathi" :value="ct.macathi">{{ ct.tencathi }}</option>
                </select>
                <div v-if="errors.macathi" class="invalid-feedback">{{ errors.macathi }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày thi <span class="text-danger">*</span></label>
                <input v-model="form.ngaythi" type="date" class="form-control" :class="errors.ngaythi ? 'is-invalid' : ''" />
                <div v-if="errors.ngaythi" class="invalid-feedback">{{ errors.ngaythi }}</div>
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
import { computed, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import { useMyScope } from "../composables/useMyScope";

const { isHV, myMakh, loadMyScope } = useMyScope();

const columns = [
  { key: "malichthi", label: "Mã" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "phongthi", label: "Phòng thi" },
  { key: "cathi", label: "Ca thi" },
  { key: "ngaythi", label: "Ngày thi" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const khoaHocList = ref([]);
const phongThiList = ref([]);
const caThiList = ref([]);
const isEdit = ref(false);
const saving = ref(false);

const form = ref({ malichthi: null, makhoahoc: "", maphongthi: "", macathi: "", ngaythi: "", ghichu: "" });
const errors = ref({});

const todayStr = new Date().toISOString().slice(0, 10);
const tongLichThi = computed(() => rows.value.length);
const todayCount = computed(() => rows.value.filter((r) => r.ngaythi === todayStr).length);
const weekCount = computed(() => {
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - now.getDay() + 1);
  const end = new Date(now); end.setDate(now.getDate() + (7 - now.getDay()));
  return rows.value.filter((r) => r.ngaythi >= start.toISOString().slice(0,10) && r.ngaythi <= end.toISOString().slice(0,10)).length;
});

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const loadData = async () => {
  try {
    const res = await getAll("/lich-thi");
    let list = (res.data || []).map((item) => ({
      malichthi: item.malichthi, khoahoc: item.khoaHoc?.tenkhoahoc || "", phongthi: item.phongThi?.tenphong || "",
      cathi: item.caThi?.tencathi || "", ngaythi: item.ngaythi, ghichu: item.ghichu,
      makhoahoc: item.khoaHoc?.makhoahoc, maphongthi: item.phongThi?.maphongthi, macathi: item.caThi?.macathi,
    }));
    if (isHV.value) { const s = myMakh.value.map(String); list = list.filter((r) => s.includes(String(r.makhoahoc))); }
    rows.value = list;
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const loadKhoaHoc = async () => { try { khoaHocList.value = (await getAll("/khoa-hoc")).data || []; } catch (e) { console.log(e); } };
const loadPhongThi = async () => { try { phongThiList.value = (await getAll("/phong-thi")).data || []; } catch (e) { console.log(e); } };
const loadCaThi = async () => { try { caThiList.value = (await getAll("/ca-thi")).data || []; } catch (e) { console.log(e); } };

const resetForm = () => { form.value = { malichthi: null, makhoahoc: "", maphongthi: "", macathi: "", ngaythi: "", ghichu: "" }; errors.value = {}; };

const validate = () => {
  const e = {};
  if (!form.value.makhoahoc) e.makhoahoc = "Chưa chọn khóa học";
  if (!form.value.maphongthi) e.maphongthi = "Chưa chọn phòng thi";
  if (!form.value.macathi) e.macathi = "Chưa chọn ca thi";
  if (!form.value.ngaythi) e.ngaythi = "Chưa chọn ngày thi";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("lichThiModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("lichThiModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => { isEdit.value = true; form.value = { ...row }; errors.value = {}; openModal(); };

const saveData = async () => {
  if (!validate()) return;
  saving.value = true;
  try {
    const data = {
      malichthi: form.value.malichthi, khoaHoc: { makhoahoc: Number(form.value.makhoahoc) },
      phongThi: { maphongthi: Number(form.value.maphongthi) }, caThi: { macathi: Number(form.value.macathi) },
      ngaythi: form.value.ngaythi, ghichu: form.value.ghichu,
    };
    if (isEdit.value) { await updateData("/lich-thi", form.value.malichthi, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/lich-thi", data); window.$toast?.add("Thêm lịch thi thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

onMounted(async () => {
  await loadMyScope();
  await Promise.all([loadKhoaHoc(), loadPhongThi(), loadCaThi()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
