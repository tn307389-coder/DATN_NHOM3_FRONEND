<template>
  <div>
    <SimpleTablePage
      title="Quản lý ca học"
      subtitle="Danh sách ca học trong ngày"
      search-placeholder="Tìm kiếm ca học..."
      endpoint="/ca-hoc"
      id-key="macahoc"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="caHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa ca học" : "Thêm ca học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên ca học</label>
              <input
                v-model="form.tencahoc"
                class="form-control"
                placeholder="Ví dụ: Ca sáng, Ca chiều"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Giờ bắt đầu</label>
              <input
                v-model="form.giobatdau"
                type="time"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Giờ kết thúc</label>
              <input
                v-model="form.gioketthuc"
                type="time"
                class="form-control"
              />
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
  { key: "macahoc", label: "Mã ca học" },
  { key: "tencahoc", label: "Tên ca học" },
  { key: "giobatdau", label: "Giờ bắt đầu" },
  { key: "gioketthuc", label: "Giờ kết thúc" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  macahoc: null,
  tencahoc: "",
  giobatdau: "",
  gioketthuc: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/ca-hoc");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu ca học");
  }
};

const resetForm = () => {
  form.value = {
    macahoc: null,
    tencahoc: "",
    giobatdau: "",
    gioketthuc: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("caHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("caHocModal");
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
  if (!form.value.tencahoc) {
    alert("Vui lòng nhập tên ca học");
    return;
  }

  if (!form.value.giobatdau || !form.value.gioketthuc) {
    alert("Vui lòng nhập đầy đủ giờ bắt đầu và giờ kết thúc");
    return;
  }

  try {
    if (isEdit.value) {
      await updateData("/ca-hoc", form.value.macahoc, form.value);
      alert("Cập nhật thành công");
    } else {
      await createData("/ca-hoc", form.value);
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