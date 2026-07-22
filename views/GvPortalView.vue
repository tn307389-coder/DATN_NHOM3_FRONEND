<template>
  <div class="container py-4">
    <!-- HEADER: Avatar + Greeting + Date -->
    <div class="d-flex flex-wrap align-items-center gap-3 mb-4">
      <div class="avatar-circle bg-success text-white shadow-sm">
        <span class="fw-bold">{{ initials }}</span>
      </div>
      <div class="flex-grow-1">
        <div class="d-flex align-items-center gap-2 flex-wrap">
          <h4 class="mb-0 fw-bold">Xin chào, {{ profile.hoten || 'Giáo viên' }}</h4>
          <span v-if="profile.hangday" class="badge bg-success bg-opacity-10 text-success rounded-pill px-3 py-2">
            <i class="bi bi-mortarboard me-1"></i>{{ profile.hangday }}
          </span>
        </div>
        <p class="text-muted mb-0 small">
          <i class="bi bi-calendar3 me-1"></i> {{ todayDate }}
          <i class="bi bi-person-workspace ms-3 me-1"></i> Giáo viên
        </p>
      </div>
      <button class="btn btn-outline-secondary rounded-pill btn-sm px-3" @click="refreshAll" :disabled="loading">
        <i class="bi bi-arrow-clockwise me-1" :class="{ 'spin': loading }"></i> Làm mới
      </button>
    </div>

    <!-- SKELETON LOADING -->
    <div v-if="loading" class="skeleton-wrapper">
      <div class="row g-3 mb-4">
        <div v-for="i in 4" :key="i" class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 skeleton-card">
            <div class="card-body p-3">
              <div class="skeleton-box skeleton-circle"></div>
              <div class="skeleton-box skeleton-h3 mt-2"></div>
              <div class="skeleton-box skeleton-small mt-1"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row g-4">
        <div class="col-md-8">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="skeleton-box skeleton-h5 mb-3"></div>
              <div v-for="i in 2" :key="i" class="skeleton-box skeleton-row mb-2"></div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card border-0 shadow-sm rounded-4">
            <div class="card-body p-4">
              <div class="skeleton-box skeleton-h5 mb-3"></div>
              <div v-for="i in 4" :key="i" class="skeleton-box skeleton-btn mb-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template v-else>
      <!-- STAT CARDS -->
      <div class="row g-3 mb-4">
        <div v-for="s in statCards" :key="s.key || 'today'" class="col-md-3 col-6">
          <div class="card border-0 shadow-sm rounded-4 stat-card h-100" :style="{ background: s.bg }">
            <div class="card-body d-flex align-items-center gap-3 p-3">
              <div class="icon-wrap rounded-3 bg-white bg-opacity-25 p-3">
                <i :class="s.icon" class="fs-3"></i>
              </div>
              <div class="text-white">
                <h3 class="mb-0 fw-bold stat-number">{{ s.key ? (stats[s.key] ?? 0) : todaySchedules.length }}</h3>
                <small class="opacity-75">{{ s.label }}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="row g-4">
        <!-- TODAY'S SCHEDULE -->
        <div class="col-lg-8">
          <div class="card border-0 shadow-sm rounded-4 h-100">
            <div class="card-header bg-transparent border-bottom-0 pt-4 px-4 d-flex justify-content-between align-items-center">
              <h5 class="fw-bold mb-0">
                <i class="bi bi-calendar-event me-2 text-success"></i>Lịch dạy hôm nay
                <span v-if="todaySchedules.length > 0" class="badge bg-success rounded-pill ms-2">{{ todaySchedules.length }} ca</span>
              </h5>
              <router-link to="/lich-cua-toi" class="btn btn-sm btn-outline-success rounded-pill px-3">
                Xem tất cả <i class="bi bi-arrow-right ms-1"></i>
              </router-link>
            </div>
            <div class="card-body px-4 pb-4">
              <div v-if="todaySchedules.length === 0" class="text-center py-5">
                <i class="bi bi-calendar-check display-4 text-muted"></i>
                <p class="text-muted mt-2 mb-0">Hôm nay không có lịch dạy</p>
                <p class="text-muted small">Hãy tận hưởng ngày nghỉ ngơi nhé!</p>
              </div>
              <div v-else class="schedule-cards">
                <div v-for="item in todaySchedules" :key="item.malich" class="schedule-card card border-0 bg-light rounded-3 p-3 mb-2">
                  <div class="d-flex align-items-center gap-3">
                    <div class="time-badge bg-success text-white rounded-3 p-2 text-center" style="min-width:70px">
                      <div class="fw-bold small">{{ item.giolhlucbatdau?.slice(0,5) }}</div>
                      <div class="small opacity-75">{{ item.giolhlucketthuc?.slice(0,5) }}</div>
                    </div>
                    <div class="flex-grow-1">
                      <div class="fw-semibold">{{ item.tenmonhoc }}</div>
                      <div class="d-flex gap-3 flex-wrap small text-muted mt-1">
                        <span><i class="bi bi-clock me-1"></i>{{ item.tencahoc }}</span>
                        <span><i class="bi bi-tag me-1"></i>{{ item.tenlop }}</span>
                        <span><i class="bi bi-geo-alt me-1"></i>{{ item.tenphong || '—' }}</span>
                      </div>
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
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import api from "../services/api";

const loading = ref(true);
const profile = ref({});
const stats = ref({ tongSoHocVien: 0, soHocVienQuaLop: 0, soHocVienQuaPhanCong: 0 });
const lichHocs = ref([]);

const todayDate = computed(() => {
  const d = new Date();
  const opts = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
  return d.toLocaleDateString("vi-VN", opts);
});

const initials = computed(() => {
  const n = (profile.value.hoten || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
});

const todaySchedules = computed(() => {
  const today = new Date().toISOString().slice(0, 10);
  return lichHocs.value.filter((lh) => lh.ngayhoc === today);
});

const statCards = computed(() => [
  { key: "tongSoHocVien", label: "Học viên quản lý", icon: "bi bi-people-fill", bg: "linear-gradient(135deg, #0d6efd, #0a58ca)" },
  { key: "soHocVienQuaLop", label: "Qua lớp học", icon: "bi bi-bookmark-check", bg: "linear-gradient(135deg, #0dcaf0, #0aa2c0)" },
  { key: "soHocVienQuaPhanCong", label: "Qua phân công", icon: "bi bi-diagram-3", bg: "linear-gradient(135deg, #ffc107, #e0a800)" },
  { key: null, label: "Lịch dạy hôm nay", icon: "bi bi-calendar-check", bg: "linear-gradient(135deg, #198754, #146c43)", dynamic: () => todaySchedules.value.length },
]);

const quickLinks = [
  { path: "/diem-danh", label: "Điểm danh", icon: "bi bi-check-circle", color: "#0dcaf0", bg: "#eef8fa" },
  { path: "/bang-diem-thuong-xuyen", label: "Bảng điểm", icon: "bi bi-bar-chart", color: "#0d6efd", bg: "#eef2ff" },
  { path: "/lich-cua-toi", label: "Lịch dạy", icon: "bi bi-calendar-week", color: "#198754", bg: "#e8f5ee" },
  { path: "/ho-so-cua-toi", label: "Hồ sơ", icon: "bi bi-person-gear", color: "#6c757d", bg: "#f3f4f6" },
  { path: "/lop-hoc", label: "Lớp học", icon: "bi bi-tags", color: "#212529", bg: "#f0f0f0" },
  { path: "/thi-sat-hach", label: "Thi sát hạch", icon: "bi bi-clipboard-data", color: "#d63384", bg: "#fce8f2" },
];

const refreshAll = () => {
  loading.value = true;
  Promise.all([loadProfile(), loadSchedule()]).then(() => { loading.value = false; });
};

const loadProfile = async () => {
  try {
    const res = await api.get("/giao-vien/me");
    profile.value = res.data;
    if (res.data.magv) {
      const s = await api.get(`/giao-vien/${res.data.magv}/thong-ke-hoc-vien`);
      stats.value = s.data;
    }
  } catch (e) { console.error(e); }
};

const loadSchedule = async () => {
  try {
    const res = await api.get("/giao-vien/me/lich-day");
    lichHocs.value = res.data;
  } catch (e) { console.error(e); }
};

onMounted(async () => {
  await Promise.all([loadProfile(), loadSchedule()]);
  loading.value = false;
});
</script>

<style scoped>
.avatar-circle { width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; }
.stat-card { transition: transform 0.2s, box-shadow 0.2s; }
.stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
.icon-wrap { width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; }
.schedule-card { transition: transform 0.15s; border-left: 4px solid #198754 !important; }
.schedule-card:hover { transform: translateX(4px); }
.time-badge { line-height: 1.2; }
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
