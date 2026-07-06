<template>
  <SimpleTablePage
    title="Quản lý thông báo"
    subtitle="Danh sách thông báo trong hệ thống"
    search-placeholder="Tìm kiếm thông báo..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "matb", label: "Mã thông báo" },
  { key: "tieude", label: "Tiêu đề" },
  { key: "nguoitao", label: "Người tạo" },
  { key: "ngaytao", label: "Ngày tạo" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    matb: 1,
    tieude: "Lịch thi tháng 8",
    nguoitao: "Quản trị viên",
    ngaytao: "2026-07-06",
    trangthai: "Hiển thị",
  },
];
</script>