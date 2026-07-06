<template>
  <SimpleTablePage
    title="Quản lý ca thi"
    subtitle="Danh sách ca thi trong ngày"
    search-placeholder="Tìm kiếm ca thi..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "macathi", label: "Mã ca thi" },
  { key: "tencathi", label: "Tên ca thi" },
  { key: "giobatdau", label: "Giờ bắt đầu" },
  { key: "gioketthuc", label: "Giờ kết thúc" },
];

const rows = [
  {
    macathi: 1,
    tencathi: "Ca thi sáng",
    giobatdau: "08:00",
    gioketthuc: "10:00",
  },
];
</script>