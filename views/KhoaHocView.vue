<template>
  <div>
    <SimpleTablePage
      title="Quản lý khóa học"
      subtitle="Danh sách khóa học đào tạo"
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
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa khóa học" : "Thêm khóa học" }}
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row">
              <div class="col-md-12 mb-3">
                <label class="form-label">Tên khóa học <span class="text-danger">*</span></label>
                <input v-model="form.tenkhoahoc" class="form-control" placeholder="Nhập tên khóa học" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Chương trình học <span class="text-danger">*</span></label>
                <select v-model="form.macth" class="form-select" required>
                  <option value="">-- Chọn chương trình --</option>
                  <option v-for="cth in chuongTrinhList" :key="cth.macth" :value="cth.macth">
                    {{ cth.tencth }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.trangthai" class="form-select">
                  <option value="">-- Chọn trạng thái --</option>
                  <option value="Đang mở">Đang mở</option>
                  <option value="Đã kết thúc">Đã kết thúc</option>
                  <option value="Tạm dừng">Tạm dừng</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày bắt đầu</label>
                <input v-model="form.ngaybatdau" type="date" class="form-control" />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày kết thúc</label>
                <input v-model="form.ngayketthuc" type="date" class="form-control" />
              </div>
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
  { key: "makh", label: "Mã KH" },
  { key: "tenkhoahoc", label: "Tên khóa học" },
  { key: "soLuongHocVien", label: "Số HV" },
  { key: "tencth", label: "Chương trình" },
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
    rows.value = res.data || [];
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu khóa học");
  }
};

const loadChuongTrinh = async () => {
  try {
    const res = await getAll("/chuong-trinh-hoc");
    chuongTrinhList.value = res.data || [];
  } catch (e) {
    console.log(e);
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
  const modal = Modal.getOrCreateInstance(document.getElementById("khoaHocModal"));
  modal.show();
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
    macth: row.chuongTrinhHoc ? row.chuongTrinhHoc.macth : row.macth,
    ngaybatdau: row.ngaybatdau || "",
    ngayketthuc: row.ngayketthuc || "",
    trangthai: row.trangthai || "",
  };
  openModal();
};

const requiredFields = [
  { key: "tenkhoahoc", label: "Tên khóa học" },
  { key: "macth", label: "Chương trình học" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      makh: form.value.makh,
      tenkhoahoc: form.value.tenkhoahoc,
      macth: Number(form.value.macth),
      ngaybatdau: form.value.ngaybatdau || null,
      ngayketthuc: form.value.ngayketthuc || null,
      trangthai: form.value.trangthai,
    };

    if (isEdit.value) {
      await updateData("/khoa-hoc", form.value.makh, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/khoa-hoc", data);
      alert("Thêm thành công");
    }

    Modal.getOrCreateInstance(document.getElementById("khoaHocModal")).hide();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};

onMounted(() => {
  loadData();
  loadChuongTrinh();
});
</script>
