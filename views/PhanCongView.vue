<template>
  <div>
    <SimpleTablePage
      title="Quản lý phân công"
      subtitle="Phân công giáo viên và xe tập lái cho học viên"
      search-placeholder="Tìm kiếm phân công..."
      endpoint="/phan-cong"
      id-key="mapc"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />
    <div class="modal fade" id="phanCongModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa phân công" : "Thêm phân công" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Học viên</label>
              <select v-model="form.mahv" class="form-select">
                <option value="">-- Chọn học viên --</option>
                <option
                  v-for="hv in hocVienList"
                  :key="hv.mahv"
                  :value="hv.mahv"
                >
                  {{ hv.hoten }} - {{ hv.cccd }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Giáo viên</label>
              <select v-model="form.magv" class="form-select">
                <option value="">-- Chọn giáo viên --</option>
                <option
                  v-for="gv in giaoVienList"
                  :key="gv.magv"
                  :value="gv.magv"
                >
                  {{ gv.hoten }} - {{ gv.hangday }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Xe tập lái</label>
              <select v-model="form.maxetl" class="form-select">
                <option value="">-- Chọn xe tập lái --</option>
                <option
                  v-for="xtl in xeTapLaiList"
                  :key="xtl.maxetl"
                  :value="xtl.maxetl"
                >
                  {{ xtl.xe?.bienso }} - {{ xtl.hangbang }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Ngày phân công</label>
              <input
                v-model="form.ngayphancong"
                type="date"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">Ghi chú</label>
              <textarea
                v-model="form.ghichu"
                class="form-control"
                rows="3"
                placeholder="Nhập ghi chú"
              ></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>
            <button class="btn btn-primary" @click="saveData">
              {{ isEdit ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import {
  getAll,
  createData,
  updateData,
} from "../services/crudService";
const columns = [
  { key: "mapc", label: "Mã PC" },
  { key: "hocvien", label: "Học viên" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "bienso", label: "Biển số xe" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "ngayphancong", label: "Ngày phân công" },
  { key: "ghichu", label: "Ghi chú" },
];
const rows = ref([]);
const hocVienList = ref([]);
const giaoVienList = ref([]);
const xeTapLaiList = ref([]);
const isEdit = ref(false);
const form = ref({
  mapc: null,
  mahv: "",
  magv: "",
  maxetl: "",
  ngayphancong: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/phan-cong");
    rows.value = res.data.map((item) => ({
      mapc: item.mapc,
      hocvien: item.hocVien?.hoten || "",
      giaovien: item.giaoVien?.hoten || "",
      bienso: item.xeTapLai?.xe?.bienso || "",
      hangbang: item.xeTapLai?.hangbang || "",
      ngayphancong: item.ngayphancong,
      ghichu: item.ghichu,
      mahv: item.hocVien?.mahv || "",
      magv: item.giaoVien?.magv || "",
      maxetl: item.xeTapLai?.maxetl || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu phân công");
  }
};
const loadHocVien = async () => {
  const res = await getAll("/hoc-vien");
  hocVienList.value = res.data;
};
const loadGiaoVien = async () => {
  const res = await getAll("/giao-vien");
  giaoVienList.value = res.data;
};
const loadXeTapLai = async () => {
  const res = await getAll("/xe-tap-lai");
  xeTapLaiList.value = res.data;
};
const resetForm = () => {
  form.value = {
    mapc: null,
    mahv: "",
    magv: "",
    maxetl: "",
    ngayphancong: "",
    ghichu: "",
  };
};
const openModal = () => {
  const modalElement = document.getElementById("phanCongModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};
const closeModal = () => {
  const modalElement = document.getElementById("phanCongModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.hide();
};
const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};
const openEdit = (row) => {
  isEdit.value = true;
  form.value = {
    mapc: row.mapc,
    mahv: row.mahv,
    magv: row.magv,
    maxetl: row.maxetl,
    ngayphancong: row.ngayphancong,
    ghichu: row.ghichu,
  };
  openModal();
};
const saveData = async () => {
  if (!form.value.mahv) {
    alert("Vui lòng chọn học viên");
    return;
  }
  if (!form.value.magv) {
    alert("Vui lòng chọn giáo viên");
    return;
  }
  if (!form.value.maxetl) {
    alert("Vui lòng chọn xe tập lái");
    return;
  }
  try {
    const data = {
      mapc: form.value.mapc,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      giaoVien: {
        magv: Number(form.value.magv),
      },
      xeTapLai: {
        maxetl: Number(form.value.maxetl),
      },
      ngayphancong: form.value.ngayphancong,
      ghichu: form.value.ghichu,
    };
    if (isEdit.value) {
      await updateData("/phan-cong", form.value.mapc, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/phan-cong", data);
      alert("Thêm thành công");
    }
    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};
onMounted(async () => {
  await loadHocVien();
  await loadGiaoVien();
  await loadXeTapLai();
  await loadData();
});
</script>
