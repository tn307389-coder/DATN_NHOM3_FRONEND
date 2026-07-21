<template>
  <div>
    <!-- Thống kê -->
    <div class="row g-3 mb-4">
      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100">
          <div class="card-body">
            <h3 class="mb-1">{{ stats.all }}</h3>
            <span class="text-muted small">Tổng đăng ký</span>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100 border-warning">
          <div class="card-body">
            <h3 class="mb-1 text-warning">{{ stats["Chờ duyệt"] }}</h3>
            <span class="text-muted small">Chờ duyệt</span>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100 border-success">
          <div class="card-body">
            <h3 class="mb-1 text-success">{{ stats["Đã duyệt"] }}</h3>
            <span class="text-muted small">Đã duyệt</span>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100 border-primary">
          <div class="card-body">
            <h3 class="mb-1 text-primary">{{ stats["Đang học"] }}</h3>
            <span class="text-muted small">Đang học</span>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100 border-info">
          <div class="card-body">
            <h3 class="mb-1 text-info">{{ stats["Hoàn thành"] }}</h3>
            <span class="text-muted small">Hoàn thành</span>
          </div>
        </div>
      </div>

      <div class="col-6 col-md-2">
        <div class="card border-0 shadow-sm text-center h-100 border-danger">
          <div class="card-body">
            <h3 class="mb-1 text-danger">{{ stats["Đã hủy"] }}</h3>
            <span class="text-muted small">Đã hủy</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bộ lọc nâng cao -->
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-body d-flex flex-wrap gap-2 align-items-end">
        <div>
          <label class="form-label small mb-1">Trạng thái</label>
          <select v-model="statusFilter" class="form-select">
            <option value="">Tất cả trạng thái</option>
            <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">
              {{ s }}
            </option>
          </select>
        </div>

        <div>
          <label class="form-label small mb-1">Khóa học</label>
          <select v-model="courseFilter" class="form-select">
            <option value="">Tất cả khóa học</option>
            <option
              v-for="kh in khoaHocList"
              :key="kh.makh"
              :value="kh.makh"
            >
              {{ kh.tenkhoahoc }}
            </option>
          </select>
        </div>

        <button
          class="btn btn-outline-secondary"
          @click="statusFilter = ''; courseFilter = ''"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>

    <SimpleTablePage
      title="Quản lý đăng ký khóa học"
      subtitle="Danh sách học viên đăng ký khóa học"
      search-placeholder="Tìm kiếm học viên, CCCD, khóa học..."
      endpoint="/dang-ky-khoa-hoc"
      id-key="madk"
      :columns="columns"
      :rows="filteredRows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #extra-actions="{ row }">
        <button
          v-if="row.trangthai === 'Chờ duyệt' && !readOnly"
          class="btn btn-sm btn-success me-2"
          @click="approve(row)"
        >
          <i class="bi bi-check-circle me-1"></i> Duyệt
        </button>
      </template>
    </SimpleTablePage>

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
              <label class="form-label">Học viên <span class="text-danger">*</span></label>
              <select v-model="form.mahv" class="form-select" required>
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
              <label class="form-label">Ngày đăng ký <span class="text-danger">*</span></label>
              <input
                v-model="form.ngaydangky"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Trạng thái <span class="text-danger">*</span></label>
              <select v-model="form.trangthai" class="form-select" required>
                <option value="">-- Chọn trạng thái --</option>
                <option v-for="s in STATUS_OPTIONS" :key="s" :value="s">
                  {{ s }}
                </option>
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
import { computed, inject, onMounted, ref } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import {
  getAll,
  createData,
  updateData,
} from "../services/crudService";
import { requiredError } from "../services/validation";

const STATUS_OPTIONS = [
  "Chờ duyệt",
  "Đã duyệt",
  "Đang học",
  "Hoàn thành",
  "Đã hủy",
];

const readOnly = inject("readOnly", ref(false));

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

const statusFilter = ref("");
const courseFilter = ref("");

const stats = computed(() => {
  const map = { all: rows.value.length };
  STATUS_OPTIONS.forEach((s) => (map[s] = 0));
  rows.value.forEach((r) => {
    if (r.trangthai in map) {
      map[r.trangthai]++;
    }
  });
  return map;
});

const filteredRows = computed(() =>
  rows.value.filter((r) => {
    if (statusFilter.value && r.trangthai !== statusFilter.value) {
      return false;
    }
    if (courseFilter.value && String(r.makh) !== String(courseFilter.value)) {
      return false;
    }
    return true;
  })
);

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
    trangthai: "Chờ duyệt",
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

const buildPayload = () => ({
  madk: form.value.madk,
  hocVien: { mahv: Number(form.value.mahv) },
  khoaHoc: { makh: Number(form.value.makh) },
  ngaydangky: form.value.ngaydangky,
  trangthai: form.value.trangthai,
});

const requiredFields = [
  { key: "mahv", label: "Học viên" },
  { key: "makh", label: "Khóa học" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "trangthai", label: "Trạng thái" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    if (isEdit.value) {
      await updateData("/dang-ky-khoa-hoc", form.value.madk, buildPayload());
      alert("Cập nhật thành công");
    } else {
      await createData("/dang-ky-khoa-hoc", buildPayload());
      alert("Thêm thành công");
    }

    closeModal();
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Lưu thất bại");
  }
};

const approve = async (row) => {
  if (!confirm(`Duyệt đăng ký của "${row.hocvien || ""}"?`)) {
    return;
  }

  try {
    await updateData("/dang-ky-khoa-hoc", row.madk, {
      madk: row.madk,
      hocVien: { mahv: Number(row.mahv) },
      khoaHoc: { makh: Number(row.makh) },
      ngaydangky: row.ngaydangky,
      trangthai: "Đã duyệt",
    });
    alert("Đã duyệt đăng ký");
    await loadData();
  } catch (error) {
    console.log(error);
    alert("Duyệt thất bại");
  }
};

onMounted(async () => {
  await loadHocVien();
  await loadKhoaHoc();
  await loadData();
});
</script>
