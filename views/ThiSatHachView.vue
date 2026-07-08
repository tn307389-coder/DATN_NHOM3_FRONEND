<template>
  <SimpleTablePage
    title="Quản lý thi sát hạch"
    subtitle="Theo dõi danh sách học viên thi sát hạch"
    search-placeholder="Tìm kiếm thi sát hạch..."
    endpoint="/thi-sat-hach"
id-key="mathi"
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
  { key: "mathi", label: "Mã thi" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "lichthi", label: "Lịch thi" },
  { key: "ngaythi", label: "Ngày thi" },
  { key: "ketqua", label: "Kết quả" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const loadData = async () => {
  try {
    const res = await getAll("/thi-sat-hach");

    rows.value = res.data.map((item) => ({
      mathi: item.mathi,
      hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      lichthi: item.lichThi
        ? `${item.lichThi.ngaythi || ""} - ${item.lichThi.hangbang || ""}`
        : "",
      ngaythi: item.ngaythi,
      ketqua: item.ketqua,
      ghichu: item.ghichu,
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu thi sát hạch");
  }
};

onMounted(() => {
  loadData();
});
</script>