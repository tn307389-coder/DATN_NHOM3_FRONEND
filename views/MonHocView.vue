<template>
  <div>
    <SimpleTablePage
      title="Quản lý môn học"
      subtitle="Danh sách môn học lý thuyết và thực hành"
      search-placeholder="Tìm kiếm môn học..."
      endpoint="/mon-hoc"
      id-key="mamh"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="monHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa môn học" : "Thêm môn học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên môn học</label>
              <input
                v-model="form.tenmonhoc"
                class="form-control"
                placeholder="Nhập tên môn học"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Loại môn học</label>
              <select v-model="form.loaimonhoc" class="form-select">
                <option value="">-- Chọn loại môn --</option>
                <option value="Lý thuyết">Lý thuyết</option>
                <option value="Thực hành">Thực hành</option>
                <option value="Mô phỏng">Mô phỏng</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Số tiết</label>
              <input
                v-model="form.sotiet"
                type="number"
                class="form-control"
                placeholder="Nhập số tiết"
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
  { key: "mamh", label: "Mã môn" },
  { key: "tenmonhoc", label: "Tên môn học" },
  { key: "loaimonhoc", label: "Loại môn" },
  { key: "sotiet", label: "Số tiết" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  mamh: null,
  tenmonhoc: "",
  loaimonhoc: "",
  sotiet: "",
  ghichu: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/mon-hoc");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu môn học");
  }
};

const resetForm = () => {
  form.value = {
    mamh: null,
    tenmonhoc: "",
    loaimonhoc: "",
    sotiet: "",
    ghichu: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("monHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("monHocModal");
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
  if (!form.value.tenmonhoc) {
    alert("Vui lòng nhập tên môn học");
    return;
  }

  try {
    const data = {
      ...form.value,
      sotiet: Number(form.value.sotiet),
    };

    if (isEdit.value) {
      await updateData("/mon-hoc", form.value.mamh, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/mon-hoc", data);
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