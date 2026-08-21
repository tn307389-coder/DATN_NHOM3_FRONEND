<template>
  <div class="payment-page">
    <div class="row g-4">
      <!-- ========== Cột trái: HỒ SƠ CỦA TÔI ========== -->
      <div class="col-lg-5">
        <div class="card profile-card">
          <!-- Header card: Avatar + tên + badge -->
          <div class="profile-header">
            <div class="avatar-wrap">
              <img v-if="profile.anh" :src="avatarSrc" alt="Avatar" class="avatar-img" />
              <span v-else class="avatar-initials">{{ initials }}</span>
            </div>
            <div class="profile-header-info">
              <h5 class="profile-name">{{ hocVien.hoten || profile.hoten || 'Học viên' }}</h5>
              <span class="badge-role">Học viên</span>
              <div class="profile-phone">
                <i class="bi bi-telephone"></i> {{ hocVien.sodienthoai || profile.soDienThoai || '—' }}
              </div>
            </div>
          </div>

          <!-- THÔNG TIN TÀI KHOẢN -->
          <div class="info-section">
            <h6 class="section-title">Thông tin tài khoản</h6>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Tên đăng nhập</span>
                <span class="info-value">{{ profile.tendangnhap || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Vai trò</span>
                <span class="info-value">Học viên</span>
              </div>
              <div class="info-item">
                <span class="info-label">Họ tên</span>
                <span class="info-value">{{ profile.hoten || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ profile.email || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Số điện thoại</span>
                <span class="info-value">{{ profile.soDienThoai || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- HỒ SƠ HỌC VIÊN -->
          <div class="info-section">
            <h6 class="section-title">Hồ sơ học viên</h6>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Mã hồ sơ</span>
                <span class="info-value">{{ hoSo.mahs ? 'HV' + String(hoSo.mahs).padStart(6, '0') : '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ngày đăng ký</span>
                <span class="info-value">{{ formatDate(hoSo.ngaydangky) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Tình trạng</span>
                <span class="badge-status" :class="tinhTrangClass">{{ hoSo.tinhtrang || 'Đang xử lý' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">CCCD</span>
                <span class="info-value">{{ hocVien.cccd || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- THÔNG TIN HỌC VIÊN -->
          <div class="info-section">
            <h6 class="section-title">Thông tin học viên</h6>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">Họ và tên</span>
                <span class="info-value">{{ hocVien.hoten || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Ngày sinh</span>
                <span class="info-value">{{ formatDate(hocVien.ngaysinh) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Giới tính</span>
                <span class="info-value">{{ hocVien.gioitinh || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">Email</span>
                <span class="info-value">{{ hocVien.email || '—' }}</span>
              </div>
              <div class="info-item full-width">
                <span class="info-label">Địa chỉ</span>
                <span class="info-value">{{ hocVien.diachi || '—' }}</span>
              </div>
            </div>
          </div>

          <!-- Upload areas -->
          <div class="info-section">
            <h6 class="section-title">Tài liệu đính kèm</h6>
            <div class="upload-row">
              <div class="upload-box">
                <i class="bi bi-card-image"></i>
                <span>Ảnh căn cước</span>
                <a v-if="hoSo.anhCanhCuoc" :href="fileUrl(hoSo.anhCanhCuoc)" target="_blank" class="upload-link">Xem file</a>
                <span v-else class="upload-empty">Chưa có</span>
              </div>
              <div class="upload-box">
                <i class="bi bi-paperclip"></i>
                <span>File hồ sơ</span>
                <a v-if="hoSo.fileHoSo" :href="fileUrl(hoSo.fileHoSo)" target="_blank" class="upload-link">Xem file</a>
                <span v-else class="upload-empty">Chưa có</span>
              </div>
            </div>
          </div>

          <!-- Nút sửa hồ sơ -->
          <div class="profile-footer">
            <button class="btn btn-primary btn-edit" @click="$router.push('/ho-so-cua-toi')">
              <i class="bi bi-pencil-square"></i> Sửa hồ sơ học viên
            </button>
          </div>
        </div>
      </div>

      <!-- ========== Cột phải: THANH TOÁN QR ========== -->
      <div class="col-lg-7">
        <!-- Loading -->
        <div v-if="loading" class="card payment-card">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="text-muted mt-3 mb-0">Đang tải thông tin thanh toán...</p>
          </div>
        </div>

        <!-- Error -->
        <div v-else-if="error && !payment" class="card payment-card">
          <div class="text-center py-5">
            <i class="bi bi-x-octagon display-4 text-danger"></i>
            <p class="text-danger mt-3 mb-0">{{ error }}</p>
            <button class="btn btn-outline-secondary mt-3" @click="$router.push('/hv-portal')">
              <i class="bi bi-arrow-left me-1"></i> Quay lại
            </button>
          </div>
        </div>

        <!-- Đã thanh toán -->
        <div v-else-if="payment && payment.trangthai === 'DA_THANH_TOAN'" class="card payment-card">
          <div class="text-center py-5">
            <div class="success-icon mx-auto mb-3">
              <i class="bi bi-check-lg"></i>
            </div>
            <h5 class="fw-bold text-success">Thanh toán thành công!</h5>
            <p class="text-muted mb-1">Học phần: <strong>{{ payment.tenKhoaHoc }}</strong></p>
            <p class="text-muted mb-4">Số tiền: <strong>{{ formatMoney(payment.sotien) }}</strong></p>
            <button class="btn btn-primary px-4" @click="$router.push('/hv-portal')">
              <i class="bi bi-house me-1"></i> Về trang chủ
            </button>
          </div>
        </div>

        <!-- Chưa thanh toán -->
        <template v-else-if="payment">
          <div class="card payment-card">
            <!-- Tiêu đề -->
            <div class="payment-header">
              <h5 class="payment-title">F2 - Thanh toán QR</h5>
            </div>

            <!-- Thông tin khóa học -->
            <div class="course-info">
              <div class="course-row">
                <span class="course-label">Khóa học</span>
                <span class="course-value">{{ payment.tenKhoaHoc || '—' }}</span>
              </div>
              <div class="course-row">
                <span class="course-label">Số tiền</span>
                <span class="course-amount">{{ formatMoney(payment.sotien) }}</span>
              </div>
            </div>

            <!-- QR Code -->
            <div class="qr-section">
              <div class="qr-wrap">
                <img v-if="payment.qrBase64" :src="'data:image/png;base64,' + payment.qrBase64" alt="Mã QR thanh toán" class="qr-img" />
                <div v-else class="spinner-border text-primary" role="status"></div>
              </div>
              <div class="qr-code-label">{{ payment.transactionRef || '—' }}</div>
              <div class="qr-hint">(qrBase64)</div>
            </div>

            <!-- Thông tin giao dịch -->
            <div class="tx-info">
              <h6 class="tx-title">Thông tin giao dịch</h6>
              <div class="tx-grid">
                <div class="tx-item">
                  <span class="tx-label">Mã giao dịch</span>
                  <span class="tx-value mono">{{ payment.transactionRef || '—' }}</span>
                </div>
                <div class="tx-item">
                  <span class="tx-label">Trạng thái</span>
                  <span class="badge-tx badge-waiting">Chờ</span>
                </div>
                <div class="tx-item">
                  <span class="tx-label">Thời gian tạo</span>
                  <span class="tx-value">{{ formatDateTime(payment.ngayTao) }}</span>
                </div>
                <div class="tx-item">
                  <span class="tx-label">Hạn thanh toán</span>
                  <span class="tx-value">{{ formatDeadline(payment.ngayTao) }}</span>
                </div>
              </div>
            </div>

            <!-- Thông báo -->
            <div class="alert-notice">
              <i class="bi bi-info-circle-fill"></i>
              <span>Vui lòng quét mã QR bằng ứng dụng ngân hàng để thanh toán.</span>
            </div>

            <!-- Nút xác nhận -->
            <div class="action-area">
              <button class="btn btn-confirm" @click="xacNhan" :disabled="confirming">
                <span v-if="confirming" class="spinner-border spinner-border-sm me-1"></span>
                <i v-else class="bi bi-check-circle me-1"></i>
                Tôi đã thanh toán
              </button>
              <div class="polling-note" v-if="!confirmed">(polling trạng thái)</div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSite } from "../composables/useSite";
import api from "../services/api";

const route = useRoute();
const router = useRouter();
const { layThongTinThanhToan, kiemTraTrangThaiThanhToan, xacNhanThanhToan } = useSite();

const matt = Number(route.params.matt);
const loading = ref(true);
const error = ref("");
const payment = ref(null);
const confirming = ref(false);
const confirmed = ref(false);
let pollTimer = null;

// Student profile data
const profile = ref({});
const hocVien = ref({});
const hoSo = ref({});

const formatMoney = (n) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
};

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
  });
};

const formatDateTime = (d) => {
  if (!d) {
    const now = new Date();
    return now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      + " – " + now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
  }
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " – " + new Date(d).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

const formatDeadline = (d) => {
  if (!d) {
    const now = new Date();
    now.setHours(22, 30, 0, 0);
    return now.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
      + " – 22:30";
  }
  const dt = new Date(d);
  dt.setHours(22, 30, 0, 0);
  return dt.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
    + " – 22:30";
};

const tinhTrangClass = computed(() => {
  const t = hoSo.value?.tinhtrang;
  if (t === "Đã duyệt" || t === "DA_DUYET") return "badge-success";
  if (t === "Từ chối" || t === "TU_CHOI") return "badge-danger";
  if (t === "Bổ sung hồ sơ") return "badge-warning";
  return "badge-info";
});

const avatarSrc = computed(() => profile.value.anh || "");

const initials = computed(() => {
  const n = (hocVien.value.hoten || profile.value.hoten || "").trim();
  if (!n) return "?";
  return n.split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
});

const fileUrl = (f) => {
  if (!f) return "";
  if (f.startsWith("http")) return f;
  const base = api.defaults.baseURL?.replace(/\/api$/, "") || "http://localhost:8081";
  return base + f;
};

// Load student profile
const loadProfile = async () => {
  try {
    const [tkRes, hvRes] = await Promise.all([
      api.get("/tai-khoan/me").catch(() => null),
      api.get("/hoc-vien/me").catch(() => null),
    ]);
    if (tkRes?.data) profile.value = tkRes.data;
    if (hvRes?.data) hocVien.value = hvRes.data;
  } catch (e) { /* ignore */ }
};

const loadHoSo = async () => {
  try {
    const res = await api.get("/ho-so-hoc-vien/me");
    hoSo.value = res.data || {};
  } catch (e) {
    hoSo.value = {};
  }
};

// Load payment info
const loadPayment = async () => {
  try {
    const res = await layThongTinThanhToan(matt);
    if (res.success) {
      payment.value = res.data;
      error.value = "";
    } else {
      error.value = res.message || "Không tìm thấy thông tin thanh toán";
    }
  } catch (e) {
    error.value = "Không tải được thông tin thanh toán";
  } finally {
    loading.value = false;
  }
};

const checkStatus = async () => {
  if (!matt) return;
  try {
    const res = await kiemTraTrangThaiThanhToan(matt);
    if (res.success && res.trangthai === "DA_THANH_TOAN") {
      payment.value = { ...payment.value, trangthai: "DA_THANH_TOAN" };
      confirmed.value = true;
      clearInterval(pollTimer);
    }
  } catch (e) {
    // ignore poll error
  }
};

const xacNhan = async () => {
  confirming.value = true;
  try {
    const res = await xacNhanThanhToan(matt);
    if (res.success) {
      payment.value = { ...payment.value, trangthai: "DA_THANH_TOAN" };
      confirmed.value = true;
      clearInterval(pollTimer);
    } else {
      error.value = res.message || "Xác nhận thất bại";
    }
  } catch (e) {
    error.value = "Xác nhận thất bại";
  } finally {
    confirming.value = false;
  }
};

onMounted(async () => {
  await Promise.all([loadProfile(), loadHoSo(), loadPayment()]);
  pollTimer = setInterval(checkStatus, 10000);
});

onUnmounted(() => {
  clearInterval(pollTimer);
});
</script>

<style scoped>
/* ===== Page ===== */
.payment-page {
  padding: 16px 0;
}

/* ===== Cards ===== */
.card {
  border: 1px solid #e9ecef;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
  background: #fff;
}

/* ===== Left column: Profile ===== */
.profile-card {
  overflow: hidden;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-initials {
  color: #fff;
  font-weight: 700;
  font-size: 22px;
}

.profile-header-info {
  flex: 1;
  min-width: 0;
}

.profile-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.badge-role {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: rgba(13, 110, 253, 0.1);
  color: #0d6efd;
  margin-bottom: 4px;
}

.profile-phone {
  font-size: 13px;
  color: #6c757d;
}

.profile-phone i {
  margin-right: 4px;
}

/* ===== Info sections ===== */
.info-section {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.info-section:last-of-type {
  border-bottom: none;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #6c757d;
  margin: 0 0 12px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 11px;
  color: #999;
}

.info-value {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
}

.badge-status {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
}

.badge-success {
  background: rgba(25, 135, 84, 0.1);
  color: #198754;
}

.badge-danger {
  background: rgba(220, 53, 69, 0.1);
  color: #dc3545;
}

.badge-warning {
  background: rgba(255, 193, 7, 0.15);
  color: #d4a017;
}

.badge-info {
  background: rgba(13, 202, 240, 0.1);
  color: #0cafec;
}

/* ===== Upload areas ===== */
.upload-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.upload-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 14px 10px;
  border: 1px dashed #d0d5dd;
  border-radius: 6px;
  background: #fafafa;
  font-size: 12px;
  color: #495057;
  text-align: center;
}

.upload-box i {
  font-size: 20px;
  color: #adb5bd;
}

.upload-link {
  font-size: 11px;
  color: #0d6efd;
  text-decoration: underline;
}

.upload-empty {
  font-size: 11px;
  color: #adb5bd;
}

/* ===== Profile footer ===== */
.profile-footer {
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

.btn-edit {
  width: 100%;
  padding: 8px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 6px;
}

/* ===== Right column: Payment ===== */
.payment-card {
  overflow: hidden;
}

.payment-header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.payment-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
}

/* ===== Course info ===== */
.course-info {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.course-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.course-row:last-child {
  margin-bottom: 0;
}

.course-label {
  font-size: 13px;
  color: #6c757d;
}

.course-value {
  font-size: 13px;
  font-weight: 600;
  color: #1a1a2e;
}

.course-amount {
  font-size: 20px;
  font-weight: 700;
  color: #0d6efd;
}

/* ===== QR Section ===== */
.qr-section {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.qr-wrap {
  width: 220px;
  height: 220px;
  margin: 0 auto 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  background: #fff;
  padding: 8px;
}

.qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.qr-code-label {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 2px;
}

.qr-hint {
  font-size: 11px;
  color: #adb5bd;
}

/* ===== Transaction info ===== */
.tx-info {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.tx-title {
  font-size: 13px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 12px 0;
}

.tx-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 16px;
}

.tx-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.tx-label {
  font-size: 11px;
  color: #999;
}

.tx-value {
  font-size: 13px;
  font-weight: 500;
  color: #1a1a2e;
}

.tx-value.mono {
  font-family: "Courier New", monospace;
  font-size: 12px;
  word-break: break-all;
}

.badge-tx {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  width: fit-content;
}

.badge-waiting {
  background: rgba(255, 193, 7, 0.15);
  color: #d4a017;
}

/* ===== Alert notice ===== */
.alert-notice {
  margin: 16px 24px 0;
  padding: 10px 14px;
  background: #e7f1ff;
  border-radius: 6px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #084298;
}

.alert-notice i {
  flex-shrink: 0;
  margin-top: 2px;
}

/* ===== Action area ===== */
.action-area {
  padding: 16px 24px 20px;
  text-align: center;
}

.btn-confirm {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: #198754;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-confirm:hover:not(:disabled) {
  background: #157347;
}

.btn-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.polling-note {
  margin-top: 8px;
  font-size: 12px;
  color: #adb5bd;
}

/* ===== Success icon ===== */
.success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(25, 135, 84, 0.12);
  color: #198754;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
}

/* ===== Responsive ===== */
@media (max-width: 991.98px) {
  .payment-page {
    padding: 12px 0;
  }

  .profile-header {
    padding: 16px 20px;
  }

  .info-section {
    padding: 14px 20px;
  }

  .upload-row {
    grid-template-columns: 1fr;
  }

  .tx-grid {
    grid-template-columns: 1fr;
  }

  .qr-wrap {
    width: 200px;
    height: 200px;
  }
}
</style>
