<template>
  <div>
    <SimpleTablePage
      title="Quản lý bảng điểm thường xuyên"
      subtitle="Điểm quá trình của học viên"
      search-placeholder="Tìm kiếm..."
      endpoint="/bang-diem-thuong-xuyen"
      id-key="mabd"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="bangDiemModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa bảng điểm" : "Thêm bảng điểm" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">Học viên</label>

              <select
                class="form-select"
                v-model="form.mahv">

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

            <div class="mb-3">
              <label class="form-label">
                Môn học
              </label>

              <select
                class="form-select"
                v-model="form.mamh">

                <option value="">
                  -- Chọn môn học --
                </option>

                <option
                  v-for="mh in monHocList"
                  :key="mh.mamh"
                  :value="mh.mamh">

                  {{ mh.tenmonhoc }}

                </option>

              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">
                Điểm
              </label>

              <input
                type="number"
                step="0.1"
                class="form-control"
                v-model="form.diem">
            </div>

            <div class="mb-3">
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
  { key: "mabd", label: "Mã" },
  { key: "hocvien", label: "Học viên" },
  { key: "monhoc", label: "Môn học" },
  { key: "diem", label: "Điểm" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const hocVienList = ref([]);

const monHocList = ref([]);

const isEdit = ref(false);

const form = ref({
  mabd: null,
  mahv: "",
  mamh: "",
  diem: "",
  ghichu: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/bang-diem-thuong-xuyen");

    rows.value = res.data.map((item) => ({
      mabd: item.mabd,
      hocvien: item.hocVien?.hoten || "",
      monhoc: item.monHoc?.tenmonhoc || "",
      diem: item.diem,
      ghichu: item.ghichu,

      mahv: item.hocVien?.mahv,
      mamh: item.monHoc?.mamh,
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

const loadMonHoc = async () => {
  const res = await getAll("/mon-hoc");
  monHocList.value = res.data;
};

const resetForm = () => {
  form.value = {
    mabd: null,
    mahv: "",
    mamh: "",
    diem: "",
    ghichu: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("bangDiemModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("bangDiemModal")
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
    mabd: row.mabd,
    mahv: row.mahv,
    mamh: row.mamh,
    diem: row.diem,
    ghichu: row.ghichu,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.mahv) {
    alert("Vui lòng chọn học viên");
    return;
  }

  if (!form.value.mamh) {
    alert("Vui lòng chọn môn học");
    return;
  }

  if (form.value.diem === "") {
    alert("Vui lòng nhập điểm");
    return;
  }

  try {
    const data = {
      mabd: form.value.mabd,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      monHoc: {
        mamh: Number(form.value.mamh),
      },
      diem: Number(form.value.diem),
      ghichu: form.value.ghichu,
    };

    if (isEdit.value) {
      await updateData(
        "/bang-diem-thuong-xuyen",
        form.value.mabd,
        data
      );

      alert("Cập nhật thành công");
    } else {
      await createData(
        "/bang-diem-thuong-xuyen",
        data
      );

      alert("Thêm thành công");
    }

    closeModal();
    await loadData();

  } catch (e) {
    console.log(e);
    alert("Lưu thất bại");
  }
};

onMounted(async () => {
  await loadHocVien();
  await loadMonHoc();
  await loadData();
});
</script>