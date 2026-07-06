<template>
  <SimpleTablePage
    title="Quản lý khóa học"
    subtitle="Danh sách khóa học đang mở"
    search-placeholder="Tìm kiếm khóa học..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "makh", label: "Mã khóa" },
  { key: "tenkhoahoc", label: "Tên khóa học" },
  { key: "chuongtrinh", label: "Chương trình" },
  { key: "ngaybatdau", label: "Ngày bắt đầu" },
  { key: "ngayketthuc", label: "Ngày kết thúc" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    makh: 1,
    tenkhoahoc: "Khóa B2 tháng 7/2026",
    chuongtrinh: "Đào tạo lái xe hạng B2",
    ngaybatdau: "2026-07-01",
    ngayketthuc: "2026-10-01",
    trangthai: "Đang mở",
  },
];
</script>