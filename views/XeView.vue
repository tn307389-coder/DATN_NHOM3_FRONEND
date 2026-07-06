<template>
  <SimpleTablePage
    title="Quản lý xe"
    subtitle="Danh sách xe của trung tâm"
    search-placeholder="Tìm kiếm xe..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "maxe", label: "Mã xe" },
  { key: "bienso", label: "Biển số" },
  { key: "loaixe", label: "Loại xe" },
  { key: "hangxe", label: "Hãng xe" },
  { key: "namsanxuat", label: "Năm sản xuất" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    maxe: 1,
    bienso: "51A-12345",
    loaixe: "Xe số sàn",
    hangxe: "Toyota Vios",
    namsanxuat: 2020,
    trangthai: "Đang sử dụng",
  },
  {
    maxe: 2,
    bienso: "51A-67890",
    loaixe: "Xe tải",
    hangxe: "Hyundai",
    namsanxuat: 2019,
    trangthai: "Bảo trì",
  },
];
</script>