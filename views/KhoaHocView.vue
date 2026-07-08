<template>
  <div>
    <SimpleTablePage
      title="Quản lý khóa học"
      subtitle="Danh sách khóa học của trung tâm"
      search-placeholder="Tìm kiếm khóa học..."
      endpoint="/khoa-hoc"
      id-key="makh"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <div class="modal fade" id="khoaHocModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa khóa học" : "Thêm khóa học" }}
            </h5>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Tên khóa học</label>
              <input
                v-model="form.tenkhoahoc"
                class="form-control"
                placeholder="Nhập tên khóa học"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Chương trình học</label>
              <select v-model="form.macth" class="form-select">
                <option value="">-- Chọn chương trình học --</option>
                <option
                  v-for="ct in chuongTrinhList"
                  :key="ct.macth"
                  :value="ct.macth"
                >
                  {{ ct.tenchuongtrinh }} - {{ ct.hangbang }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày bắt đầu</label>
              <input
                v-model="form.ngaybatdau"
                type="date"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Ngày kết thúc</label>
              <input
                v-model="form.ngayketthuc"
                type="date"
                class="form-control"
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái</label>
              <select v-model="form.trangthai" class="form-select">
                <option value="">-- Chọn trạng thái --</option>
                <option value="Đang mở">Đang mở</option>
                <option value="Đang học">Đang học</option>
                <option value="Đã kết thúc">Đã kết thúc</option>
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
  { key: "makh", label: "Mã khóa" },
  { key: "tenkhoahoc", label: "Tên khóa học" },
  { key: "chuongtrinh", label: "Chương trình" },
  { key: "ngaybatdau", label: "Ngày bắt đầu" },
  { key: "ngayketthuc", label: "Ngày kết thúc" },
  { key: "trangthai", label: "Trạng thái" },
];

const rows = ref([]);
const chuongTrinhList = ref([]);

const isEdit = ref(false);

const form = ref({
  makh: null,
  tenkhoahoc: "",
  macth: "",
  ngaybatdau: "",
  ngayketthuc: "",
  trangthai: "",
});

const loadData = async () => {
  try {
    const res = await getAll("/khoa-hoc");

    rows.value = res.data.map((item) => ({
      ...item,
      chuongtrinh: item.chuongTrinhHoc?.tenchuongtrinh || "",
      macth: item.chuongTrinhHoc?.macth || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu khóa học");
  }
};

const loadChuongTrinh = async () => {
  try {
    const res = await getAll("/chuong-trinh-hoc");
    chuongTrinhList.value = res.data;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu chương trình học");
  }
};

const resetForm = () => {
  form.value = {
    makh: null,
    tenkhoahoc: "",
    macth: "",
    ngaybatdau: "",
    ngayketthuc: "",
    trangthai: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("khoaHocModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("khoaHocModal");
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
    makh: row.makh,
    tenkhoahoc: row.tenkhoahoc,
    macth: row.macth,
    ngaybatdau: row.ngaybatdau,
    ngayketthuc: row.ngayketthuc,
    trangthai: row.trangthai,
  };

  openModal();
};

const saveData = async () => {
  if (!form.value.tenkhoahoc) {
    alert("Vui lòng nhập tên khóa học");
    return;
  }

  if (!form.value.macth) {
    alert("Vui lòng chọn chương trình học");
    return;
  }

  try {
    const data = {
      makh: form.value.makh,
      tenkhoahoc: form.value.tenkhoahoc,
      chuongTrinhHoc: {
        macth: Number(form.value.macth),
      },
      ngaybatdau: form.value.ngaybatdau,
      ngayketthuc: form.value.ngayketthuc,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/khoa-hoc", form.value.makh, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/khoa-hoc", data);
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
  await loadChuongTrinh();
  await loadData();
});
</script>