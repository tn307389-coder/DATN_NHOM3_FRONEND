<template>
  <div>
    <SimpleTablePage
      title="Quản lý lớp học"
      subtitle="Danh sách lớp học của trung tâm"
      search-placeholder="Tìm kiếm lớp học..."
      endpoint="/lop-hoc"
      id-key="malop"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="lopHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa lớp học" : "Thêm lớp học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên lớp <span class="text-danger">*</span></label>
              <input
                v-model="form.tenlop"
                class="form-control"
                placeholder="Nhập tên lớp học"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Khóa học <span class="text-danger">*</span></label>
              <select v-model="form.makh" class="form-select" required>
                <option value="">-- Chọn khóa học --</option>
                <option
                  v-for="kh in khoaHocList"
                  :key="kh.makh"
                  :value="kh.makh"
                >
                  {{ kh.tenkhoahoc }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Giáo viên <span class="text-danger">*</span></label>
              <select v-model="form.magv" class="form-select" required>
                <option value="">-- Chọn giáo viên --</option>
                <option
                  v-for="gv in giaoVienList"
                  :key="gv.magv"
                  :value="gv.magv"
                >
                  {{ gv.hoten }} - {{ gv.hangday }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày bắt đầu <span class="text-danger">*</span></label>
              <input
                v-model="form.ngaybatdau"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày kết thúc <span class="text-danger">*</span></label>
              <input
                v-model="form.ngayketthuc"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" required>
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang học">Đang học</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
                <option value="Tạm dừng">Tạm dừng</option>
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
  { key: "malop", label: "Mã lớp" },
  { key: "tenlop", label: "Tên lớp" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "ngaybatdau", label: "Ngày bắt đầu" },
  { key: "ngayketthuc", label: "Ngày kết thúc" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const khoaHocList = ref([]);
const giaoVienList = ref([]);

const isEdit = ref(false);

const form = ref({
  malop: null,
  tenlop: "",
  makh: "",
  magv: "",
  ngaybatdau: "",
  ngayketthuc: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/lop-hoc");

    rows.value = res.data.map((item) => ({
      ...item,
      khoahoc: item.khoaHoc?.tenkhoahoc || "",
      giaovien: item.giaoVien?.hoten || "",
      makh: item.khoaHoc?.makh || "",
      magv: item.giaoVien?.magv || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu lớp học");
  }
};

const loadKhoaHoc = async () => {
  try {
    const res = await getAll("/khoa-hoc");
    khoaHocList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu khóa học");
  }
};

const loadGiaoVien = async () => {
  try {
    const res = await getAll("/giao-vien");
    giaoVienList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu giáo viên");
  }
};

const resetForm = () => {
  form.value = {
    malop: null,
    tenlop: "",
    makh: "",
    magv: "",
    ngaybatdau: "",
    ngayketthuc: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("lopHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("lopHocModal");
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
    malop: row.malop,
    tenlop: row.tenlop,
    makh: row.makh,
    magv: row.magv,
    ngaybatdau: row.ngaybatdau,
    ngayketthuc: row.ngayketthuc,
    trangthai: row.trangthai,
  };

  openModal();
};

const requiredFields = [
  { key: "tenlop", label: "Tên lớp" },
  { key: "makh", label: "Khóa học" },
  { key: "magv", label: "Giáo viên" },
  { key: "ngaybatdau", label: "Ngày bắt đầu" },
  { key: "ngayketthuc", label: "Ngày kết thúc" },
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
      malop: form.value.malop,
      tenlop: form.value.tenlop,
      khoaHoc: {
        makh: Number(form.value.makh),
      },
      giaoVien: {
        magv: Number(form.value.magv),
      },
      ngaybatdau: form.value.ngaybatdau,
      ngayketthuc: form.value.ngayketthuc,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/lop-hoc", form.value.malop, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/lop-hoc", data);
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
  await loadKhoaHoc();
  await loadGiaoVien();
  await loadData();
});
</script>