<template>
  <div>
    <SimpleTablePage
      title="Nhật ký hệ thống"
      subtitle="Lịch sử thao tác của người dùng"
      search-placeholder="Tìm kiếm..."
      endpoint="/nhat-ky-he-thong"
      id-key="id"
      :columns="columns"
      :rows="rows"
      :editable="false"
      :deletable="false"
      :addable="false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll } from "../services/crudService";

const columns = [
  { key: "mank", label: "Mã" },
  { key: "taikhoan", label: "Tài khoản" },
  { key: "hanhdong", label: "Hành động" },
  { key: "thoigian", label: "Thời gian" },
  { key: "ip", label: "IP" },
];

const rows = ref([]);
const loadData = async () => {
  try {
    const res = await getAll("/nhat-ky-he-thong");

    rows.value = res.data.map((item) => ({
      mank: item.mank,
      taikhoan: item.taiKhoan?.tendangnhap || "",
      hanhdong: item.hanhdong,
      thoigian: item.thoigian,
      ip: item.ip,
    }));
  } catch (e) {
    console.log(e);
  }
};

onMounted(loadData);
</script>