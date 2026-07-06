<template>
  <SimpleTablePage
    title="Quản lý môn học"
    subtitle="Danh sách môn học lý thuyết và thực hành"
    search-placeholder="Tìm kiếm môn học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "mamh", label: "Mã môn" },
  { key: "tenmonhoc", label: "Tên môn học" },
  { key: "loaimonhoc", label: "Loại môn" },
  { key: "sotiet", label: "Số tiết" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = [
  {
    mamh: 1,
    tenmonhoc: "Luật giao thông đường bộ",
    loaimonhoc: "Lý thuyết",
    sotiet: 10,
    ghichu: "Môn học bắt buộc",
  },
  {
    mamh: 2,
    tenmonhoc: "Thực hành sa hình",
    loaimonhoc: "Thực hành",
    sotiet: 20,
    ghichu: "Thực hành trên sân",
  },
];
</script>