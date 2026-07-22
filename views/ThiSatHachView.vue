<template>
  <div>
    <div class="row g-3 mb-4">
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#0d6efd,#0a58ca)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-clipboard-data fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ rows.length }}</h3><small class="opacity-75">Tổng thi</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#198754,#146c43)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-check-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('ĐẬU') }}</h3><small class="opacity-75">Đạt</small></div>
          </div>
        </div>
      </div>
      <div class="col-md-4 col-6">
        <div class="card border-0 shadow-sm rounded-4" style="background:linear-gradient(135deg,#dc3545,#b82d3f)">
          <div class="card-body d-flex align-items-center gap-3 p-3 text-white">
            <div class="rounded-3 bg-white bg-opacity-25 p-3"><i class="bi bi-x-circle fs-4"></i></div>
            <div><h3 class="mb-0 fw-bold">{{ filterCount('KHÔNG ĐẠT') }}</h3><small class="opacity-75">Không đạt</small></div>
          </div>
        </div>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý thi sát hạch"
      subtitle="Theo dõi danh sách học viên thi sát hạch"
      search-placeholder="Tìm kiếm thi sát hạch..."
      endpoint="/thi-sat-hach"
      id-key="mathi"
      :columns="columns"
      :rows="rows"
    >
      <template #cell-ketqua="{ value }">
        <span class="badge rounded-pill px-3 py-2" :class="ketquaBadge(value)">{{ value || '—' }}</span>
      </template>
      <template #cell-cccd="{ value }">
        {{ maskCccd(value) }}
      </template>
      <template #cell-ngaythi="{ value }">
        {{ formatDate(value) }}
      </template>
      <template #cell-ghichu="{ value }">
        {{ value && value.length > 50 ? value.slice(0,50) + '...' : value || '' }}
      </template>
      <template #empty-state>
        <i class="bi bi-clipboard-data display-1 text-muted"></i>
        <p class="text-muted mt-2 mb-0">Chưa có dữ liệu thi sát hạch</p>
      </template>
    </SimpleTablePage>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll } from "../services/crudService";

const columns = [
  { key: "mathi", label: "Mã thi" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "lichthi", label: "Lịch thi" },
  { key: "ngaythi", label: "Ngày thi" },
  { key: "ketqua", label: "Kết quả" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const filterCount = (s) => rows.value.filter((r) => r.ketqua === s).length;

const formatDate = (d) => {
  if (!d) return "";
  return new Date(d + "T00:00:00").toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const maskCccd = (cccd) => {
  if (!cccd) return "";
  if (cccd.length <= 4) return "****";
  return cccd.slice(0, 2) + "****" + cccd.slice(-2);
};

const ketquaBadge = (t) => {
  if (!t) return "bg-secondary bg-opacity-10 text-secondary";
  const u = t.toUpperCase();
  if (u === "ĐẬU" || u === "DAT") return "bg-success bg-opacity-10 text-success";
  return "bg-danger bg-opacity-10 text-danger";
};

const loadData = async () => {
  try {
    const res = await getAll("/thi-sat-hach");
    rows.value = (res.data || []).map((item) => ({
      mathi: item.mathi, hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      lichthi: item.lichThi ? `${item.lichThi.ngaythi || ""} - ${item.lichThi.hangbang || ""}` : "",
      ngaythi: item.ngaythi, ketqua: item.ketqua, ghichu: item.ghichu,
    }));
  } catch (e) { console.log(e); window.$toast?.add("Không thể tải dữ liệu", "error"); }
};

onMounted(loadData);
</script>

<style scoped>
.card { transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important; }
</style>
