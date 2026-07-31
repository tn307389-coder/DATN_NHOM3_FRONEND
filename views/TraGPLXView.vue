<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-credit-card-2-front fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ tongGplx }}</h3><small class="opacity-75">Tổng GPLX</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ daTraCount }}</h3><small class="opacity-75">Đã trả</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#ffc107,#e0a800)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clock fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ choCount }}</h3><small class="opacity-75">Chờ trả</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý trả GPLX"
      subtitle="Theo dõi việc trả giấy phép lái xe cho học viên"
      search-placeholder="Tìm kiếm GPLX..."
      endpoint="/tra-gplx"
      id-key="magplx"
      :columns="columns"
      :rows="rows"
      :editable="false"
      :deletable="false"
      :addable="false"
    >
      <template #cell-trangthai="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="trangThaiBadge(value)">{{ value }}</span>
      </template>
      <template #cell-hanggplx="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="hangBadge(value)">{{ value }}</span>
      </template>
      <template #cell-cccd="{ value }">
        {{ maskCccd(value) }}
      </template>
      <template #cell-ngaycap="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-ngayhethan="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #empty-state>
        <i class="bi bi-credit-card-2-front display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có dữ liệu trả GPLX</p>
      </template>
    </SimpleTablePage>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll } from "../services/crudService";

const columns = [
  { key: "magplx", label: "Mã" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "sogplx", label: "Số GPLX" },
  { key: "hanggplx", label: "Hạng" },
  { key: "ngaycap", label: "Ngày cấp" },
  { key: "ngayhethan", label: "Hết hạn" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const tongGplx = computed(() => rows.value.length);
const daTraCount = computed(() => rows.value.filter((r) => r.trangthai?.toUpperCase().includes('ĐÃ TRẢ')).length);
const choCount = computed(() => rows.value.filter((r) => r.trangthai?.toUpperCase().includes('CHỜ')).length);

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const trangThaiBadge = (t) => {
  const u = (t || "").toUpperCase();
  if (u.includes("ĐÃ TRẢ") || u.includes("DA TRA")) return "bg-success bg-opacity-10 text-success";
  if (u.includes("CHỜ") || u.includes("CHO")) return "bg-warning bg-opacity-10 text-warning";
  return "bg-secondary bg-opacity-10 text-secondary";
};

const hangBadge = (h) => {
  const map = { A1: "bg-light text-secondary", A2: "bg-secondary bg-opacity-10 text-secondary", B1: "bg-primary bg-opacity-10 text-primary", B2: "bg-info bg-opacity-10 text-info", C: "bg-success bg-opacity-10 text-success", D: "bg-warning bg-opacity-10 text-warning", E: "bg-danger bg-opacity-10 text-danger" };
  return map[h] || "bg-light text-muted";
};

const loadData = async () => {
  try {
    const res = await getAll("/tra-gplx");
    rows.value = (res.data || []).map((item) => ({
      magplx: item.magplx, hocvien: item.hocVien?.hoten || "", cccd: item.hocVien?.cccd || "",
      sogplx: item.sogplx, hanggplx: item.hanggplx, ngaycap: item.ngaycap, ngayhethan: item.ngayhethan, trangthai: item.trangthai,
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

onMounted(loadData);
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
