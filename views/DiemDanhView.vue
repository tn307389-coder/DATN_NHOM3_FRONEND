<template>
  <SimpleTablePage
    title="Quản lý điểm danh"
    subtitle="Theo dõi tình trạng đi học của học viên"
    search-placeholder="Tìm kiếm học viên..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "madd", label: "Mã điểm danh" },
  { key: "lichhoc", label: "Lịch học" },
  { key: "hocvien", label: "Học viên" },
  { key: "trangthai", label: "Trạng thái" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = [
  {
    madd: 1,
    lichhoc: "Luật giao thông - 2026-07-01",
    hocvien: "Nguyễn Minh Khang",
    trangthai: "Có mặt",
    ghichu: "",
  },
  {
    madd: 2,
    lichhoc: "Luật giao thông - 2026-07-01",
    hocvien: "Phạm Quốc Huy",
    trangthai: "Vắng",
    ghichu: "Có phép",
  },
];
</script>