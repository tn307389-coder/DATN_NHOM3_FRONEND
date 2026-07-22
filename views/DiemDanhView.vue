<template>
  <div>
    <!-- FILTER CARD -->
    <div class="card border-0 shadow-sm rounded-4 mb-4">
      <div class="card-body p-4">
        <div class="d-flex align-items-center gap-2 mb-3">
          <i class="bi bi-clipboard-check fs-4 text-primary"></i>
          <h4 class="fw-bold mb-0">Điểm danh học viên</h4>
        </div>

        <div class="row g-3 align-items-end">
          <div class="col-md-3">
            <label class="form-label fw-semibold small"><i class="bi bi-tag me-1"></i>Lớp học</label>
            <select class="form-select" v-model="selectedLop" @change="onLopChange">
              <option value="">-- Chọn lớp --</option>
              <option v-for="lh in lopHocList" :key="lh.malop" :value="lh.malop">
                {{ lh.tenlop }} {{ lh.khoaHoc ? '(' + lh.khoaHoc.tenkhoahoc + ')' : '' }}
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold small"><i class="bi bi-clock me-1"></i>Ca học</label>
            <select class="form-select" v-model="selectedLich" :disabled="!lichHocOptions.length">
              <option value="">-- Chọn ca --</option>
              <option v-for="l in lichHocOptions" :key="l.malich" :value="l.malich">
                {{ l.caHoc?.tencahoc || 'Ca ' + l.malich }} — {{ l.ngayhoc || '—' }}
                <template v-if="l.monHoc?.tenmonhoc">({{ l.monHoc.tenmonhoc }})</template>
              </option>
            </select>
          </div>
          <div class="col-md-3">
            <label class="form-label fw-semibold small"><i class="bi bi-calendar me-1"></i>Ngày</label>
            <input type="date" class="form-control" v-model="selectedDate" />
          </div>
          <div class="col-md-3 d-grid">
            <label class="form-label d-none d-md-block">&nbsp;</label>
            <button class="btn btn-primary rounded-pill" @click="loadStudents" :disabled="!selectedLich || !selectedDate || loading">
              <i class="bi bi-search me-1"></i> Tải danh sách
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="text-muted mt-2">Đang tải...</p>
    </div>

    <!-- ATTENDANCE TABLE -->
    <template v-else-if="students.length > 0">
      <!-- STAT CARDS -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
            <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
              <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-people fs-4"></i></div>
              <div><h3 class="mb-0 fw-bold">{{ students.length }}</h3><small class="opacity-75">Tổng học viên</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
            <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
              <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
              <div><h3 class="mb-0 fw-bold">{{ presentCount }}</h3><small class="opacity-75">Có mặt</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
            <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
              <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
              <div><h3 class="mb-0 fw-bold">{{ absentCount }}</h3><small class="opacity-75">Vắng</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
            <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
              <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-bar-chart fs-4"></i></div>
              <div>
                <h3 class="mb-0 fw-bold">{{ attendancePercent }}%</h3>
                <small class="opacity-75">Tỷ lệ</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SEARCH + FILTERS -->
      <div class="card border-0 shadow-sm rounded-4 mb-4">
        <div class="card-body px-4 py-3">
          <div class="d-flex flex-wrap align-items-center gap-3">
            <div class="input-group flex-grow-1" style="max-width:320px">
              <span class="input-group-text bg-white border-end-0"><i class="bi bi-search text-muted"></i></span>
              <input v-model="search" class="form-control border-start-0 ps-0" placeholder="Tìm học viên..." />
            </div>
            <div class="btn-group" role="group">
              <button class="btn btn-sm rounded-pill px-3" :class="filter === 'all' ? 'btn-primary' : 'btn-outline-primary'" @click="filter = 'all'">Tất cả</button>
              <button class="btn btn-sm rounded-pill px-3" :class="filter === 'present' ? 'btn-success' : 'btn-outline-success'" @click="filter = 'present'">Có mặt</button>
              <button class="btn btn-sm rounded-pill px-3" :class="filter === 'absent' ? 'btn-danger' : 'btn-outline-danger'" @click="filter = 'absent'">Vắng</button>
            </div>
          </div>
        </div>
      </div>

      <!-- TABLE -->
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div class="card-body p-0">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead style="background:linear-gradient(135deg,#e8f0fe,#d2e3fc)">
                <tr>
                  <th class="fw-semibold" style="width:50px">#</th>
                  <th class="fw-semibold">Học viên</th>
                  <th class="fw-semibold">SĐT</th>
                  <th class="fw-semibold text-center" style="width:130px">Trạng thái</th>
                  <th v-if="!isHV" class="text-center" style="width:80px">Có mặt</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(sv, idx) in filteredList" :key="sv.mahv" :class="{ 'table-danger': !sv.present, 'table-success': sv.present }">
                  <td>{{ idx + 1 }}</td>
                  <td>
                    <div class="d-flex align-items-center gap-2">
                      <span class="initials-circle" :class="sv.present ? 'bg-success' : 'bg-secondary'">{{ sv.initials }}</span>
                      <div>
                        <div class="fw-semibold">{{ sv.hoten }}</div>
                        <small class="text-muted" v-if="sv.cccd">CCCD: {{ sv.cccd }}</small>
                      </div>
                    </div>
                  </td>
                  <td class="text-muted">{{ sv.sodienthoai || '—' }}</td>
                  <td class="text-center">
                    <span class="badge rounded-pill px-3 py-2" :class="sv.present ? 'bg-success bg-opacity-10 text-success' : 'bg-danger bg-opacity-10 text-danger'">
                      <i :class="sv.present ? 'bi bi-check-circle' : 'bi bi-x-circle'" class="me-1"></i>
                      {{ sv.present ? 'Có mặt' : 'Vắng' }}
                    </span>
                  </td>
                  <td class="text-center">
                    <label class="switch" :class="{ disabled: isHV }">
                      <input type="checkbox" v-model="sv.present" :disabled="isHV" />
                      <span class="slider round"></span>
                    </label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="card-footer bg-transparent px-4 py-3 border-top-0">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div class="text-muted small">
              Hiển thị {{ filteredList.length }} / {{ students.length }} học viên
            </div>
            <div class="d-flex gap-2" v-if="!isHV">
              <button class="btn btn-outline-success btn-sm rounded-pill px-3" @click="selectAll(true)">
                <i class="bi bi-check-all me-1"></i>Tất cả có mặt
              </button>
              <button class="btn btn-outline-danger btn-sm rounded-pill px-3" @click="selectAll(false)">
                <i class="bi bi-x-circle me-1"></i>Tất cả vắng
              </button>
              <button class="btn btn-primary btn-sm rounded-pill px-4" @click="saveAll" :disabled="saving">
                <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-save me-1"></i>
                Lưu điểm danh
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- EMPTY -->
    <div v-else-if="loaded" class="card border-0 shadow-sm rounded-4">
      <div class="card-body text-center text-muted py-5">
        <i class="bi bi-inbox display-4 d-block mb-2"></i>
        <p class="mb-0">Không có học viên nào</p>
        <small>Vui lòng chọn lớp, ca học và ngày để tải danh sách</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { getAll } from "../services/crudService";
import api from "../services/api";

const lopHocList = ref([]);
const selectedLop = ref("");
const selectedLich = ref("");
const selectedDate = ref(new Date().toISOString().slice(0, 10));
const lichHocList = ref([]);
const students = ref([]);
const loading = ref(false);
const saving = ref(false);
const loaded = ref(false);
const search = ref("");
const filter = ref("all");

const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
const isHV = computed(() => currentUser.maVaiTro === "HV");

const lichHocOptions = computed(() => {
  if (!selectedLop.value) return [];
  return lichHocList.value.filter((l) => String(l.lopHoc?.malop) === String(selectedLop.value));
});

const presentCount = computed(() => students.value.filter((s) => s.present).length);
const absentCount = computed(() => students.value.length - presentCount.value);
const attendancePercent = computed(() => {
  if (students.value.length === 0) return 0;
  return Math.round((presentCount.value / students.value.length) * 100);
});

const filteredList = computed(() => {
  let list = students.value;
  if (search.value) {
    const kw = search.value.toLowerCase();
    list = list.filter((s) => s.hoten?.toLowerCase().includes(kw) || s.cccd?.includes(kw) || s.sodienthoai?.includes(kw));
  }
  if (filter.value === "present") list = list.filter((s) => s.present);
  if (filter.value === "absent") list = list.filter((s) => !s.present);
  return list;
});

const loadLopHoc = async () => {
  try {
    const res = await getAll("/lop-hoc");
    lopHocList.value = res.data;
  } catch (e) { console.error(e); }
};

const loadLichHoc = async () => {
  try {
    const res = await getAll("/lich-hoc");
    lichHocList.value = res.data;
  } catch (e) { console.error(e); }
};

const onLopChange = () => {
  selectedLich.value = "";
  selectedDate.value = new Date().toISOString().slice(0, 10);
  students.value = [];
  loaded.value = false;
};

const loadStudents = async () => {
  if (!selectedLich.value || !selectedDate.value) return;
  loading.value = true;
  loaded.value = false;
  try {
    const lichId = Number(selectedLich.value);

    const dkRes = await getAll("/dang-ky-khoa-hoc");
    const lop = lopHocList.value.find((x) => String(x.malop) === String(selectedLop.value));
    const makh = lop?.khoaHoc?.makh;

    const mahvList = makh
      ? dkRes.data.filter((dk) => dk.khoaHoc && dk.khoaHoc.makh === makh).map((dk) => dk.hocVien?.mahv).filter(Boolean)
      : [];

    const hvRes = await getAll("/hoc-vien");
    const hvMap = {};
    hvRes.data.forEach((hv) => (hvMap[hv.mahv] = hv));

    let existing = [];
    try {
      const exRes = await api.get("/diem-danh/by-lich", { params: { malich: lichId, ngay: selectedDate.value } });
      existing = exRes.data || [];
    } catch (_) {}

    const ddMap = {};
    existing.forEach((dd) => { ddMap[dd.hocVien?.mahv] = dd.trangthai; });

    const initials = (name) => {
      if (!name) return "?";
      return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    };

    let list = mahvList.map((mahv) => {
      const hv = hvMap[mahv] || {};
      return {
        mahv,
        hoten: hv.hoten || "HV " + mahv,
        cccd: hv.cccd || "",
        sodienthoai: hv.sodienthoai || "",
        initials: initials(hv.hoten),
        present: ddMap[mahv] ? ddMap[mahv] === "Có mặt" : true,
      };
    });

    students.value = list;
    loaded.value = true;
  } catch (e) {
    console.error(e);
    window.$toast?.add("Không tải được danh sách học viên", "error");
  } finally {
    loading.value = false;
  }
};

const selectAll = (val) => {
  students.value.forEach((s) => (s.present = val));
};

const saveAll = async () => {
  if (!selectedLich.value || !selectedDate.value) return;
  saving.value = true;
  try {
    const danhSach = students.value.map((sv) => ({
      mahv: Number(sv.mahv),
      trangthai: sv.present ? "Có mặt" : "Vắng",
      ghichu: "",
    }));
    await api.post("/diem-danh/batch", {
      malich: Number(selectedLich.value),
      ngaydiemdanh: selectedDate.value,
      danhSach,
    });
    window.$toast?.add("Lưu điểm danh thành công", "success");
  } catch (e) {
    console.error(e);
    window.$toast?.add("Lưu điểm danh thất bại", "error");
  } finally {
    saving.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadLopHoc(), loadLichHoc()]);
});
</script>

<style scoped>
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.switch .slider { position: absolute; cursor: pointer; inset: 0; background: #dc3545; border-radius: 999px; transition: 0.25s; }
.switch .slider::before { content: ""; position: absolute; height: 18px; width: 18px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: 0.25s; }
.switch input:checked + .slider { background: #198754; }
.switch input:checked + .slider::before { transform: translateX(20px); }
.switch.disabled { opacity: 0.6; cursor: not-allowed; }
.switch.disabled .slider { cursor: not-allowed; }

.initials-circle { width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 12px; font-weight: 700; flex-shrink: 0; }
.table > :not(caption) > * > * { padding: 0.65rem 0.5rem; }
.table tbody tr { transition: background 0.15s; }
.stat-card { transition: transform 0.2s, box-shadow 0.2s; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
