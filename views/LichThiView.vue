<template>
  <SimpleTablePage
    title="Quản lý lịch thi"
    subtitle="Danh sách lịch thi sát hạch"
    search-placeholder="Tìm kiếm lịch thi..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "malichthi", label: "Mã lịch thi" },
  { key: "ngaythi", label: "Ngày thi" },
  { key: "cathi", label: "Ca thi" },
  { key: "phongthi", label: "Phòng thi" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = [
  {
    malichthi: 1,
    ngaythi: "2026-08-01",
    cathi: "Ca thi sáng",
    phongthi: "Phòng thi 01",
    hangbang: "B2",
    ghichu: "Thi sát hạch hạng B2",
  },
];
</script>