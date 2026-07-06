<template>
  <SimpleTablePage
    title="Quản lý phòng thi"
    subtitle="Danh sách phòng thi sát hạch"
    search-placeholder="Tìm kiếm phòng thi..."
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import SimpleTablePage from "../components/common/SimpleTablePage.vue";

const columns = [
  { key: "maphongthi", label: "Mã phòng thi" },
  { key: "tenphongthi", label: "Tên phòng thi" },
  { key: "succhua", label: "Sức chứa" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = [
  {
    maphongthi: 1,
    tenphongthi: "Phòng thi 01",
    succhua: 30,
    trangthai: "Sẵn sàng",
  },
];
</script>