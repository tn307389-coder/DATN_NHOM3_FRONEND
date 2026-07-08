<template>
  <div>
    <SimpleTablePage
      title="Quản lý phòng học"
      subtitle="Danh sách phòng học của trung tâm"
      search-placeholder="Tìm kiếm phòng học..."
      endpoint="/phong-hoc"
      id-key="maphong"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="phongHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa phòng học" : "Thêm phòng học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên phòng</label>
              <input
                v-model="form.tenphong"
                class="form-control"
                placeholder="Ví dụ: Phòng 101"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Sức chứa</label>
              <input
                v-model="form.succhua"
                type="number"
                class="form-control"
                placeholder="Nhập sức chứa"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangthai" class="form-select">
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang sử dụng">Đang sử dụng</option>
                <option value="Trống">Trống</option>
                <option value="Bảo trì">Bảo trì</option>
              </select>
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
  { key: "maphong", label: "Mã phòng" },
  { key: "tenphong", label: "Tên phòng" },
  { key: "succhua", label: "Sức chứa" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  maphong: null,
  tenphong: "",
  succhua: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/phong-hoc");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu phòng học");
  }
};

const resetForm = () => {
  form.value = {
    maphong: null,
    tenphong: "",
    succhua: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("phongHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("phongHocModal");
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
  if (!form.value.tenphong) {
    alert("Vui lòng nhập tên phòng");
    return;
  }

  try {
    const data = {
      ...form.value,
      succhua: form.value.succhua ? Number(form.value.succhua) : null,
    };

    if (isEdit.value) {
      await updateData("/phong-hoc", form.value.maphong, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/phong-hoc", data);
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