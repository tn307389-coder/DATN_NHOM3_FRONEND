<template>
  <div>
    <SimpleTablePage
      title="Quản lý hạng GPLX"
      subtitle="Danh sách hạng giấy phép lái xe"
      search-placeholder="Tìm kiếm hạng GPLX..."
      endpoint="/hang-gplx"
      id-key="mahang"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="hangGPLXModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa hạng GPLX" : "Thêm hạng GPLX" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên hạng</label>
              <input
                v-model="form.tenhang"
                class="form-control"
                placeholder="Ví dụ: A1, B1, B2, C"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea
                v-model="form.mota"
                class="form-control"
                rows="3"
                placeholder="Nhập mô tả"
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
  { key: "mahang", label: "Mã hạng" },
  { key: "tenhang", label: "Tên hạng" },
  { key: "mota", label: "Mô tả" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  mahang: null,
  tenhang: "",
  mota: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/hang-gplx");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu hạng GPLX");
  }
};

const resetForm = () => {
  form.value = {
    mahang: null,
    tenhang: "",
    mota: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("hangGPLXModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("hangGPLXModal");
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
  form.value = { ...row };
  openModal();
};

const saveData = async () => {
  if (!form.value.tenhang) {
    alert("Vui lòng nhập tên hạng");
    return;
  }

  try {
    if (isEdit.value) {
      await updateData("/hang-gplx", form.value.mahang, form.value);
      alert("Cập nhật thành công");
    } else {
      await createData("/hang-gplx", form.value);
      alert("Thêm thành công");
    }

    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};

onMounted(() => {
  loadData();
});
</script>