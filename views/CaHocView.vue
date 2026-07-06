<template>
  <SimpleTablePage
    title="Quản lý ca học"
    subtitle="Danh sách ca học trong ngày"
    search-placeholder="Tìm kiếm ca học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "macahoc", label: "Mã ca học" },
  { key: "tencahoc", label: "Tên ca học" },
  { key: "giobatdau", label: "Giờ bắt đầu" },
  { key: "gioketthuc", label: "Giờ kết thúc" },
];

const rows = [
  {
    macahoc: 1,
    tencahoc: "Ca sáng",
    giobatdau: "07:00",
    gioketthuc: "09:00",
  },
  {
    macahoc: 2,
    tencahoc: "Ca chiều",
    giobatdau: "13:30",
    gioketthuc: "15:30",
  },
];
</script>