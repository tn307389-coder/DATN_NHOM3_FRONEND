<template>
  <div>
    <SimpleTablePage
      title="Quản lý xe tập lái"
      subtitle="Danh sách xe được dùng để tập lái"
      search-placeholder="Tìm kiếm xe tập lái..."
      endpoint="/xe-tap-lai"
      id-key="maxetl"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="xeTapLaiModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa xe tập lái" : "Thêm xe tập lái" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Xe <span class="text-danger">*</span></label>
              <select v-model="form.maxe" class="form-select" required>
                <option value="">-- Chọn xe --</option>
                <option
                  v-for="xe in xeList"
                  :key="xe.maxe"
                  :value="xe.maxe"
                >
                  {{ xe.bienso }} - {{ xe.loaixe }} - {{ xe.hangxe }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Hạng bằng <span class="text-danger">*</span></label>
              <select v-model="form.hangbang" class="form-select" required>
                <option value="">-- Chọn hạng bằng --</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" required>
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
import { requiredError } from "../services/validation";

const columns = [
  { key: "maxetl", label: "Mã xe tập lái" },
  { key: "bienso", label: "Biển số" },
  { key: "loaixe", label: "Loại xe" },
  { key: "hangxe", label: "Hãng xe" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const xeList = ref([]);

const isEdit = ref(false);

const form = ref({
  maxetl: null,
  maxe: "",
  hangbang: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/xe-tap-lai");

    rows.value = res.data.map((item) => ({
      ...item,
      bienso: item.xe?.bienso || "",
      loaixe: item.xe?.loaixe || "",
      hangxe: item.xe?.hangxe || "",
      maxe: item.xe?.maxe || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu xe tập lái");
  }
};

const loadXe = async () => {
  try {
    const res = await getAll("/xe");
    xeList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu xe");
  }
};

const resetForm = () => {
  form.value = {
    maxetl: null,
    maxe: "",
    hangbang: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("xeTapLaiModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("xeTapLaiModal");
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
    maxetl: row.maxetl,
    maxe: row.maxe,
    hangbang: row.hangbang,
    trangthai: row.trangthai,
  };

  openModal();
};

const requiredFields = [
  { key: "maxe", label: "Xe" },
  { key: "hangbang", label: "Hạng bằng" },
  { key: "trangthai", label: "Trạng thái" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      maxetl: form.value.maxetl,
      xe: {
        maxe: Number(form.value.maxe),
      },
      hangbang: form.value.hangbang,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/xe-tap-lai", form.value.maxetl, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/xe-tap-lai", data);
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
  await loadXe();
  await loadData();
});
</script>