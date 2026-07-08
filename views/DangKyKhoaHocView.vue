<template>
  <div>
    <SimpleTablePage
      title="Quản lý đăng ký khóa học"
      subtitle="Danh sách học viên đăng ký khóa học"
      search-placeholder="Tìm kiếm đăng ký..."
      endpoint="/dang-ky-khoa-hoc"
      id-key="madk"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="dangKyKhoaHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa đăng ký khóa học" : "Thêm đăng ký khóa học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Học viên</label>
              <select v-model="form.mahv" class="form-select">
                <option value="">-- Chọn học viên --</option>
                <option
                  v-for="hv in hocVienList"
                  :key="hv.mahv"
                  :value="hv.mahv"
                >
                  {{ hv.hoten }} - {{ hv.cccd }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Khóa học</label>
              <select v-model="form.makh" class="form-select">
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
              <label class="form-label">Ngày đăng ký</label>
              <input
                v-model="form.ngaydangky"
                type="date"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangthai" class="form-select">
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đã đăng ký">Đã đăng ký</option>
                <option value="Đang học">Đang học</option>
                <option value="Hoàn thành">Hoàn thành</option>
                <option value="Đã hủy">Đã hủy</option>
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
  { key: "madk", label: "Mã ĐK" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "khoahoc", label: "Khóa học" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const hocVienList = ref([]);
const khoaHocList = ref([]);

const isEdit = ref(false);

const form = ref({
  madk: null,
  mahv: "",
  makh: "",
  ngaydangky: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/dang-ky-khoa-hoc");

    rows.value = res.data.map((item) => ({
      ...item,
      hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      khoahoc: item.khoaHoc?.tenkhoahoc || "",
      mahv: item.hocVien?.mahv || "",
      makh: item.khoaHoc?.makh || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu đăng ký khóa học");
  }
};

const loadHocVien = async () => {
  try {
    const res = await getAll("/hoc-vien");
    hocVienList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu học viên");
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

const resetForm = () => {
  form.value = {
    madk: null,
    mahv: "",
    makh: "",
    ngaydangky: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("dangKyKhoaHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("dangKyKhoaHocModal");
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
    madk: row.madk,
    mahv: row.mahv,
    makh: row.makh,
    ngaydangky: row.ngaydangky,
    trangthai: row.trangthai,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.mahv) {
    alert("Vui lòng chọn học viên");
    return;
  }

  if (!form.value.makh) {
    alert("Vui lòng chọn khóa học");
    return;
  }

  try {
    const data = {
      madk: form.value.madk,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      khoaHoc: {
        makh: Number(form.value.makh),
      },
      ngaydangky: form.value.ngaydangky,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/dang-ky-khoa-hoc", form.value.madk, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/dang-ky-khoa-hoc", data);
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
  await loadHocVien();
  await loadKhoaHoc();
  await loadData();
});
</script>