<template>
  <div>
    <SimpleTablePage
      title="Quản lý phòng thi"
      subtitle="Danh sách phòng thi sát hạch"
      search-placeholder="Tìm kiếm phòng thi..."
      endpoint="/phong-thi"
      id-key="maphongthi"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="phongThiModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa phòng thi" : "Thêm phòng thi" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal">
            </button>
          </div>

          <div class="modal-body">

            <div class="mb-3">
              <label class="form-label">
                Tên phòng
              </label>

              <input
                class="form-control"
                v-model="form.tenphong"
                placeholder="Nhập tên phòng">
            </div>

            <div class="mb-3">
              <label class="form-label">
                Sức chứa
              </label>

              <input
                type="number"
                class="form-control"
                v-model="form.succhua">
            </div>

            <div class="mb-3">
              <label class="form-label">
                Địa điểm
              </label>

              <input
                class="form-control"
                v-model="form.diadiem">
            </div>

            <div class="mb-3">
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
                  Hoạt động
                </option>

                <option>
                  Bảo trì
                </option>

                <option>
                  Ngừng sử dụng
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
  { key: "maphongthi", label: "Mã" },
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "diadiem", label: "Địa điểm" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  maphongthi: null,
  tenphong: "",
  succhua: "",
  diadiem: "",
  trangthai: "",
});
const loadData = async () => {
  try {
    const res = await getAll("/phong-thi");
    rows.value = res.data;
  } catch (e) {
    console.log(e);
    alert("Không tải được dữ liệu");
  }
};

const resetForm = () => {
  form.value = {
    maphongthi: null,
    tenphong: "",
    succhua: "",
    diadiem: "",
    trangthai: "",
  };
};

const openModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("phongThiModal")
  ).show();
};

const closeModal = () => {
  Modal.getOrCreateInstance(
    document.getElementById("phongThiModal")
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
    maphongthi: row.maphongthi,
    tenphong: row.tenphong,
    succhua: row.succhua,
    diadiem: row.diadiem,
    trangthai: row.trangthai,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.tenphong) {
    alert("Vui lòng nhập tên phòng");
    return;
  }

  if (!form.value.succhua) {
    alert("Vui lòng nhập sức chứa");
    return;
  }

  try {
    const data = {
      maphongthi: form.value.maphongthi,
      tenphong: form.value.tenphong,
      succhua: Number(form.value.succhua),
      diadiem: form.value.diadiem,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData(
        "/phong-thi",
        form.value.maphongthi,
        data
      );

      alert("Cập nhật thành công");
    } else {
      await createData(
        "/phong-thi",
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

onMounted(() => {
  loadData();
});
</script>