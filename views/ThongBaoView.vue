<template>
  <div>
    <SimpleTablePage
      title="Quản lý thông báo"
      subtitle="Thông báo gửi đến học viên và giáo viên"
      search-placeholder="Tìm kiếm thông báo..."
      endpoint="/thong-bao"
      id-key="matb"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="thongBaoModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa thông báo" : "Thêm thông báo" }}
            </h5>

            <button
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">
                Tiêu đề
              </label>

              <input
                class="form-control"
                v-model="form.tieude">
            </div>

            <div class="mb-3">

              <label class="form-label">
                Nội dung
              </label>

              <textarea
                rows="5"
                class="form-control"
                v-model="form.noidung">
              </textarea>

            </div>

            <div class="mb-3">

              <label class="form-label">
                Đối tượng
              </label>

              <select
                class="form-select"
                v-model="form.doituong">

                <option value="">
                  -- Chọn --
                </option>

                <option>
                  Học viên
                </option>

                <option>
                  Giáo viên
                </option>

                <option>
                  Tất cả
                </option>

              </select>

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
  { key: "matb", label: "Mã" },
  { key: "tieude", label: "Tiêu đề" },
  { key: "doituong", label: "Đối tượng" },
  { key: "ngaytao", label: "Ngày tạo" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  matb: null,
  tieude: "",
  noidung: "",
  doituong: "",
});
const loadData = async () => {
  try {
    rows.value = (await getAll("/thong-bao")).data;
  } catch (e) {
    console.log(e);
  }
};

const resetForm = () => {
  form.value = {
    matb: null,
    tieude: "",
    noidung: "",
    doituong: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("thongBaoModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("thongBaoModal")
  ).hide();
};

const openAdd = () => {
  isEdit.value = false;
  resetForm();
  openModal();
};

const openEdit = (row) => {
  isEdit.value = true;
  form.value = { ...row };
  openModal();
};

const saveData = async () => {

  const data = {
    matb: form.value.matb,
    tieude: form.value.tieude,
    noidung: form.value.noidung,
    doituong: form.value.doituong,
  };

  if (isEdit.value) {
    await updateData("/thong-bao", form.value.matb, data);
  } else {
    await createData("/thong-bao", data);
  }

  closeModal();
  await loadData();
};

onMounted(loadData);
</script>