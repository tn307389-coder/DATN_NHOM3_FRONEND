<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-12">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-journal-text fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng nhật ký</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Nhật ký hệ thống"
      subtitle="Lịch sử thao tác của người dùng"
      search-placeholder="Tìm kiếm..."
      endpoint="/nhat-ky-he-thong"
      id-key="mank"
      :columns="columns"
      :rows="rows"
      :editable="false"
      :deletable="false"
      :addable="false"
    >
      <template #cell-hanhdong="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hanhDongBadge(value)">{{ value }}</span>
      </template>
      <template #cell-thoigian="{ value }">
        {{ formatDateTime(value) }}
      </template>
      <template #cell-chitiet="{ value }">
        {{ value && value.length > 50 ? value.slice(0,50) + '...' : value || '' }}
      </template>
      <template #extra-actions="{ row }">
        <button class="btn btn-sm btn-outline-info rounded-circle" title="Xem chi tiết" @click="openDetail(row)">
          <i class="bi bi-eye"></i>
        </button>
      </template>
      <template #empty-state>
        <i class="bi bi-journal-text display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có nhật ký nào</p>
      </template>
    </SimpleTablePage>

    <div class="modal fade" id="logDetailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden" v-if="detail">
          <div class="modal-header border-bottom-0" style="background:linear-gradient(135deg,#0d6efd,#2563eb);color:#fff">
            <h5 class="modal-title fw-bold"><i class="bi bi-journal-text me-2"></i>Chi tiết nhật ký</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <table class="table table-sm" style="border-collapse:separate;border-spacing:0 6px">
              <tbody>
                <tr><td class="text-muted fw-semibold border-0 ps-0" style="width:110px"><i class="bi bi-person me-1"></i>TK</td><td class="border-0">{{ detail.taikhoan }}</td></tr>
                <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-lightning me-1"></i>Hành động</td><td class="border-0"><span class="badge rounded-pill px-3 py-2" :class="hanhDongBadge(detail.hanhdong)">{{ detail.hanhdong }}</span></td></tr>
                <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-chat me-1"></i>Chi tiết</td><td class="border-0">{{ detail.chitiet || '—' }}</td></tr>
                <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-clock me-1"></i>Thời gian</td><td class="border-0">{{ formatDateTime(detail.thoigian) }}</td></tr>
                <tr><td class="text-muted fw-semibold border-0 ps-0"><i class="bi bi-globe me-1"></i>IP</td><td class="border-0"><code>{{ detail.ip || '—' }}</code></td></tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer border-top-0 px-4 pb-4">
            <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Đóng</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll } from "../services/crudService";

const columns = [
  { key: "mank", label: "Mã" },
  { key: "taikhoan", label: "TK" },
  { key: "hanhdong", label: "Hành động" },
  { key: "chitiet", label: "Chi tiết" },
  { key: "thoigian", label: "Thời gian" },
  { key: "ip", label: "IP" },
];

const rows = ref([]);
const detail = ref(null);

const formatDateTime = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
};

const hanhDongBadge = (v) => {
  const u = (v || "").toUpperCase();
  if (u.includes("ĐĂNG NHẬP") || u.includes("LOGIN")) return "bg-primary bg-opacity-10 text-primary";
  if (u.includes("THÊM") || u.includes("CREATE") || u.includes("ADD")) return "bg-success bg-opacity-10 text-success";
  if (u.includes("SỬA") || u.includes("UPDATE") || u.includes("EDIT")) return "bg-warning bg-opacity-10 text-warning";
  if (u.includes("XÓA") || u.includes("DELETE") || u.includes("REMOVE")) return "bg-danger bg-opacity-10 text-danger";
  return "bg-secondary bg-opacity-10 text-secondary";
};

const loadData = async () => {
  try {
    const res = await getAll("/nhat-ky-he-thong");
    rows.value = (res.data || []).map((item) => ({
      mank: item.mank, taikhoan: item.taiKhoan?.tendangnhap || "",
      hanhdong: item.hanhdong, chitiet: item.chiTiet, thoigian: item.thoigian, ip: item.ip,
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

const openDetail = (row) => {
  detail.value = row;
  Modal.getOrCreateInstance(document.getElementById("logDetailModal")).show();
};

onMounted(loadData);
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
