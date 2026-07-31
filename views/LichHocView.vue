<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar-week fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongLich }}</h3><small class="opacity-75">Tổng lịch</small></div>
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

    <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
      <div></div>
      <div class="d-flex gap-2">
        <button v-if="!isHV" class="btn btn-outline-primary rounded-pill px-3" @click="openBatchScheduling">
          <i class="bi bi-calendar-plus me-1"></i> Xếp lịch
        </button>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý lịch học"
      subtitle="Danh sách lịch học của lớp, môn, giáo viên và phòng học"
      search-placeholder="Tìm kiếm lịch học..."
      endpoint="/lich-hoc"
      id-key="malich"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #cell-ngayhoc="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-cahoc="{ value, row }">
        {{ value }}<br><small class="text-muted">{{ row.giobatdau?.slice(0,5) }} - {{ row.gioketthuc?.slice(0,5) }}</small>
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0,50) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-calendar-week display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có lịch học nào</p>
        <button v-if="!isHV" class="btn btn-primary mt-3 rounded-pill" @click="openAdd">
          <i class="bi bi-plus-lg me-1"></i> Thêm lịch đầu tiên
        </button>
      </template>
    </SimpleTablePage>

    <!-- Modal thêm/sửa -->
    <div class="modal fade" id="lichHocModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" :class="isEdit ? 'bg-warning-subtle' : 'bg-primary-subtle'">
            <h5 class="modal-title fw-bold">
              <i :class="isEdit ? 'bi bi-pencil-square text-warning' : 'bi bi-plus-circle text-primary'" class="me-2"></i>
              {{ isEdit ? 'Sửa lịch học' : 'Thêm lịch học' }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Lớp học <span class="text-danger">*</span></label>
                <select v-model="form.malop" class="form-select" :class="errors.malop ? 'is-invalid' : ''" @change="autoFillTeacher">
                  <option value="">-- Chọn lớp --</option>
                  <option v-for="lop in lopHocList" :key="lop.malop" :value="lop.malop">{{ lop.tenlop }}</option>
                </select>
                <div v-if="errors.malop" class="invalid-feedback">{{ errors.malop }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Môn học <span class="text-danger">*</span></label>
                <select v-model="form.mamh" class="form-select" :class="errors.mamh ? 'is-invalid' : ''">
                  <option value="">-- Chọn môn --</option>
                  <option v-for="mh in monHocList" :key="mh.mamh" :value="mh.mamh">{{ mh.tenmonhoc }}</option>
                </select>
                <div v-if="errors.mamh" class="invalid-feedback">{{ errors.mamh }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person-workspace me-1"></i>Giáo viên <span class="text-danger">*</span></label>
                <select v-model="form.magv" class="form-select" :class="errors.magv ? 'is-invalid' : ''">
                  <option value="">-- Chọn GV --</option>
                  <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
                </select>
                <div v-if="errors.magv" class="invalid-feedback">{{ errors.magv }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-building me-1"></i>Phòng học <span class="text-danger">*</span></label>
                <select v-model="form.maphong" class="form-select" :class="errors.maphong ? 'is-invalid' : ''">
                  <option value="">-- Chọn phòng --</option>
                  <option v-for="p in phongHocList" :key="p.maphong" :value="p.maphong">{{ p.tenphong }}</option>
                </select>
                <div v-if="errors.maphong" class="invalid-feedback">{{ errors.maphong }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-clock me-1"></i>Ca học <span class="text-danger">*</span></label>
                <select v-model="form.macahoc" class="form-select" :class="errors.macahoc ? 'is-invalid' : ''">
                  <option value="">-- Chọn ca --</option>
                  <option v-for="ca in caHocList" :key="ca.macahoc" :value="ca.macahoc">{{ ca.tencahoc }} - {{ ca.giobatdau?.slice(0,5) }}</option>
                </select>
                <div v-if="errors.macahoc" class="invalid-feedback">{{ errors.macahoc }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày học <span class="text-danger">*</span></label>
                <input v-model="form.ngayhoc" type="date" class="form-control" :class="errors.ngayhoc ? 'is-invalid' : ''" />
                <div v-if="errors.ngayhoc" class="invalid-feedback">{{ errors.ngayhoc }}</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Ghi chú</label>
                <textarea v-model="form.ghichu" class="form-control" rows="2" placeholder="Nhập ghi chú"></textarea>
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

    <!-- Modal xếp lịch hàng loạt -->
    <div class="modal fade" id="batchModal" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0);color:#fff">
            <h5 class="modal-title fw-bold"><i class="bi bi-calendar-plus me-2"></i>Xếp lịch hàng loạt</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Lớp học <span class="text-danger">*</span></label>
                <select v-model="batch.malop" class="form-select" :class="errBatch.malop ? 'is-invalid' : ''" @change="autoFillTeacherBatch">
                  <option value="">-- Chọn lớp --</option>
                  <option v-for="lop in lopHocList" :key="lop.malop" :value="lop.malop">{{ lop.tenlop }}</option>
                </select>
                <div v-if="errBatch.malop" class="invalid-feedback">{{ errBatch.malop }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-book me-1"></i>Môn học <span class="text-danger">*</span></label>
                <select v-model="batch.mamh" class="form-select" :class="errBatch.mamh ? 'is-invalid' : ''">
                  <option value="">-- Chọn môn --</option>
                  <option v-for="mh in monHocList" :key="mh.mamh" :value="mh.mamh">{{ mh.tenmonhoc }}</option>
                </select>
                <div v-if="errBatch.mamh" class="invalid-feedback">{{ errBatch.mamh }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-person-workspace me-1"></i>Giáo viên <span class="text-danger">*</span></label>
                <select v-model="batch.magv" class="form-select" :class="errBatch.magv ? 'is-invalid' : ''">
                  <option value="">-- Chọn GV --</option>
                  <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
                </select>
                <div v-if="errBatch.magv" class="invalid-feedback">{{ errBatch.magv }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-building me-1"></i>Phòng học <span class="text-danger">*</span></label>
                <select v-model="batch.maphong" class="form-select" :class="errBatch.maphong ? 'is-invalid' : ''">
                  <option value="">-- Chọn phòng --</option>
                  <option v-for="p in phongHocList" :key="p.maphong" :value="p.maphong">{{ p.tenphong }}</option>
                </select>
                <div v-if="errBatch.maphong" class="invalid-feedback">{{ errBatch.maphong }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-clock me-1"></i>Ca học <span class="text-danger">*</span></label>
                <select v-model="batch.macahoc" class="form-select" :class="errBatch.macahoc ? 'is-invalid' : ''">
                  <option value="">-- Chọn ca --</option>
                  <option v-for="ca in caHocList" :key="ca.macahoc" :value="ca.macahoc">{{ ca.tencahoc }} - {{ ca.giobatdau?.slice(0,5) }}</option>
                </select>
                <div v-if="errBatch.macahoc" class="invalid-feedback">{{ errBatch.macahoc }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày BĐ <span class="text-danger">*</span></label>
                <input v-model="batch.ngayBatDau" type="date" class="form-control" :class="errBatch.ngayBatDau ? 'is-invalid' : ''" />
                <div v-if="errBatch.ngayBatDau" class="invalid-feedback">{{ errBatch.ngayBatDau }}</div>
              </div>
              <div class="col-md-3">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar-check me-1"></i>Ngày KT <span class="text-danger">*</span></label>
                <input v-model="batch.ngayKetThuc" type="date" class="form-control" :class="errBatch.ngayKetThuc ? 'is-invalid' : ''" />
                <div v-if="errBatch.ngayKetThuc" class="invalid-feedback">{{ errBatch.ngayKetThuc }}</div>
              </div>
              <div class="col-md-6">
                <label class="form-label fw-semibold small"><i class="bi bi-calendar2-week me-1"></i>Thứ trong tuần <span class="text-danger">*</span></label>
                <div class="d-flex flex-wrap gap-1">
                  <button v-for="d in DAYS" :key="d.value" type="button" class="btn btn-sm rounded-pill px-3" :class="batch.thuTrongTuan.includes(d.value) ? 'btn-primary' : 'btn-outline-secondary'" @click="toggleDay(d.value)">{{ d.label }}</button>
                </div>
                <div v-if="errBatch.thu" class="text-danger small mt-1">{{ errBatch.thu }}</div>
              </div>
              <div class="col-12">
                <label class="form-label fw-semibold small"><i class="bi bi-chat me-1"></i>Ghi chú</label>
                <input v-model="batch.ghichu" class="form-control" placeholder="Ghi chú chung cho các buổi học" />
              </div>
              <div v-if="soBuoiUocTinh > 0" class="col-12">
                <div class="alert alert-info mb-0 rounded-3 py-2">Sẽ tạo <strong>{{ soBuoiUocTinh }}</strong> buổi học</div>
              </div>
            </div>
          </div>
          <div class="modal-footer border-top-0 pt-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Hủy</button>
            <button class="btn rounded-pill px-4" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0);border:none;color:#fff" @click="saveBatch" :disabled="savingBatch">
              <span v-if="savingBatch" class="spinner-border spinner-border-sm me-1"></span>
              <i v-else class="bi bi-calendar-check me-1"></i>
              {{ savingBatch ? "Đang xếp..." : "Xếp lịch" }}
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
import api from "../services/api";

const { isHV, myMalop, loadMyScope } = useMyScope();

const DAYS = [
  { label: "T2", value: 1 }, { label: "T3", value: 2 }, { label: "T4", value: 3 },
  { label: "T5", value: 4 }, { label: "T6", value: 5 }, { label: "T7", value: 6 }, { label: "CN", value: 7 },
];

const columns = [
  { key: "malich", label: "Mã" },
  { key: "lop", label: "Lớp" },
  { key: "monhoc", label: "Môn học" },
  { key: "giaovien", label: "GV" },
  { key: "phonghoc", label: "Phòng" },
  { key: "cahoc", label: "Ca học" },
  { key: "ngayhoc", label: "Ngày" },
  { key: "ghichu", label: "GC" },
];

const rows = ref([]);
const lopHocList = ref([]);
const monHocList = ref([]);
const giaoVienList = ref([]);
const phongHocList = ref([]);
const caHocList = ref([]);
const isEdit = ref(false);
const saving = ref(false);
const savingBatch = ref(false);

const form = ref({ malich: null, malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayhoc: "", ghichu: "" });
const errors = ref({});
const batch = ref({ malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayBatDau: "", ngayKetThuc: "", thuTrongTuan: [], ghichu: "" });
const errBatch = ref({});

const todayStr = new Date().toISOString().slice(0, 10);
const tongLich = computed(() => rows.value.length);
const todayCount = computed(() => rows.value.filter((r) => r.ngayhoc === todayStr).length);
const weekCount = computed(() => {
  const now = new Date();
  const start = new Date(now); start.setDate(now.getDate() - now.getDay() + 1);
  const end = new Date(now); end.setDate(now.getDate() + (7 - now.getDay()));
  const s = start.toISOString().slice(0, 10);
  const e = end.toISOString().slice(0, 10);
  return rows.value.filter((r) => r.ngayhoc >= s && r.ngayhoc <= e).length;
});

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const toggleDay = (val) => {
  const idx = batch.value.thuTrongTuan.indexOf(val);
  if (idx >= 0) batch.value.thuTrongTuan.splice(idx, 1);
  else batch.value.thuTrongTuan.push(val);
};

const soBuoiUocTinh = computed(() => {
  if (!batch.value.ngayBatDau || !batch.value.ngayKetThuc || batch.value.thuTrongTuan.length === 0) return 0;
  let count = 0;
  const start = new Date(batch.value.ngayBatDau);
  const end = new Date(batch.value.ngayKetThuc);
  const cur = new Date(start);
  while (cur <= end) {
    if (batch.value.thuTrongTuan.includes(cur.getDay() === 0 ? 7 : cur.getDay())) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
});

const loadData = async () => {
  try {
    const res = await getAll("/lich-hoc");
    let list = (res.data || []).map((item) => ({
      malich: item.malich, lop: item.lopHoc?.tenlop || "", monhoc: item.monHoc?.tenmonhoc || "",
      giaovien: item.giaoVien?.hoten || "", phonghoc: item.phongHoc?.tenphong || "",
      cahoc: item.caHoc?.tencahoc || "", ngayhoc: item.ngayhoc, ghichu: item.ghichu,
      giobatdau: item.caHoc?.giobatdau || "", gioketthuc: item.caHoc?.gioketthuc || "",
      malop: item.lopHoc?.malop || "", mamh: item.monHoc?.mamh || "",
      magv: item.giaoVien?.magv || "", maphong: item.phongHoc?.maphong || "",
      macahoc: item.caHoc?.macahoc || "",
    }));
    if (isHV.value) { const s = myMalop.value.map(String); list = list.filter((r) => s.includes(String(r.malop))); }
    rows.value = list;
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu lịch học", "error"); }
};

const autoFillTeacher = () => {
  const lop = lopHocList.value.find((l) => l.malop === Number(form.value.malop));
  if (lop?.giaoVien?.magv) form.value.magv = String(lop.giaoVien.magv);
};
const autoFillTeacherBatch = () => {
  const lop = lopHocList.value.find((l) => l.malop === Number(batch.value.malop));
  if (lop?.giaoVien?.magv) batch.value.magv = String(lop.giaoVien.magv);
};

const loadList = async (fn) => { try { const r = await fn; return r.data; } catch { return []; } };
const loadLopHoc = async () => { lopHocList.value = await loadList(getAll("/lop-hoc")); };
const loadMonHoc = async () => { monHocList.value = await loadList(getAll("/mon-hoc")); };
const loadGiaoVien = async () => { giaoVienList.value = await loadList(getAll("/giao-vien")); };
const loadPhongHoc = async () => { phongHocList.value = await loadList(getAll("/phong-hoc")); };
const loadCaHoc = async () => { caHocList.value = await loadList(getAll("/ca-hoc")); };

const resetForm = () => { form.value = { malich: null, malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayhoc: "", ghichu: "" }; errors.value = {}; };

const validateForm = () => {
  const e = {};
  if (!form.value.malop) e.malop = "Chưa chọn lớp";
  if (!form.value.mamh) e.mamh = "Chưa chọn môn";
  if (!form.value.magv) e.magv = "Chưa chọn GV";
  if (!form.value.maphong) e.maphong = "Chưa chọn phòng";
  if (!form.value.macahoc) e.macahoc = "Chưa chọn ca";
  if (!form.value.ngayhoc) e.ngayhoc = "Chưa chọn ngày";
  errors.value = e;
  return Object.keys(e).length === 0;
};

const validateBatch = () => {
  const e = {};
  if (!batch.value.malop) e.malop = "Chưa chọn lớp";
  if (!batch.value.mamh) e.mamh = "Chưa chọn môn";
  if (!batch.value.magv) e.magv = "Chưa chọn GV";
  if (!batch.value.maphong) e.maphong = "Chưa chọn phòng";
  if (!batch.value.macahoc) e.macahoc = "Chưa chọn ca";
  if (!batch.value.ngayBatDau) e.ngayBatDau = "Chưa chọn ngày BĐ";
  if (!batch.value.ngayKetThuc) e.ngayKetThuc = "Chưa chọn ngày KT";
  if (batch.value.ngayBatDau && batch.value.ngayKetThuc && batch.value.ngayBatDau > batch.value.ngayKetThuc)
    e.ngayKetThuc = "Ngày KT phải sau ngày BĐ";
  if (batch.value.thuTrongTuan.length === 0) e.thu = "Chọn ít nhất 1 thứ";
  errBatch.value = e;
  return Object.keys(e).length === 0;
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("lichHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("lichHocModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };
const openEdit = (row) => {
  isEdit.value = true;
  form.value = { malich: row.malich, malop: row.malop, mamh: row.mamh, magv: row.magv, maphong: row.maphong, macahoc: row.macahoc, ngayhoc: row.ngayhoc, ghichu: row.ghichu };
  errors.value = {};
  openModal();
};

const saveData = async () => {
  if (!validateForm()) return;
  saving.value = true;
  try {
    const data = {
      malich: form.value.malich, lopHoc: { malop: Number(form.value.malop) }, monHoc: { mamh: Number(form.value.mamh) },
      giaoVien: { magv: Number(form.value.magv) }, phongHoc: { maphong: Number(form.value.maphong) },
      caHoc: { macahoc: Number(form.value.macahoc) }, ngayhoc: form.value.ngayhoc, ghichu: form.value.ghichu,
    };
    if (isEdit.value) { await updateData("/lich-hoc", form.value.malich, data); window.$toast?.add("Cập nhật thành công", "success"); }
    else { await createData("/lich-hoc", data); window.$toast?.add("Thêm lịch thành công", "success"); }
    closeModal(); await loadData();
  } catch (e) { console.log(e); window.$toast?.add("Lưu thất bại", "error"); }
  finally { saving.value = false; }
};

const openBatchScheduling = () => {
  batch.value = { malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayBatDau: "", ngayKetThuc: "", thuTrongTuan: [], ghichu: "" };
  errBatch.value = {};
  Modal.getOrCreateInstance(document.getElementById("batchModal")).show();
};

const saveBatch = async () => {
  if (!validateBatch()) return;
  savingBatch.value = true;
  try {
    const res = await api.post("/lich-hoc/hang-loat", {
      malop: Number(batch.value.malop), mamh: Number(batch.value.mamh), magv: Number(batch.value.magv),
      maphong: Number(batch.value.maphong), macahoc: Number(batch.value.macahoc),
      ngayBatDau: batch.value.ngayBatDau, ngayKetThuc: batch.value.ngayKetThuc,
      thuTrongTuan: batch.value.thuTrongTuan, ghichu: batch.value.ghichu || "",
    });
    Modal.getOrCreateInstance(document.getElementById("batchModal")).hide();
    await loadData();
    window.$toast?.add("Đã tạo " + res.data.soBuoiTao + " buổi học!", "success");
  } catch (e) { console.error(e); window.$toast?.add("Xếp lịch thất bại", "error"); }
  finally { savingBatch.value = false; }
};

onMounted(async () => {
  await loadMyScope();
  await Promise.all([loadLopHoc(), loadMonHoc(), loadGiaoVien(), loadPhongHoc(), loadCaHoc()]);
  await loadData();
});
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
