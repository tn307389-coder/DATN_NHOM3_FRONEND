<template>
  <div class="container-fluid">
    <h2 class="mb-4">Dashboard</h2>

    <p class="text-muted">
      Chào mừng đến hệ thống quản lý trung tâm GPLX DriveHub
    </p>

    <!-- Cards Tổng quan -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white shadow dashboard-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">👨‍🎓 Tổng học viên</h6>
                <h2 class="mb-0">{{ tongHocVien }}</h2>
              </div>
              <div class="stat-icon">👨‍🎓</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white shadow dashboard-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">👨‍🏫 Giáo viên</h6>
                <h2 class="mb-0">{{ tongGiaoVien }}</h2>
              </div>
              <div class="stat-icon">👨‍🏫</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-warning text-white shadow dashboard-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">🚗 Xe tập lái</h6>
                <h2 class="mb-0">{{ tongXeTapLai }}</h2>
              </div>
              <div class="stat-icon">🚗</div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-info text-white shadow dashboard-card">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">🏫 Khóa học đang mở</h6>
                <h2 class="mb-0">{{ tongKhoaHocDangMo }}</h2>
              </div>
              <div class="stat-icon">🏫</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cards Tài chính -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-dark text-white shadow dashboard-card">
          <div class="card-body">
            <h6 class="mb-1">💰 Tổng doanh thu</h6>
            <h3 class="mb-0">{{ formatTien(tongDoanhThu) }}</h3>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white shadow dashboard-card">
          <div class="card-body">
            <h6 class="mb-1">📈 Doanh thu tháng này</h6>
            <h3 class="mb-0">{{ formatTien(doanhThuThangNay) }}</h3>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-secondary text-white shadow dashboard-card">
          <div class="card-body">
            <h6 class="mb-1">📉 Doanh thu tháng trước</h6>
            <h3 class="mb-0">{{ formatTien(doanhThuThangTruoc) }}</h3>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card shadow dashboard-card">
          <div class="card-body">
            <h6 class="mb-1">🎓 Tỷ lệ đậu thi</h6>
            <h3 class="mb-0 text-primary">{{ tyLeDauThi }}%</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <!-- Biểu đồ Doanh thu theo tháng (SVG) -->
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">📊 Biểu đồ doanh thu theo tháng</h5>
            <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>
            <div v-else-if="revenueChart.points.length === 0" class="text-muted text-center py-4">
              Chưa có dữ liệu doanh thu
            </div>
            <div v-else class="revenue-chart">
              <svg
                :viewBox="`0 0 ${revenueChart.W} ${revenueChart.H}`"
                class="w-100"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#4e73df" />
                    <stop offset="100%" stop-color="#4e73df" stop-opacity="0" />
                  </linearGradient>
                </defs>

                <g v-for="(t, i) in revenueChart.yTicks" :key="'y' + i">
                  <line
                    :x1="revenueChart.padL"
                    :y1="t.y"
                    :x2="revenueChart.W - revenueChart.padR"
                    :y2="t.y"
                    stroke="#ececec"
                  />
                  <text
                    :x="revenueChart.padL - 10"
                    :y="t.y + 4"
                    text-anchor="end"
                    class="axis-label"
                  >{{ t.label }}</text>
                </g>

                <path :d="revenueChart.areaPath" fill="url(#revGrad)" />

                <polyline
                  :points="revenueChart.polylinePoints"
                  fill="none"
                  stroke="#224abe"
                  stroke-width="3"
                  stroke-linejoin="round"
                  stroke-linecap="round"
                />

                <g v-for="(p, i) in revenueChart.points" :key="'p' + i">
                  <circle
                    :cx="p.x"
                    :cy="p.y"
                    r="5"
                    fill="#224abe"
                    stroke="#fff"
                    stroke-width="2"
                  />
                  <text :x="p.x" :y="p.y - 12" text-anchor="middle" class="point-label">
                    {{ fmtCompact(p.value) }}
                  </text>
                  <text
                    :x="p.x"
                    :y="revenueChart.H - revenueChart.padB + 18"
                    text-anchor="middle"
                    class="axis-label"
                  >{{ p.monthLabel }}</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Thống kê hiệu suất giáo viên -->
      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">👨‍🏫 Hiệu suất giáo viên</h5>
            <div v-if="thongKeGiaoViens.length === 0" class="text-muted">Chưa có dữ liệu</div>
            <div v-else>
              <div v-for="gv in thongKeGiaoViens.slice(0, 6)" :key="gv.magv" class="d-flex justify-content-between align-items-center py-2 border-bottom">
                <div>
                  <div class="fw-semibold">{{ gv.tenGiaoVien }}</div>
                  <small class="text-muted">Lớp: {{ gv.soLopDay }}</small>
                </div>
                <span class="badge bg-primary">{{ gv.soLopDay }} lớp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hoạt động gần đây -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5 class="mb-3">📋 Thống kê nhanh</h5>
        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Nội dung</th>
              <th>Giá trị</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Tổng học viên hiện có</td>
              <td><strong>{{ tongHocVien }}</strong> người</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Tổng giáo viên hiện có</td>
              <td><strong>{{ tongGiaoVien }}</strong> người</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Khóa học đang mở</td>
              <td><strong>{{ tongKhoaHocDangMo }}</strong> khóa</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Tỷ lệ đậu thi</td>
              <td><strong class="text-success">{{ tyLeDauThi }}%</strong></td>
            </tr>
            <tr>
              <td>5</td>
              <td>Tổng doanh thu</td>
              <td><strong>{{ formatTien(tongDoanhThu) }}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAll } from "../services/crudService";
import api from "../services/api";

const loading = ref(false);
const tongHocVien = ref(0);
const tongGiaoVien = ref(0);
const tongXeTapLai = ref(0);
const tongKhoaHocDangMo = ref(0);
const tongDoanhThu = ref(0);
const doanhThuThangNay = ref(0);
const doanhThuThangTruoc = ref(0);
const tyLeDauThi = ref(0);
const thongKeGiaoViens = ref([]);
const doanhThuTheoThangs = ref([]);
const maxRevenue = ref(0);

const formatTien = (v) => {
  if (!v) return "0 đ";
  return Number(v).toLocaleString("vi-VN") + " đ";
};

const CHART = { W: 820, H: 320, padL: 70, padR: 20, padT: 20, padB: 45 };

const fmtCompact = (v) => {
  if (v >= 1e6) {
    const m = v / 1e6;
    return (Number.isInteger(m) ? m : m.toFixed(1)) + "tr";
  }
  if (v >= 1e3) return (v / 1e3).toFixed(0) + "k";
  return String(v);
};

const revenueChart = computed(() => {
  const { W, H, padL, padR, padT, padB } = CHART;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const data = doanhThuTheoThangs.value;
  const max = maxRevenue.value || 1;
  const n = data.length;

  const points = data.map((d, i) => {
    const x = n === 1 ? padL + plotW / 2 : padL + (i / (n - 1)) * plotW;
    const y = padT + plotH - (d.soTien / max) * plotH;
    return { x, y, value: d.soTien, monthLabel: d.thang };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const baseY = padT + plotH;
  let areaPath = "";
  if (points.length) {
    areaPath =
      `M ${padL},${baseY} ` +
      points.map((p) => `L ${p.x},${p.y}`).join(" ") +
      ` L ${points[points.length - 1].x},${baseY} Z`;
  }

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => ({
    y: baseY - f * plotH,
    label: fmtCompact(Math.round(max * f)),
  }));

  return { W, H, padL, padR, padB, points, polylinePoints, areaPath, yTicks };
});

const loadDashboard = async () => {
  loading.value = true;
  try {
    // Load từ API thống kê mới
    const statsRes = await api.get("/dashboard/stats");
    const stats = statsRes.data;

    tongHocVien.value = stats.tongHocVien || 0;
    tongGiaoVien.value = stats.tongGiaoVien || 0;
    tongKhoaHocDangMo.value = stats.tongKhoaHocDangMo || 0;
    tongDoanhThu.value = stats.tongDoanhThu || 0;
    doanhThuThangNay.value = stats.doanhThuThangNay || 0;
    doanhThuThangTruoc.value = stats.doanhThuThangTruoc || 0;
    tyLeDauThi.value = stats.tyLeDauThi || 0;
    thongKeGiaoViens.value = stats.thongKeGiaoViens || [];
    doanhThuTheoThangs.value = stats.doanhThuTheoThangs || [];

    maxRevenue.value = Math.max(1, ...doanhThuTheoThangs.value.map((d) => d.soTien));

    // Fallback cho xeTapLai
    try {
      const xeRes = await getAll("/xe-tap-lai");
      tongXeTapLai.value = xeRes.data.length;
    } catch (e) {
      tongXeTapLai.value = 0;
    }
  } catch (error) {
    console.error("Error loading dashboard:", error);
    // Fallback: load trực tiếp
    try {
      const [hocVien, giaoVien, xeTapLai] = await Promise.all([
        getAll("/hoc-vien"),
        getAll("/giao-vien"),
        getAll("/xe-tap-lai"),
      ]);
      tongHocVien.value = hocVien.data.length;
      tongGiaoVien.value = giaoVien.data.length;
      tongXeTapLai.value = xeTapLai.data.length;
    } catch (e) {
      console.error(e);
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  transition: 0.25s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.card {
  border-radius: 12px;
}

.stat-icon {
  font-size: 36px;
  opacity: 0.5;
}

.revenue-chart {
  width: 100%;
  padding: 6px 0 0;
}

.revenue-chart svg {
  display: block;
  width: 100%;
  height: auto;
}

.axis-label {
  font-size: 12px;
  fill: #777;
}

.point-label {
  font-size: 12px;
  font-weight: 600;
  fill: #224abe;
}
</style>