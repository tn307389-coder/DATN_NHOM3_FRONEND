<template>
  <div>
    <SimpleTablePage
      title="Quản lý lịch học"
      subtitle="Danh sách lịch học của lớp, môn, giáo viên và phòng học"
      search-placeholder="Tìm kiếm lịch học..."
      endpoint="/lich-hoc"
      id-key="malich"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />
    <div class="modal fade" id="lichHocModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa lịch học" : "Thêm lịch học" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Lớp học</label>
                <select v-model="form.malop" class="form-select">
                  <option value="">-- Chọn lớp học --</option>
                  <option
                    v-for="lop in lopHocList"
                    :key="lop.malop"
                    :value="lop.malop"
                  >
                    {{ lop.tenlop }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Môn học</label>
                <select v-model="form.mamh" class="form-select">
                  <option value="">-- Chọn môn học --</option>
                  <option
                    v-for="mh in monHocList"
                    :key="mh.mamh"
                    :value="mh.mamh"
                  >
                    {{ mh.tenmonhoc }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
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
              <div class="col-md-6 mb-3">
                <label class="form-label">Phòng học</label>
                <select v-model="form.maphong" class="form-select">
                  <option value="">-- Chọn phòng học --</option>
                  <option
                    v-for="phong in phongHocList"
                    :key="phong.maphong"
                    :value="phong.maphong"
                  >
                    {{ phong.tenphong }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ca học</label>
                <select v-model="form.macahoc" class="form-select">
                  <option value="">-- Chọn ca học --</option>
                  <option
                    v-for="ca in caHocList"
                    :key="ca.macahoc"
                    :value="ca.macahoc"
                  >
                    {{ ca.tencahoc }} - {{ ca.giobatdau }} đến {{ ca.gioketthuc }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày học</label>
                <input
                  v-model="form.ngayhoc"
                  type="date"
                  class="form-control"
                />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea
                  v-model="form.ghichu"
                  class="form-control"
                  rows="3"
                  placeholder="Nhập ghi chú"
                ></textarea>
              </div>
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
  { key: "malich", label: "Mã lịch" },
  { key: "lop", label: "Lớp học" },
  { key: "monhoc", label: "Môn học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "phonghoc", label: "Phòng học" },
  { key: "cahoc", label: "Ca học" },
  { key: "ngayhoc", label: "Ngày học" },
  { key: "ghichu", label: "Ghi chú" },
];
const rows = ref([]);
const lopHocList = ref([]);
const monHocList = ref([]);
const giaoVienList = ref([]);
const phongHocList = ref([]);
const caHocList = ref([]);
const isEdit = ref(false);
const form = ref({
  malich: null,
  malop: "",
  mamh: "",
  magv: "",
  maphong: "",
  macahoc: "",
  ngayhoc: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/lich-hoc");
    rows.value = res.data.map((item) => ({
      malich: item.malich,
      lop: item.lopHoc?.tenlop || "",
      monhoc: item.monHoc?.tenmonhoc || "",
      giaovien: item.giaoVien?.hoten || "",
      phonghoc: item.phongHoc?.tenphong || "",
      cahoc: item.caHoc?.tencahoc || "",
      ngayhoc: item.ngayhoc,
      ghichu: item.ghichu,
      malop: item.lopHoc?.malop || "",
      mamh: item.monHoc?.mamh || "",
      magv: item.giaoVien?.magv || "",
      maphong: item.phongHoc?.maphong || "",
      macahoc: item.caHoc?.macahoc || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu lịch học");
  }
};
const loadLopHoc = async () => {
  const res = await getAll("/lop-hoc");
  lopHocList.value = res.data;
};
const loadMonHoc = async () => {
  const res = await getAll("/mon-hoc");
  monHocList.value = res.data;
};
const loadGiaoVien = async () => {
  const res = await getAll("/giao-vien");
  giaoVienList.value = res.data;
};
const loadPhongHoc = async () => {
  const res = await getAll("/phong-hoc");
  phongHocList.value = res.data;
};
const loadCaHoc = async () => {
  const res = await getAll("/ca-hoc");
  caHocList.value = res.data;
};
const resetForm = () => {
  form.value = {
    malich: null,
    malop: "",
    mamh: "",
    magv: "",
    maphong: "",
    macahoc: "",
    ngayhoc: "",
    ghichu: "",
  };
};
const openModal = () => {
  const modalElement = document.getElementById("lichHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};
const closeModal = () => {
  const modalElement = document.getElementById("lichHocModal");
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
    malich: row.malich,
    malop: row.malop,
    mamh: row.mamh,
    magv: row.magv,
    maphong: row.maphong,
    macahoc: row.macahoc,
    ngayhoc: row.ngayhoc,
    ghichu: row.ghichu,
  };
  openModal();
};
const saveData = async () => {
  if (!form.value.malop) {
    alert("Vui lòng chọn lớp học");
    return;
  }
  if (!form.value.mamh) {
    alert("Vui lòng chọn môn học");
    return;
  }
  if (!form.value.magv) {
    alert("Vui lòng chọn giáo viên");
    return;
  }
  if (!form.value.maphong) {
    alert("Vui lòng chọn phòng học");
    return;
  }
  if (!form.value.macahoc) {
    alert("Vui lòng chọn ca học");
    return;
  }
  if (!form.value.ngayhoc) {
    alert("Vui lòng chọn ngày học");
    return;
  }
  try {
    const data = {
      malich: form.value.malich,
      lopHoc: {
        malop: Number(form.value.malop),
      },
      monHoc: {
        mamh: Number(form.value.mamh),
      },
      giaoVien: {
        magv: Number(form.value.magv),
      },
      phongHoc: {
        maphong: Number(form.value.maphong),
      },
      caHoc: {
        macahoc: Number(form.value.macahoc),
      },
      ngayhoc: form.value.ngayhoc,
      ghichu: form.value.ghichu,
    };
    if (isEdit.value) {
      await updateData("/lich-hoc", form.value.malich, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/lich-hoc", data);
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
  await loadLopHoc();
  await loadMonHoc();
  await loadGiaoVien();
  await loadPhongHoc();
  await loadCaHoc();
  await loadData();
});
</script>
