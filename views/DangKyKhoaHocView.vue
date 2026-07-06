<template>
  <SimpleTablePage
    title="Quản lý đăng ký khóa học"
    subtitle="Danh sách học viên đăng ký khóa học"
    search-placeholder="Tìm kiếm học viên hoặc khóa học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "madk", label: "Mã đăng ký" },
  { key: "hocvien", label: "Học viên" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    madk: 1,
    hocvien: "Nguyễn Minh Khang",
    khoahoc: "Khóa B2 tháng 7/2026",
    ngaydangky: "2026-07-01",
    trangthai: "Đã đăng ký",
  },
];
</script>