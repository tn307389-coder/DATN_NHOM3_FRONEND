<template>
  <div class="container py-4">
    <!-- HEADER -->
    <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
      <div class="avatar-circle bg-primary text-white shadow-sm">
        <span class="fw-bold">{{ initials }}</span>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <h4 class="mb-0 fw-bold">Xin chào, {{ profile.hoten || 'Học viên' }}</h4>
          <span v-if="activeCourse" class="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2">
            <i class="bi bi-book me-1"></i>{{ activeCourse }}
          </span>
        </div>
        <p class="text-muted mb-0 small">
          <i class="bi bi-calendar3 me-1"></i> {{ todayDate }}
          <i class="bi bi-mortarboard ms-3 me-1"></i> Học viên
        </p>
      </div>
      <button class="btn btn-outline-primary rounded-pill btn-sm px-3" @click="refreshAll" :disabled="loading">
        <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': loading }"></i> Làm mới
      </button>
    </div>

    <!-- SKELETON -->
    <div v-if="loading" class="skeleton-wrapper">
      <div class="row g-3 mb-4">
        <div v-for="i in 4" :key="i" class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 skeleton-card"><div class="card-body p-3">
            <div class="skeleton-box skeleton-circle"></div>
            <div class="skeleton-box skeleton-h3 mt-2"></div>
            <div class="skeleton-box skeleton-small mt-1"></div>
          </div></div>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-md-8"><div class="card border-0 shadow-sm rounded-4"><div class="card-body p-4">
          <div class="skeleton-box skeleton-h5 mb-3"></div>
          <div v-for="i in 2" :key="i" class="skeleton-box skeleton-row mb-2"></div>
        </div></div></div>
        <div class="col-md-4"><div class="card border-0 shadow-sm rounded-4"><div class="card-body p-4">
          <div class="skeleton-box skeleton-h5 mb-3"></div>
          <div v-for="i in 4" :key="i" class="skeleton-box skeleton-btn mb-2"></div>
        </div></div></div>
      </div>
    </div>

    <template v-else>
      <!-- STAT CARDS -->
      <div class="row g-3 mb-4">
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 stat-card h-100" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="icon-wrap rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-book fs-3 text-white"></i></div>
              <div class="text-white"><h3 class="mb-0 fw-bold">{{ courseCount }}</h3><small class="opacity-75">Khóa học</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 stat-card h-100" style="background:linear-gradient(135deg,#0dcaf0,#0aa2c0)">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="icon-wrap rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-calendar-week fs-3 text-white"></i></div>
              <div class="text-white"><h3 class="mb-0 fw-bold">{{ upcomingClasses }}</h3><small class="opacity-75">Buổi sắp tới</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 stat-card h-100" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="icon-wrap rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clipboard-check fs-3 text-white"></i></div>
              <div class="text-white"><h3 class="mb-0 fw-bold">{{ upcomingExams }}</h3><small class="opacity-75">Kỳ thi sắp tới</small></div>
            </div>
          </div>
        </div>
        <div class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 stat-card h-100" style="background:linear-gradient(135deg,#198754,#146c43)">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="icon-wrap rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-trophy fs-3 text-white"></i></div>
              <div class="text-white"><h3 class="mb-0 fw-bold">{{ activeCount }}</h3><small class="opacity-75">Đang học</small></div>
            </div>
          </div>
        </div>
      </div>

      <!-- NEXT EXAM COUNTDOWN -->
      <div v-if="nextExam" class="alert alert-warning border-0 rounded-4 shadow-sm d-flex align-items-center gap-3 mb-4">
        <i class="bi bi-alarm fs-3"></i>
        <div>
          <strong class="d-block">Kỳ thi sắp tới: {{ formatDate(nextExam.ngaythi) }}</strong>
          <small class="text-muted">{{ examCountdown }}</small>
        </div>
      </div>

      <div class="row g-4">
        <!-- SCHEDULE TIMELINE -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-transparent border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-calendar-event me-2 text-primary"></i>Lịch học sắp tới
                <span v-if="filteredSchedules.length > 0" class="badge bg-primary rounded-pill ms-2">{{ filteredSchedules.length }} buổi</span>
              </h5>
              <router-link to="/lich-cua-toi" class="btn btn-sm btn-outline-primary rounded-pill px-3">
                Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            <div class="card-body px-4 pb-4">
              <div v-if="filteredSchedules.length === 0" class="text-center py-5">
                <i class="bi bi-calendar-check display-4 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Chưa có lịch học nào</p>
              </div>
              <div v-else class="timeline">
                <div v-for="(item, idx) in filteredSchedules" :key="item.malich" class="timeline-item d-flex gap-3 pb-3" :class="{ 'has-line': idx < filteredSchedules.length - 1 }">
                  <div class="timeline-date text-center flex-shrink-0" style="width:70px">
                    <div class="fw-bold small text-primary">{{ formatDay(item.ngayhoc) }}</div>
                    <div class="small text-muted">{{ formatWeekday(item.ngayhoc) }}</div>
                  </div>
                  <div class="timeline-dot flex-shrink-0"></div>
                  <div class="timeline-card card border-0 bg-light rounded-3 p-3 flex-grow-1 mb-2">
                    <div class="d-flex align-items-center gap-2 mb-1">
                      <span class="badge bg-primary rounded-pill px-2 py-1">{{ item.giolhlucbatdau?.slice(0,5) }} - {{ item.giolhlucketthuc?.slice(0,5) }}</span>
                      <small class="text-muted">{{ item.tencahoc }}</small>
                    </div>
                    <div class="fw-semibold">{{ item.tenmonhoc }}</div>
                    <div class="d-flex gap-3 small text-muted mt-1">
                      <span><i class="bi bi-geo-alt me-1"></i>{{ item.tenphong || '—' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- QUICK ACCESS -->
        <div class="col-lg-4">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-transparent border-bottom-0 pt-4 px-4">
              <h5 class="fw-bold mb-0"><i class="bi bi-lightning-charge me-2 text-warning"></i>Truy cập nhanh</h5>
            </div>
            <div class="card-body px-4 pb-4">
              <div class="row g-2">
                <div v-for="q in quickLinks" :key="q.path" class="col-6">
                  <router-link :to="q.path" class="quick-link-card text-decoration-none d-block p-3 rounded-3 text-center" :style="{ background: q.bg }">
                    <i :class="q.icon" class="fs-4 d-block mb-1" :style="{ color: q.color }"></i>
                    <span class="small fw-semibold" :style="{ color: q.color }">{{ q.label }}</span>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- REGISTERED COURSES -->
      <div v-if="registeredCourses.length > 0" class="card border-0 shadow-sm rounded-4 mt-4">
        <div class="card-header bg-transparent border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
          <h5 class="fw-bold mb-0"><i class="bi bi-book me-2 text-primary"></i>Khóa học đã đăng ký</h5>
          <router-link to="/lich-cua-toi" class="btn btn-sm btn-outline-primary rounded-pill">Chi tiết <i class="bi bi-arrow-right ms-1"></i></router-link>
        </div>
        <div class="card-body px-4 pb-4">
          <div v-for="item in registeredCourses" :key="item.madk" class="course-card card border-0 bg-light rounded-3 p-3 mb-2">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-semibold">{{ item.tenKhoaHoc }}</div>
                <small class="text-muted">
                  <i class="bi bi-calendar me-1"></i>{{ formatDate(item.ngaydangky) }}
                </small>
              </div>
              <div class="d-flex flex-column align-items-end gap-1">
                <span class="badge rounded-pill px-3 py-2" :class="statusBadge(item.trangthai)">{{ item.trangthai }}</span>
                <button class="btn btn-success btn-sm rounded-pill px-3" @click="payCourse(item.madk)" :disabled="payingMadk === item.madk">
                  <span v-if="payingMadk === item.madk" class="spinner-border spinner-border-sm"></span>
                  <i v-else class="bi bi-qr-code me-1"></i>Thanh toán
                </button>
              </div>
            </div>
            <div v-if="item.trangthai === 'Đang học'" class="mt-2">
              <div class="d-flex justify-content-between small mb-1">
                <span class="text-muted">Tiến độ</span>
                <span class="fw-semibold">80%</span>
              </div>
              <div class="progress" style="height:8px;border-radius:4px">
                <div class="progress-bar bg-primary" role="progressbar" style="width:80%" aria-valuenow="80" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../services/api";
import { useSite } from "../composables/useSite";

const router = useRouter();
const { khoiTaoThanhToan } = useSite();

const loading = ref(true);
const profile = ref({});
const registeredCourses = ref([]);
const lichHocs = ref([]);
const lichThis = ref([]);
const payingMadk = ref(null);

const payCourse = async (madk) => {
  payingMadk.value = madk;
  try {
    const res = await khoiTaoThanhToan(madk);
    if (res.success) {
      router.push(`/thanh-toan/${res.data.matt}`);
    } else {
      alert(res.message || "Khởi tạo thanh toán thất bại");
    }
  } catch (e) {
    alert("Khởi tạo thanh toán thất bại");
  } finally {
    payingMadk.value = null;
  }
};

const todayDate = computed(() => {
  const d = new Date();
  return d.toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
});

const initials = computed(() => {
  const n = (profile.value.hoten || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
});

const activeCourse = computed(() => {
  const active = registeredCourses.value.find((c) => c.trangthai === "Đang học" || c.trangthai === "DANG_HOC");
  return active ? active.tenKhoaHoc : null;
});

const courseCount = computed(() => registeredCourses.value.length);
const activeCount = computed(() => registeredCourses.value.filter((c) =>
  c.trangthai === "Đang học" || c.trangthai === "DANG_HOC" || c.trangthai === "ĐÃ DUYỆT"
).length);

const upcomingClasses = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return lichHocs.value.filter((lh) => lh.ngayhoc >= today).length;
});

const upcomingExams = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return lichThis.value.filter((lt) => lt.ngaythi >= today).length;
});

const filteredSchedules = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return lichHocs.value.filter((lh) => lh.ngayhoc >= today).slice(0, 5);
});

const nextExam = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = lichThis.value.filter((lt) => lt.ngaythi >= today).sort((a, b) => a.ngaythi.localeCompare(b.ngaythi));
  return upcoming.length > 0 ? upcoming[0] : null;
});

const examCountdown = computed(() => {
  if (!nextExam.value) return "";
  const now = new Date();
  const examDate = new Date(nextExam.value.ngaythi + "T00:00:00");
  const diff = Math.ceil((examDate - now) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "Hôm nay là ngày thi!";
  if (diff === 1) return "Còn 1 ngày nữa!";
  return `Còn ${diff} ngày nữa`;
});

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const formatDay = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
};

const formatWeekday = (d) => {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  const map = { Mon: "T2", Tue: "T3", Wed: "T4", Thu: "T5", Fri: "T6", Sat: "T7", Sun: "CN" };
  return map[date.toLocaleDateString("en-US", { weekday: "short" })] || "";
};

const statusBadge = (s) => {
  const map = {
    "Đang học": "bg-success bg-opacity-10 text-success",
    "DANG_HOC": "bg-success bg-opacity-10 text-success",
    "ĐÃ DUYỆT": "bg-info bg-opacity-10 text-info",
    "CHỜ DUYỆT": "bg-warning bg-opacity-10 text-warning",
    "Đã hủy": "bg-danger bg-opacity-10 text-danger",
    "Hoàn thành": "bg-primary bg-opacity-10 text-primary",
    "ĐÃ ĐĂNG KÝ": "bg-info bg-opacity-10 text-info",
    "ĐANG XỬ LÝ": "bg-warning bg-opacity-10 text-warning",
  };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
};

const quickLinks = [
  { path: "/lich-cua-toi", label: "Lịch học", icon: "bi bi-calendar-week", color: "#0d6efd", bg: "#eef2ff" },
  { path: "/lich-cua-toi?tab=lich-thi", label: "Lịch thi", icon: "bi bi-clipboard-check", color: "#ffc107", bg: "#fffbe6" },
  { path: "/bang-diem-thuong-xuyen", label: "Bảng điểm", icon: "bi bi-bar-chart", color: "#0dcaf0", bg: "#eef8fa" },
  { path: "/ket-qua-thi", label: "Kết quả", icon: "bi bi-trophy", color: "#198754", bg: "#e8f5ee" },
  { path: "/ho-so-cua-toi", label: "Hồ sơ", icon: "bi bi-person-gear", color: "#6c757d", bg: "#f3f4f6" },
  { path: "/thi-sat-hach", label: "Thi sát hạch", icon: "bi bi-clipboard-data", color: "#d63384", bg: "#fce8f2" },
];

const refreshAll = () => {
  loading.value = true;
  loadAll();
};

const loadAll = async () => {
  try {
    const [profileRes, courseRes, scheduleRes, examRes] = await Promise.all([
      api.get("/hoc-vien/me"),
      api.get("/hoc-vien/me/khoa-hoc-dang-ky"),
      api.get("/hoc-vien/me/lich-hoc"),
      api.get("/hoc-vien/me/lich-thi"),
    ]);
    profile.value = profileRes.data;
    registeredCourses.value = courseRes.data;
    lichHocs.value = scheduleRes.data;
    lichThis.value = examRes.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

onMounted(loadAll);
</script>

<style scoped>
.avatar-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.stat-card { transition: transform 0.2s, box-shadow 0.2s; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
.icon-wrap { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; }

/* Timeline */
.timeline-item { position: relative; }
.timeline-dot { width: 12px; height: 12px; border-radius: 50%; background: #0d6efd; margin-top: 18px; position: relative; z-index: 1; }
.timeline-item.has-line .timeline-dot::after { content: ''; position: absolute; top: 12px; left: 5px; width: 2px; height: calc(100% + 12px); background: #d0d9e8; }
.timeline-card { transition: transform 0.15s; }
.timeline-card:hover { transform: translateX(4px); }

/* Course card */
.course-card { border-left: 4px solid #0d6efd !important; }

/* Quick access */
.quick-link-card { transition: transform 0.15s, box-shadow 0.15s; }
.quick-link-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

/* Skeleton */
.skeleton-card { background: #f0f0f0; animation: pulse 1.5s infinite; }
.skeleton-box { background: #ddd; border-radius: 8px; }
.skeleton-circle { width: 48px; height: 48px; border-radius: 50%; }
.skeleton-h3 { width: 60%; height: 24px; }
.skeleton-small { width: 80%; height: 14px; }
.skeleton-h5 { width: 40%; height: 20px; }
.skeleton-row { width: 100%; height: 40px; }
.skeleton-btn { width: 100%; height: 44px; border-radius: 12px; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
</style>
