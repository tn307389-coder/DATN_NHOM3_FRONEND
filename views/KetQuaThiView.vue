<template>
  <SimpleTablePage
    title="Quản lý kết quả thi"
    subtitle="Theo dõi kết quả thi của học viên"
    search-placeholder="Tìm kiếm học viên..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "makq", label: "Mã kết quả" },
  { key: "hocvien", label: "Học viên" },
  { key: "lichthi", label: "Lịch thi" },
  { key: "diemlythuyet", label: "Điểm lý thuyết" },
  { key: "diemthuchanh", label: "Điểm thực hành" },
  { key: "ketqua", label: "Kết quả" },
];

const rows = [
  {
    makq: 1,
    hocvien: "Nguyễn Minh Khang",
    lichthi: "2026-08-01 - B2",
    diemlythuyet: 9,
    diemthuchanh: 8.5,
    ketqua: "Đạt",
  },
];
</script>