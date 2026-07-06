<template>
  <SimpleTablePage
    title="Bảng điểm thường xuyên"
    subtitle="Quản lý điểm quá trình của học viên"
    search-placeholder="Tìm kiếm học viên hoặc môn học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "mabd", label: "Mã điểm" },
  { key: "hocvien", label: "Học viên" },
  { key: "monhoc", label: "Môn học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "diem", label: "Điểm" },
  { key: "nhanxet", label: "Nhận xét" },
];

const rows = [
  {
    mabd: 1,
    hocvien: "Nguyễn Minh Khang",
    monhoc: "Luật giao thông đường bộ",
    giaovien: "Nguyễn Văn An",
    diem: 8.5,
    nhanxet: "Nắm bài tốt",
  },
];
</script>