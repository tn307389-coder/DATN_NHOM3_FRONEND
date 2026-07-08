<template>
  <SimpleTablePage
    title="Quản lý trả GPLX"
    subtitle="Theo dõi việc trả giấy phép lái xe cho học viên"
    search-placeholder="Tìm kiếm GPLX..."
    endpoint="/tra-gplx"
id-key="magplx"
@reload="loadData"
    :columns="columns"
    :rows="rows"
  />
</template>

<script setup>
import { onMounted, ref } from "vue";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll } from "../services/crudService";

const columns = [
  { key: "magplx", label: "Mã GPLX" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "sogplx", label: "Số GPLX" },
  { key: "hanggplx", label: "Hạng GPLX" },
  { key: "ngaycap", label: "Ngày cấp" },
  { key: "ngayhethan", label: "Ngày hết hạn" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const loadData = async () => {
  try {
    const res = await getAll("/tra-gplx");

    rows.value = res.data.map((item) => ({
      magplx: item.magplx,
      hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      sogplx: item.sogplx,
      hanggplx: item.hanggplx,
      ngaycap: item.ngaycap,
      ngayhethan: item.ngayhethan,
      trangthai: item.trangthai,
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu trả GPLX");
  }
};

onMounted(() => {
  loadData();
});
</script>