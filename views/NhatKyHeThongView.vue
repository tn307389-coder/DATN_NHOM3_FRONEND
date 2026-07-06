<template>
  <SimpleTablePage
    title="Nhật ký hệ thống"
    subtitle="Theo dõi lịch sử thao tác trong hệ thống"
    search-placeholder="Tìm kiếm hành động..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "mank", label: "Mã nhật ký" },
  { key: "taikhoan", label: "Tài khoản" },
  { key: "hanhdong", label: "Hành động" },
  { key: "bangtacdong", label: "Bảng tác động" },
  { key: "thoigian", label: "Thời gian" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = [
  {
    mank: 1,
    taikhoan: "admin",
    hanhdong: "Đăng nhập hệ thống",
    bangtacdong: "taikhoan",
    thoigian: "2026-07-06 16:30",
    ghichu: "Admin đăng nhập",
  },
];
</script>