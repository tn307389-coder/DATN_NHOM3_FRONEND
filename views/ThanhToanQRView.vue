<template>
  <div class="payment-qr-page">
    <div class="payment-card">
      <div class="text-center mb-3">
        <img src="/logo1.jpg" alt="Logo" class="payment-logo" />
        <h4 class="fw-bold mt-2 mb-0">Thanh toán học phần</h4>
        <p class="small text-muted mb-0">DriveHub - Trung tâm đào tạo lái xe</p>
      </div>

      <!-- Đang tải -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="text-muted mt-3 mb-0">Đang tải thông tin thanh toán...</p>
      </div>

      <!-- Lỗi -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-x-octagon display-4 text-danger"></i>
        <p class="text-danger mt-3 mb-0">{{ error }}</p>
        <button class="btn btn-outline-secondary mt-3" @click="back">
          <i class="bi bi-arrow-left me-1"></i> Quay lại
        </button>
      </div>

      <!-- Đã thanh toán -->
      <div v-else-if="payment && payment.trangthai === 'DA_THANH_TOAN'" class="text-center py-4">
        <div class="success-icon mx-auto mb-3">
          <i class="bi bi-check-lg"></i>
        </div>
        <h5 class="fw-bold text-success">Thanh toán thành công!</h5>
        <p class="text-muted mb-1">Học phần: <strong>{{ payment.tenKhoaHoc }}</strong></p>
        <p class="text-muted mb-4">Số tiền: <strong>{{ formatMoney(payment.sotien) }}</strong></p>
        <button class="btn btn-primary px-4" @click="back">
          <i class="bi bi-house me-1"></i> Về trang chủ
        </button>
      </div>

      <!-- Chưa thanh toán: hiển thị QR -->
      <div v-else>
        <div class="card border-0 shadow-sm rounded-4 mb-3">
          <div class="card-body text-center py-4">
            <div class="qr-wrap mx-auto mb-3">
              <img v-if="payment.qrBase64" :src="'data:image/png;base64,' + payment.qrBase64" alt="Mã QR thanh toán" class="qr-img" />
              <div v-else class="spinner-border text-primary" role="status"></div>
            </div>
            <div class="fw-bold fs-4 text-primary">{{ formatMoney(payment.sotien) }}</div>
            <div class="text-muted small">Học phần: {{ payment.tenKhoaHoc }}</div>
            <div class="text-muted small">Học viên: {{ payment.hoten }}</div>
          </div>
        </div>

        <div class="alert alert-warning border-0 rounded-4 small d-flex align-items-start gap-2">
          <i class="bi bi-info-circle-fill fs-5"></i>
          <div>
            Quét mã QR bằng ứng dụng ngân hàng / ví điện tử (MoMo, ZaloPay, VNPAY) để thanh toán.<br />
            <strong class="d-block mt-1">Giao dịch: {{ payment.transactionRef }}</strong>
          </div>
        </div>

        <div class="d-grid gap-2">
          <button class="btn btn-success py-2 rounded-3" @click="xacNhan" :disabled="confirming">
            <span v-if="confirming" class="spinner-border spinner-border-sm me-1"></span>
            <i v-else class="bi bi-check-circle me-1"></i> Tôi đã thanh toán
          </button>
          <button class="btn btn-outline-secondary rounded-3" @click="back">
            <i class="bi bi-arrow-left me-1"></i> Quay lại
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useSite } from "../composables/useSite";

const route = useRoute();
const router = useRouter();
const { layThongTinThanhToan, kiemTraTrangThaiThanhToan, xacNhanThanhToan } = useSite();

const matt = Number(route.params.matt);
const loading = ref(true);
const error = ref("");
const payment = ref(null);
const confirming = ref(false);
let pollTimer = null;

const formatMoney = (n) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n || 0);
};

const back = () => {
  router.push("/hv-portal");
};

const loadInfo = async () => {
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
      clearInterval(pollTimer);
    }
  } catch (e) {
    // bỏ qua lỗi poll
  }
};

const xacNhan = async () => {
  confirming.value = true;
  try {
    const res = await xacNhanThanhToan(matt);
    if (res.success) {
      payment.value = { ...payment.value, trangthai: "DA_THANH_TOAN" };
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

onMounted(() => {
  loadInfo();
  pollTimer = setInterval(checkStatus, 10000);
});

onUnmounted(() => {
  clearInterval(pollTimer);
});
</script>

<style scoped>
.payment-qr-page {
  min-height: calc(100vh - 120px);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px 0;
}

.payment-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  border: 1px solid #eef2f7;
}

.payment-logo {
  width: 64px;
  height: 64px;
  border-radius: 14px;
  object-fit: cover;
  border: 2px solid rgba(212, 168, 83, 0.4);
}

.qr-wrap {
  width: 260px;
  height: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 16px;
  padding: 10px;
}

.qr-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

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
</style>
