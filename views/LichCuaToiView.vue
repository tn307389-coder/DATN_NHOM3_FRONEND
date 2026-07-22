<template>
  <div class="container-fluid">
    <div class="row g-4">
      <!-- Sidebar -->
      <div class="col-md-3">
        <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="p-4 text-white text-center" style="background:linear-gradient(135deg,#0d6efd,#2563eb)">
            <div class="mx-auto mb-2 rounded-circle border border-3 border-white shadow-sm overflow-hidden" style="width:80px;height:80px">
              <img v-if="profile.anh" :src="avatarSrc" alt="Avatar" class="w-100 h-100" style="object-fit:cover" />
              <span v-else class="d-flex align-items-center justify-content-center h-100 text-white fw-bold" style="font-size:28px">{{ initials }}</span>
            </div>
            <h5 class="fw-bold mb-1">{{ profile.hoten || 'Người dùng' }}</h5>
            <span class="badge rounded-pill px-3 py-1" :class="isGv ? 'bg-success bg-opacity-25 text-white' : 'bg-primary bg-opacity-25 text-white'">
              {{ isGv ? 'Giáo viên' : 'Học viên' }}
            </span>
          </div>
          <div class="p-3 border-bottom">
            <div class="small text-muted mb-1"><i class="bi bi-envelope me-1"></i>{{ profile.email || '—' }}</div>
            <div class="small text-muted"><i class="bi bi-telephone me-1"></i>{{ profile.sodienthoai || '—' }}</div>
          </div>
          <div class="p-2 d-flex flex-column gap-1">
            <button class="btn btn-sm text-start rounded-pill px-3 py-2" :class="tab === 'khoa-hoc' ? 'btn-primary' : 'btn-light'" @click="tab = 'khoa-hoc'" v-if="!isGv">
              <i class="bi bi-book me-2"></i> Khóa học
            </button>
            <button class="btn btn-sm text-start rounded-pill px-3 py-2" :class="tab === 'lich-hoc' ? 'btn-primary' : 'btn-light'" @click="tab = 'lich-hoc'">
              <i class="bi bi-calendar-event me-2"></i> {{ isGv ? 'Lịch dạy' : 'Lịch học' }}
            </button>
            <button class="btn btn-sm text-start rounded-pill px-3 py-2" :class="tab === 'lich-thi' ? 'btn-primary' : 'btn-light'" @click="tab = 'lich-thi'" v-if="!isGv">
              <i class="bi bi-clipboard-check me-2"></i> Lịch thi
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="col-md-9">
        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <!-- Tab Khoá học (HV) -->
            <div v-if="tab === 'khoa-hoc' && !isGv">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-book text-primary fs-5"></i>
                <h5 class="fw-bold mb-0">Khóa học đã đăng ký</h5>
                <span v-if="khoaHocs.length" class="badge bg-primary bg-opacity-10 text-primary rounded-pill ms-2">{{ khoaHocs.length }} khóa</span>
              </div>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="khoaHocs.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-book display-4 d-block mb-2"></i>
                <p class="mb-0">Bạn chưa đăng ký khóa học nào.</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead style="background:linear-gradient(135deg,#e8f0fe,#d2e3fc)">
                    <tr><th class="fw-semibold">STT</th><th class="fw-semibold">Tên khóa học</th><th class="fw-semibold">Ngày ĐK</th><th class="fw-semibold">Trạng thái</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in khoaHocs" :key="item.madk">
                      <td>{{ i + 1 }}</td>
                      <td class="fw-medium">{{ item.tenKhoaHoc }}</td>
                      <td>{{ formatDate(item.ngaydangky) }}</td>
                      <td><span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(item.trangthai)">{{ item.trangthai }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tab Lịch học / Lịch dạy -->
            <div v-if="tab === 'lich-hoc'">
              <div class="d-flex align-items-center gap-2 mb-3 flex-wrap">
                <i :class="isGv ? 'bi bi-person-workspace text-success' : 'bi bi-calendar-event text-primary'" class="fs-5"></i>
                <h5 class="fw-bold mb-0">{{ isGv ? 'Lịch dạy của tôi' : 'Lịch học của tôi' }}</h5>
                <span v-if="lichHocs.length" class="badge rounded-pill ms-2" :class="isGv ? 'bg-success bg-opacity-10 text-success' : 'bg-primary bg-opacity-10 text-primary'">{{ lichHocs.length }} buổi</span>
              </div>
              <div class="d-flex gap-2 mb-3 flex-wrap">
                <div class="input-group input-group-sm" style="max-width:180px">
                  <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar text-muted"></i></span>
                  <input type="date" v-model="tuNgay" class="form-control border-start-0 ps-0" />
                </div>
                <div class="input-group input-group-sm" style="max-width:180px">
                  <span class="input-group-text bg-white border-end-0"><i class="bi bi-calendar-check text-muted"></i></span>
                  <input type="date" v-model="denNgay" class="form-control border-start-0 ps-0" />
                </div>
                <button class="btn btn-sm btn-primary rounded-pill px-3" @click="loadLichHoc"><i class="bi bi-search me-1"></i>Lọc</button>
                <button class="btn btn-sm btn-outline-secondary rounded-pill px-3" @click="resetFilter"><i class="bi bi-x-circle me-1"></i>Xóa</button>
              </div>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="lichHocs.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-calendar-x display-4 d-block mb-2"></i>
                <p class="mb-0">Không có lịch {{ isGv ? 'dạy' : 'học' }} nào.</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead style="background:linear-gradient(135deg,#e8f0fe,#d2e3fc)">
                    <tr><th class="fw-semibold">STT</th><th class="fw-semibold">Ngày</th><th class="fw-semibold">Ca</th><th class="fw-semibold">Môn</th><th class="fw-semibold">Lớp</th><th class="fw-semibold">Phòng</th><th class="fw-semibold">GC</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in lichHocs" :key="item.malich">
                      <td>{{ i + 1 }}</td>
                      <td><strong>{{ formatDate(item.ngayhoc) }}</strong></td>
                      <td>
                        {{ item.tencahoc }}<br><small class="text-muted">{{ item.giolhlucbatdau?.slice(0,5) }} - {{ item.giolhlucketthuc?.slice(0,5) }}</small>
                      </td>
                      <td>{{ item.tenmonhoc }}</td>
                      <td><span class="badge bg-info bg-opacity-10 text-info rounded-pill px-3 py-2">{{ item.tenlop }}</span></td>
                      <td>{{ item.tenphong }}</td>
                      <td><small class="text-muted">{{ item.ghichu || '—' }}</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Tab Lịch thi (HV) -->
            <div v-if="tab === 'lich-thi' && !isGv">
              <div class="d-flex align-items-center gap-2 mb-3">
                <i class="bi bi-clipboard-check text-warning fs-5"></i>
                <h5 class="fw-bold mb-0">Lịch thi của tôi</h5>
                <span v-if="lichThis.length" class="badge bg-warning bg-opacity-10 text-warning rounded-pill ms-2">{{ lichThis.length }} kỳ</span>
              </div>
              <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
              <div v-else-if="lichThis.length === 0" class="text-center text-muted py-4">
                <i class="bi bi-clipboard-x display-4 d-block mb-2"></i>
                <p class="mb-0">Không có lịch thi nào.</p>
              </div>
              <div v-else class="table-responsive">
                <table class="table table-hover align-middle mb-0">
                  <thead style="background:linear-gradient(135deg,#fff3cd,#ffeaa7)">
                    <tr><th class="fw-semibold">STT</th><th class="fw-semibold">Ngày</th><th class="fw-semibold">Ca</th><th class="fw-semibold">Phòng</th><th class="fw-semibold">Địa điểm</th><th class="fw-semibold">GC</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in lichThis" :key="item.malichthi">
                      <td>{{ i + 1 }}</td>
                      <td><strong>{{ formatDate(item.ngaythi) }}</strong></td>
                      <td>
                        {{ item.tencathi }}<br><small class="text-muted">{{ item.giobatdau?.slice(0,5) }} - {{ item.gioketthuc?.slice(0,5) }}</small>
                      </td>
                      <td>{{ item.tenphongthi }}</td>
                      <td>{{ item.diadiem || '—' }}</td>
                      <td><small class="text-muted">{{ item.ghichu || '—' }}</small></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import api from "../services/api";

const tab = ref("lich-hoc");
const profile = ref({});
const khoaHocs = ref([]);
const lichHocs = ref([]);
const lichThis = ref([]);
const loading = ref(false);
const tuNgay = ref("");
const denNgay = ref("");

const isGv = computed(() => {
  try { return JSON.parse(localStorage.getItem("user") || "{}").maVaiTro === "GV"; }
  catch { return false; }
});

const avatarSrc = computed(() => profile.value.anh || "");
const initials = computed(() => {
  const n = (profile.value.hoten || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
});

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const trangThaiBadge = (s) => {
  const map = {
    "Đang học": "bg-success bg-opacity-10 text-success", "DANG_HOC": "bg-success bg-opacity-10 text-success",
    "ĐÃ DUYỆT": "bg-info bg-opacity-10 text-info", "CHỜ DUYỆT": "bg-warning bg-opacity-10 text-warning",
    "Đã hủy": "bg-danger bg-opacity-10 text-danger", "Hoàn thành": "bg-primary bg-opacity-10 text-primary",
    "ĐÃ ĐĂNG KÝ": "bg-info bg-opacity-10 text-info", "ĐANG XỬ LÝ": "bg-warning bg-opacity-10 text-warning",
  };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
};

const loadProfile = async () => {
  try {
    const res = isGv.value ? await api.get("/giao-vien/me") : await api.get("/hoc-vien/me");
    profile.value = res.data;
  } catch (e) { console.error(e); }
};

const loadKhoaHoc = async () => {
  loading.value = true;
  try { khoaHocs.value = (await api.get("/hoc-vien/me/khoa-hoc-dang-ky")).data; }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const loadLichHoc = async () => {
  loading.value = true;
  try {
    const params = {};
    if (tuNgay.value) params.tuNgay = tuNgay.value;
    if (denNgay.value) params.denNgay = denNgay.value;
    const ep = isGv.value ? "/giao-vien/me/lich-day" : "/hoc-vien/me/lich-hoc";
    lichHocs.value = (await api.get(ep, { params })).data;
  } catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const loadLichThi = async () => {
  loading.value = true;
  try { lichThis.value = (await api.get("/hoc-vien/me/lich-thi")).data; }
  catch (e) { console.error(e); }
  finally { loading.value = false; }
};

const resetFilter = () => { tuNgay.value = ""; denNgay.value = ""; loadLichHoc(); };

watch(tab, (val) => {
  if (val === "lich-hoc") loadLichHoc();
  else if (val === "khoa-hoc") loadKhoaHoc();
  else if (val === "lich-thi") loadLichThi();
});

onMounted(async () => {
  await loadProfile();
  if (isGv.value) { tab.value = "lich-hoc"; await loadLichHoc(); }
  else { tab.value = "khoa-hoc"; await loadKhoaHoc(); }
});
</script>
