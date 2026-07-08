<template>
  <div>
    <SimpleTablePage
      title="Quản lý xe"
      subtitle="Danh sách xe của trung tâm"
      search-placeholder="Tìm kiếm xe..."
      endpoint="/xe"
      id-key="maxe"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="xeModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa xe" : "Thêm xe" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Biển số</label>
              <input
                v-model="form.bienso"
                class="form-control"
                placeholder="Ví dụ: 51A-12345"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Loại xe</label>
              <input
                v-model="form.loaixe"
                class="form-control"
                placeholder="Ví dụ: Xe số sàn, xe tải"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Hãng xe</label>
              <input
                v-model="form.hangxe"
                class="form-control"
                placeholder="Ví dụ: Toyota Vios"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Năm sản xuất</label>
              <input
                v-model="form.namsanxuat"
                type="number"
                class="form-control"
                placeholder="Ví dụ: 2020"
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
  { key: "maxe", label: "Mã xe" },
  { key: "bienso", label: "Biển số" },
  { key: "loaixe", label: "Loại xe" },
  { key: "hangxe", label: "Hãng xe" },
  { key: "namsanxuat", label: "Năm sản xuất" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  maxe: null,
  bienso: "",
  loaixe: "",
  hangxe: "",
  namsanxuat: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/xe");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu xe");
  }
};

const resetForm = () => {
  form.value = {
    maxe: null,
    bienso: "",
    loaixe: "",
    hangxe: "",
    namsanxuat: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("xeModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("xeModal");
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
  if (!form.value.bienso) {
    alert("Vui lòng nhập biển số xe");
    return;
  }

  try {
    const data = {
      ...form.value,
      namsanxuat: form.value.namsanxuat
        ? Number(form.value.namsanxuat)
        : null,
    };

    if (isEdit.value) {
      await updateData("/xe", form.value.maxe, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/xe", data);
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