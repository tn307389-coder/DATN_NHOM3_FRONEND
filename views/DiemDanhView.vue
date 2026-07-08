<template>
  <div>
    <SimpleTablePage
      title="Quản lý điểm danh"
      subtitle="Theo dõi điểm danh học viên"
      search-placeholder="Tìm kiếm điểm danh..."
      endpoint="/diem-danh"
      id-key="madd"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="diemDanhModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa điểm danh" : "Thêm điểm danh" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="row">

              <div class="col-md-6 mb-3">
                <label class="form-label">Học viên</label>

                <select
                  v-model="form.mahv"
                  class="form-select">

                  <option value="">
                    -- Chọn học viên --
                  </option>

                  <option
                    v-for="hv in hocVienList"
                    :key="hv.mahv"
                    :value="hv.mahv">

                    {{ hv.hoten }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Lịch học
                </label>

                <select
                  v-model="form.malich"
                  class="form-select">

                  <option value="">
                    -- Chọn lịch học --
                  </option>

                  <option
                    v-for="lh in lichHocList"
                    :key="lh.malich"
                    :value="lh.malich">

                    {{ lh.ngayhoc }} -
                    {{ lh.monHoc?.tenmonhoc }}

                  </option>

                </select>

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Ngày điểm danh
                </label>

                <input
                  type="date"
                  class="form-control"
                  v-model="form.ngaydiemdanh">

              </div>

              <div class="col-md-6 mb-3">

                <label class="form-label">
                  Trạng thái
                </label>

                <select
                  class="form-select"
                  v-model="form.trangthai">

                  <option value="">
                    -- Chọn --
                  </option>

                  <option>
                    Có mặt
                  </option>

                  <option>
                    Vắng
                  </option>

                  <option>
                    Đi trễ
                  </option>

                  <option>
                    Có phép
                  </option>

                </select>

              </div>

              <div class="col-12">

                <label class="form-label">
                  Ghi chú
                </label>

                <textarea
                  rows="3"
                  class="form-control"
                  v-model="form.ghichu">
                </textarea>

              </div>

            </div>

          </div>

          <div class="modal-footer">

            <button
              class="btn btn-secondary"
              data-bs-dismiss="modal">

              Hủy

            </button>

            <button
              class="btn btn-primary"
              @click="saveData">

              {{ isEdit ? "Cập nhật" : "Thêm mới" }}

            </button>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";

import SimpleTablePage from "../components/common/SimpleTablePage.vue";

import {
  getAll,
  createData,
  updateData,
} from "../services/crudService";

const columns = [
  { key: "madd", label: "Mã" },
  { key: "hocvien", label: "Học viên" },
  { key: "lichhoc", label: "Lịch học" },
  { key: "ngaydiemdanh", label: "Ngày" },
  { key: "trangthai", label: "Trạng thái" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const hocVienList = ref([]);

const lichHocList = ref([]);

const isEdit = ref(false);

const form = ref({
  madd: null,
  mahv: "",
  malich: "",
  ngaydiemdanh: "",
  trangthai: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/diem-danh");

    rows.value = res.data.map((item) => ({
      madd: item.madd,
      hocvien: item.hocVien?.hoten || "",
      lichhoc: `${item.lichHoc?.ngayhoc || ""} - ${
        item.lichHoc?.monHoc?.tenmonhoc || ""
      }`,
      ngaydiemdanh: item.ngaydiemdanh,
      trangthai: item.trangthai,
      ghichu: item.ghichu,

      mahv: item.hocVien?.mahv,
      malich: item.lichHoc?.malich,
    }));
  } catch (e) {
    console.log(e);
    alert("Không tải được dữ liệu");
  }
};

const loadHocVien = async () => {
  const res = await getAll("/hoc-vien");
  hocVienList.value = res.data;
};

const loadLichHoc = async () => {
  const res = await getAll("/lich-hoc");
  lichHocList.value = res.data;
};

const resetForm = () => {
  form.value = {
    madd: null,
    mahv: "",
    malich: "",
    ngaydiemdanh: "",
    trangthai: "",
    ghichu: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("diemDanhModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("diemDanhModal")
  ).hide();
};

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (row) => {
  isEdit.value = true;

  form.value = {
    madd: row.madd,
    mahv: row.mahv,
    malich: row.malich,
    ngaydiemdanh: row.ngaydiemdanh,
    trangthai: row.trangthai,
    ghichu: row.ghichu,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.mahv) {
    alert("Chọn học viên");
    return;
  }

  if (!form.value.malich) {
    alert("Chọn lịch học");
    return;
  }

  try {
    const data = {
      madd: form.value.madd,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      lichHoc: {
        malich: Number(form.value.malich),
      },
      ngaydiemdanh: form.value.ngaydiemdanh,
      trangthai: form.value.trangthai,
      ghichu: form.value.ghichu,
    };

    if (isEdit.value) {
      await updateData("/diem-danh", form.value.madd, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/diem-danh", data);
      alert("Thêm thành công");
    }

    closeModal();
    loadData();
  } catch (e) {
    console.log(e);
    alert("Lưu thất bại");
  }
};

onMounted(async () => {
  await loadHocVien();
  await loadLichHoc();
  await loadData();
});
</script>