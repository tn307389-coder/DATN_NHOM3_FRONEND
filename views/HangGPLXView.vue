<template>
  <div>
    <SimpleTablePage
      title="Quản lý hạng GPLX"
      subtitle="Danh sách hạng giấy phép lái xe"
      search-placeholder="Tìm kiếm hạng GPLX..."
      endpoint="/hang-gplx"
      id-key="id"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="hangGplxModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa hạng GPLX" : "Thêm hạng GPLX" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Mã hạng <span class="text-danger">*</span></label>
              <input v-model="form.maHang" class="form-control" placeholder="Ví dụ: B2" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Tên hạng <span class="text-danger">*</span></label>
              <input v-model="form.tenHang" class="form-control" placeholder="Ví dụ: Ô tô số sàn" required />
            </div>
            <div class="mb-3">
              <label class="form-label">Mô tả</label>
              <textarea v-model="form.moTa" class="form-control" rows="3" placeholder="Nhập mô tả"></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
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
import { getAll, createData, updateData } from "../services/crudService";
import { requiredError } from "../services/validation";

const columns = [
  { key: "id", label: "ID" },
  { key: "maHang", label: "Mã hạng" },
  { key: "tenHang", label: "Tên hạng" },
  { key: "moTa", label: "Mô tả" },
];

const rows = ref([]);
const isEdit = ref(false);

const form = ref({
  id: null,
  maHang: "",
  tenHang: "",
  moTa: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/hang-gplx");
    rows.value = res.data || [];
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu hạng GPLX");
  }
};

const resetForm = () => {
  form.value = { id: null, maHang: "", tenHang: "", moTa: "" };
};

const openModal = () => {
  const modal = Modal.getOrCreateInstance(document.getElementById("hangGplxModal"));
  modal.show();
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

const requiredFields = [
  { key: "maHang", label: "Mã hạng" },
  { key: "tenHang", label: "Tên hạng" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      id: form.value.id,
      maHang: form.value.maHang,
      tenHang: form.value.tenHang,
      moTa: form.value.moTa,
    };

    if (isEdit.value) {
      await updateData("/hang-gplx", form.value.id, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/hang-gplx", data);
      alert("Thêm thành công");
    }

    Modal.getOrCreateInstance(document.getElementById("hangGplxModal")).hide();
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
