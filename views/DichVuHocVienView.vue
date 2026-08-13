<template>
  <div>
    <div class="d-flex align-items-center gap-2 mb-4">
      <div class="icon-wrap bg-primary bg-opacity-10 rounded-3">
        <i class="bi bi-person-badge fs-4 text-primary"></i>
      </div>
      <div>
        <h4 class="mb-0 fw-bold">Dịch vụ học viên</h4>
        <small class="text-muted">Thanh toán khóa học và đăng ký học lại</small>
      </div>
    </div>

    <ul class="nav nav-pills mb-4 gap-2">
      <li class="nav-item">
        <button class="nav-link rounded-pill px-4" :class="tab === 'thanh-toan' ? 'active' : ''" @click="tab = 'thanh-toan'">
          <i class="bi bi-qr-code me-1"></i> Thanh toán khóa học
        </button>
      </li>
      <li class="nav-item">
        <button class="nav-link rounded-pill px-4" :class="tab === 'dang-ky-lai' ? 'active' : ''" @click="tab = 'dang-ky-lai'">
          <i class="bi bi-arrow-counterclockwise me-1"></i> Đăng ký học lại
        </button>
      </li>
    </ul>

    <!-- ================= TAB: THANH TOÁN KHÓA HỌC ================= -->
    <template v-if="tab === 'thanh-toan'">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted mb-0">Đang tải dữ liệu...</p>
      </div>

      <template v-else>
        <div class="row g-3 mb-4">
          <div class="col-md-3 col-6">
            <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
              <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
                <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-receipt fs-4"></i></div>
                <div><h3 class="mb-0 fw-bold">{{ payments.length }}</h3><small class="opacity-75">Tổng GD</small></div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
              <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
                <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
                <div><h3 class="mb-0 fw-bold">{{ paidCount }}</h3><small class="opacity-75">Đã TT</small></div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
              <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
                <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
                <div><h3 class="mb-0 fw-bold">{{ unpaidCount }}</h3><small class="opacity-75">Chưa TT</small></div>
              </div>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
              <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
                <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-cash-stack fs-4"></i></div>
                <div><h3 class="mb-0 fw-bold">{{ totalAmount }}</h3><small class="opacity-75">Tổng tiền</small></div>
              </div>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4 mb-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3"><i class="bi bi-book me-2 text-primary"></i>Khóa học của tôi</h5>
            <div v-if="courses.length === 0" class="text-center py-4">
              <i class="bi bi-book display-4 text-muted"></i>
              <p class="text-muted mt-2 mb-0">Bạn chưa đăng ký khóa học nào</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-primary bg-gradient">
                  <tr>
                    <th class="fw-semibold">Khóa học</th>
                    <th class="fw-semibold">Ngày ĐK</th>
                    <th class="fw-semibold">Trạng thái</th>
                    <th class="text-center fw-semibold">Thanh toán</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="c in courses" :key="c.madk">
                    <td class="fw-semibold">{{ c.tenKhoaHoc }}</td>
                    <td>{{ formatDate(c.ngaydangky) }}</td>
                    <td><span class="badge rounded-pill px-3 py-2" :class="statusBadge(c.trangthai)">{{ c.trangthai }}</span></td>
                    <td class="text-center">
                      <button class="btn btn-success btn-sm rounded-pill px-3" @click="payCourse(c.madk)" :disabled="payingMadk === c.madk">
                        <span v-if="payingMadk === c.madk" class="spinner-border spinner-border-sm"></span>
                        <i v-else class="bi bi-qr-code me-1"></i>Thanh toán QR
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm rounded-4">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-3"><i class="bi bi-receipt me-2 text-primary"></i>Lịch sử thanh toán</h5>
            <div v-if="payments.length === 0" class="text-center py-4">
              <i class="bi bi-receipt display-4 text-muted"></i>
              <p class="text-muted mt-2 mb-0">Chưa có giao dịch thanh toán nào</p>
            </div>
            <div v-else class="table-responsive">
              <table class="table table-hover align-middle mb-0">
                <thead class="table-primary bg-gradient">
                  <tr>
                    <th class="fw-semibold">Mã TT</th>
                    <th class="fw-semibold">Khóa học</th>
                    <th class="fw-semibold">Ngày TT</th>
                    <th class="fw-semibold">Số tiền</th>
                    <th class="fw-semibold">PT</th>
                    <th class="fw-semibold">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="p in payments" :key="p.matt">
                    <td>#{{ p.matt }}</td>
                    <td class="fw-semibold">{{ p.tenKhoaHoc || '—' }}</td>
                    <td>{{ formatDate(p.ngaythanhtoan) }}</td>
                    <td>{{ p.sotien ? Number(p.sotien).toLocaleString('vi-VN') + '₫' : '' }}</td>
                    <td>{{ p.phuongthuc }}</td>
                    <td><span class="badge rounded-pill px-3 py-2" :class="paymentBadge(p.trangthai)">{{ p.trangthai }}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </template>
    </template>

    <!-- ================= TAB: ĐĂNG KÝ HỌC LẠI ================= -->
    <template v-if="tab === 'dang-ky-lai'">
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3" role="status"></div>
        <p class="text-muted mb-0">Đang tải dữ liệu...</p>
      </div>

      <div v-else class="card border-0 shadow-sm rounded-4">
        <div class="card-body p-4">
          <p class="text-muted small mb-4">
            <i class="bi bi-info-circle me-1"></i>
            Chọn khóa học bạn đã đăng ký trước đó để tạo đơn đăng ký học lại. Đơn sẽ được nhân viên duyệt.
          </p>
          <div v-if="courses.length === 0" class="text-center py-5">
            <i class="bi bi-journal-x display-4 text-muted"></i>
            <p class="text-muted mt-2 mb-0">Bạn chưa có khóa học nào để đăng ký học lại</p>
          </div>
          <div v-else class="row g-3">
            <div v-for="c in courses" :key="c.madk" class="col-md-6">
              <div class="card border-0 bg-light rounded-4 h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <div class="fw-semibold">{{ c.tenKhoaHoc }}</div>
                      <small class="text-muted">
                        <i class="bi bi-calendar me-1"></i>ĐK: {{ formatDate(c.ngaydangky) }}
                      </small>
                    </div>
                    <span class="badge rounded-pill px-3 py-2" :class="statusBadge(c.trangthai)">{{ c.trangthai }}</span>
                  </div>
                  <button class="btn btn-primary rounded-pill px-4 mt-3 w-100" @click="reRegister(c)" :disabled="reMadk === c.madk">
                    <span v-if="reMadk === c.madk" class="spinner-border spinner-border-sm me-1"></span>
                    <i v-else class="bi bi-arrow-counterclockwise me-1"></i>
                    Đăng ký học lại
                  </button>
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
import { useRouter } from "vue-router";
import api from "../services/api";
import { useSite } from "../composables/useSite";

const router = useRouter();
const { khoiTaoThanhToan } = useSite();

const tab = ref("thanh-toan");
const loading = ref(true);
const payments = ref([]);
const courses = ref([]);
const payingMadk = ref(null);
const reMadk = ref(null);

const paidCount = computed(() => payments.value.filter((p) => p.trangthai === "Đã thanh toán").length);
const unpaidCount = computed(() => payments.value.filter((p) => p.trangthai !== "Đã thanh toán").length);
const totalAmount = computed(() => {
  const total = payments.value.reduce((s, p) => s + (Number(p.sotien) || 0), 0);
  return total.toLocaleString("vi-VN") + "₫";
});

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const paymentBadge = (s) => {
  const map = { "Đã thanh toán": "bg-success bg-opacity-10 text-success", "Chưa thanh toán": "bg-danger bg-opacity-10 text-danger", "Thanh toán một phần": "bg-warning bg-opacity-10 text-warning" };
  return map[s] || "bg-secondary bg-opacity-10 text-secondary";
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

const payCourse = async (madk) => {
  payingMadk.value = madk;
  try {
    const res = await khoiTaoThanhToan(madk);
    if (res.success) router.push(`/thanh-toan/${res.data.matt}`);
    else window.$toast?.add(res.message || "Khởi tạo thanh toán thất bại", "error");
  } catch (e) {
    window.$toast?.add("Khởi tạo thanh toán thất bại", "error");
  } finally {
    payingMadk.value = null;
  }
};

const reRegister = async (course) => {
  reMadk.value = course.madk;
  try {
    const res = await api.post("/dang-ky-khoa-hoc/me/dang-ky-lai", { makh: course.makh });
    if (res.data.success) {
      window.$toast?.add(res.data.message || "Đăng ký học lại thành công", "success");
      await loadData();
    } else {
      window.$toast?.add(res.data.message || "Đăng ký học lại thất bại", "error");
    }
  } catch (e) {
    window.$toast?.add(e.response?.data?.message || "Đăng ký học lại thất bại", "error");
  } finally {
    reMadk.value = null;
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const [payRes, courseRes] = await Promise.all([
      api.get("/thanh-toan/me"),
      api.get("/hoc-vien/me/khoa-hoc-dang-ky"),
    ]);
    payments.value = Array.isArray(payRes.data) ? payRes.data : [];
    courses.value = Array.isArray(courseRes.data) ? courseRes.data : [];
  } catch (e) {
    console.log(e);
    window.$toast?.add("Không thể tải dữ liệu", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(loadData);
</script>

<style scoped>
.icon-wrap { width: 46px; height: 46px; display: flex; align-items: center; justify-content: center; }
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
.table-primary.bg-gradient { background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%) !important; }
.nav-pills .nav-link.active { background: linear-gradient(135deg, #0d6efd, #2563eb); color: #fff; box-shadow: 0 6px 16px rgba(13,110,253,0.28); }
.nav-pills .nav-link:not(.active) { color: #475569; background: #fff; border: 1px solid #dbe3ef; }
</style>
