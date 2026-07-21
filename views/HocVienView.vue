<template>
  <div>
    <SimpleTablePage
      title="Quản lý học viên"
      subtitle="Danh sách học viên của trung tâm"
      search-placeholder="Tìm kiếm học viên..."
      endpoint="/hoc-vien"
      id-key="mahv"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="hocVienModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa học viên" : "Thêm học viên" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Họ tên <span class="text-danger">*</span></label>
                <input
                  v-model="form.hoten"
                  class="form-control"
                  placeholder="Nhập họ tên học viên"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày sinh <span class="text-danger">*</span></label>
                <input
                  v-model="form.ngaysinh"
                  type="date"
                  class="form-control"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Giới tính <span class="text-danger">*</span></label>
                <select v-model="form.gioitinh" class="form-select" required>
                  <option value="">-- Chọn giới tính --</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                </select>
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">CCCD <span class="text-danger">*</span></label>
                <input
                  v-model="form.cccd"
                  class="form-control"
                  placeholder="Nhập số CCCD"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Số điện thoại <span class="text-danger">*</span></label>
                <input
                  v-model="form.sodienthoai"
                  class="form-control"
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div class="col-md-6 mb-3">
                <label class="form-label">Email <span class="text-danger">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div class="col-md-12 mb-3">
                <label class="form-label">Địa chỉ <span class="text-danger">*</span></label>
                <textarea
                  v-model="form.diachi"
                  class="form-control"
                  rows="3"
                  placeholder="Nhập địa chỉ"
                  required
                ></textarea>
              </div>
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
  { key: "mahv", label: "Mã HV" },
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "cccd", label: "CCCD" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "diachi", label: "Địa chỉ" },
];

const rows = ref([]);

const isEdit = ref(false);

const form = ref({
  mahv: null,
  hoten: "",
  ngaysinh: "",
  gioitinh: "",
  cccd: "",
  sodienthoai: "",
  email: "",
  diachi: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/hoc-vien");
    rows.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu học viên");
  }
};

const resetForm = () => {
  form.value = {
    mahv: null,
    hoten: "",
    ngaysinh: "",
    gioitinh: "",
    cccd: "",
    sodienthoai: "",
    email: "",
    diachi: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("hocVienModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("hocVienModal");
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

const requiredFields = [
  { key: "hoten", label: "Họ tên" },
  { key: "ngaysinh", label: "Ngày sinh" },
  { key: "gioitinh", label: "Giới tính" },
  { key: "cccd", label: "CCCD" },
  { key: "sodienthoai", label: "Số điện thoại" },
  { key: "email", label: "Email" },
  { key: "diachi", label: "Địa chỉ" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      mahv: form.value.mahv,
      hoten: form.value.hoten,
      ngaysinh: form.value.ngaysinh,
      gioitinh: form.value.gioitinh,
      cccd: form.value.cccd,
      sodienthoai: form.value.sodienthoai,
      email: form.value.email,
      diachi: form.value.diachi,
    };

    if (isEdit.value) {
      await updateData("/hoc-vien", form.value.mahv, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/hoc-vien", data);
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