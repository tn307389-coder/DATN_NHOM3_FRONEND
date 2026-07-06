<template>
  <SimpleTablePage
    title="Quản lý hạng GPLX"
    subtitle="Danh sách hạng giấy phép lái xe"
    search-placeholder="Tìm kiếm hạng GPLX..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "mahang", label: "Mã hạng" },
  { key: "tenhang", label: "Tên hạng" },
  { key: "mota", label: "Mô tả" },
];

const rows = [
  { mahang: 1, tenhang: "A1", mota: "Xe mô tô hai bánh" },
  { mahang: 2, tenhang: "B1", mota: "Xe ô tô số tự động" },
  { mahang: 3, tenhang: "B2", mota: "Xe ô tô số sàn" },
  { mahang: 4, tenhang: "C", mota: "Xe tải" },
];
</script>