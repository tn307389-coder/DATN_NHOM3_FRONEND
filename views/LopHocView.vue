<template>
  <SimpleTablePage
    title="Quản lý lớp học"
    subtitle="Danh sách lớp học theo từng khóa"
    search-placeholder="Tìm kiếm lớp học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "malop", label: "Mã lớp" },
  { key: "tenlop", label: "Tên lớp" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "soluong", label: "Số lượng" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    malop: 1,
    tenlop: "Lớp B2-01",
    khoahoc: "Khóa B2 tháng 7/2026",
    giaovien: "Nguyễn Văn An",
    soluong: 30,
    trangthai: "Đang học",
  },
];
</script>