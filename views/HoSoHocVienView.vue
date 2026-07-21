<template>
  <div>
    <SimpleTablePage
      title="Quản lý hồ sơ học viên"
      subtitle="Danh sách hồ sơ đăng ký của học viên"
      search-placeholder="Tìm kiếm hồ sơ học viên..."
      endpoint="/ho-so-hoc-vien"
      id-key="mahs"
      :columns="columns"
      :rows="rows"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    >
      <template #extra-actions="{ row }">
        <button class="btn btn-sm btn-info me-2" @click="openDetail(row)">
          <i class="bi bi-eye"></i> Xem
        </button>
      </template>
    </SimpleTablePage>

    <!-- Modal thêm/sửa -->
    <div class="modal fade" id="hoSoHocVienModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ isEdit ? "Sửa hồ sơ học viên" : "Thêm hồ sơ học viên" }}
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
              <label class="form-label">Ngày đăng ký <span class="text-danger">*</span></label>
              <input
                v-model="form.ngaydangky"
                type="date"
                class="form-control"
                required
              />
            </div>

            <div class="mb-3">
              <label class="form-label">Tình trạng <span class="text-danger">*</span></label>
              <select v-model="form.tinhtrang" class="form-select" required>
                <option value="">-- Chọn tình trạng --</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã duyệt">Đã duyệt</option>
                <option value="Bổ sung hồ sơ">Bổ sung hồ sơ</option>
                <option value="Từ chối">Từ chối</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="form-label">Ghi chú <span class="text-danger">*</span></label>
              <textarea
                v-model="form.ghichu"
                class="form-control"
                rows="3"
                placeholder="Nhập ghi chú"
                required
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

    <!-- Modal xem hồ sơ (phiếu hồ sơ giấy) -->
    <div class="modal fade" id="hoSoDetailModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content" v-if="detail">
          <div class="modal-header ho-so-header">
            <div>
              <h5 class="mb-0">PHIẾU HỒ SƠ ĐĂNG KÝ HỌC VIÊN</h5>
              <small>Mã hồ sơ: {{ detail.mahs }}</small>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="row g-4">
              <div class="col-md-4 text-center">
                <div class="ho-so-photo">
                  <img
                    v-if="detail.anhCanhCan"
                    :src="photoUrl(detail.anhCanhCan)"
                    alt="Ảnh căn cước"
                    class="img-fluid rounded"
                  />
                  <div v-else class="ho-so-photo-empty">
                    <i class="bi bi-person-fill"></i>
                    <span>Chưa có ảnh</span>
                  </div>
                </div>
                <div class="mt-2">
                  <span
                    class="badge"
                    :class="statusBadgeClass(detail.tinhtrang)"
                  >
                    {{ detail.tinhtrang || "Chưa cập nhật" }}
                  </span>
                </div>
              </div>

              <div class="col-md-8">
                <h6 class="ho-so-section">I. Thông tin học viên</h6>
                <table class="table table-sm ho-so-table">
                  <tbody>
                    <tr><th>Họ và tên</th><td>{{ detail.hocVien?.hoten || "—" }}</td></tr>
                    <tr><th>Ngày sinh</th><td>{{ detail.hocVien?.ngaysinh || "—" }}</td></tr>
                    <tr><th>Giới tính</th><td>{{ detail.hocVien?.gioitinh || "—" }}</td></tr>
                    <tr><th>CCCD</th><td>{{ detail.hocVien?.cccd || "—" }}</td></tr>
                    <tr><th>Số điện thoại</th><td>{{ detail.hocVien?.sodienthoai || "—" }}</td></tr>
                    <tr><th>Email</th><td>{{ detail.hocVien?.email || "—" }}</td></tr>
                    <tr><th>Địa chỉ</th><td>{{ detail.hocVien?.diachi || "—" }}</td></tr>
                  </tbody>
                </table>

                <h6 class="ho-so-section">II. Thông tin hồ sơ</h6>
                <table class="table table-sm ho-so-table">
                  <tbody>
                    <tr><th>Ngày đăng ký</th><td>{{ detail.ngaydangky || "—" }}</td></tr>
                    <tr><th>Tình trạng</th><td>{{ detail.tinhtrang || "—" }}</td></tr>
                    <tr><th>Ghi chú</th><td>{{ detail.ghichu || "—" }}</td></tr>
                    <tr v-if="detail.fileHoSo">
                      <th>File hồ sơ</th>
                      <td>
                        <a :href="photoUrl(detail.fileHoSo)" target="_blank" class="btn btn-sm btn-outline-primary">
                          <i class="bi bi-download"></i> Tải xuống
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
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
  { key: "mahs", label: "Mã hồ sơ" },
  { key: "hocvien", label: "Học viên" },
  { key: "cccd", label: "CCCD" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "tinhtrang", label: "Tình trạng" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const hocVienList = ref([]);

const isEdit = ref(false);

const form = ref({
  mahs: null,
  mahv: "",
  ngaydangky: "",
  tinhtrang: "",
  ghichu: "",
});

const detail = ref(null);

const loadData = async () => {
  try {
    const res = await getAll("/ho-so-hoc-vien");

    rows.value = res.data.map((item) => ({
      ...item,
      hocvien: item.hocVien?.hoten || "",
      cccd: item.hocVien?.cccd || "",
      mahv: item.hocVien?.mahv || "",
    }));
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu hồ sơ học viên");
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

const resetForm = () => {
  form.value = {
    mahs: null,
    mahv: "",
    ngaydangky: "",
    tinhtrang: "",
    ghichu: "",
  };
};

const openModal = () => {
  const modalElement = document.getElementById("hoSoHocVienModal");
  const modal = Modal.getOrCreateInstance(modalElement);
  modal.show();
};

const closeModal = () => {
  const modalElement = document.getElementById("hoSoHocVienModal");
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
    mahs: row.mahs,
    mahv: row.mahv,
    ngaydangky: row.ngaydangky,
    tinhtrang: row.tinhtrang,
    ghichu: row.ghichu,
  };

  openModal();
};

const openDetail = (row) => {
  detail.value = row;
  const modalElement = document.getElementById("hoSoDetailModal");
  Modal.getOrCreateInstance(modalElement).show();
};

const photoUrl = (file) =>
  file ? `http://localhost:8080/api/files/${encodeURIComponent(file)}` : "";

const statusBadgeClass = (t) => {
  if (t === "Đã duyệt") return "bg-success";
  if (t === "Từ chối") return "bg-danger";
  if (t === "Bổ sung hồ sơ") return "bg-warning text-dark";
  return "bg-secondary";
};

const requiredFields = [
  { key: "mahv", label: "Học viên" },
  { key: "ngaydangky", label: "Ngày đăng ký" },
  { key: "tinhtrang", label: "Tình trạng" },
  { key: "ghichu", label: "Ghi chú" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) {
    alert(err);
    return;
  }

  try {
    const data = {
      mahs: form.value.mahs,
      hocVien: {
        mahv: Number(form.value.mahv),
      },
      ngaydangky: form.value.ngaydangky,
      tinhtrang: form.value.tinhtrang,
      ghichu: form.value.ghichu,
    };

    if (isEdit.value) {
      await updateData("/ho-so-hoc-vien", form.value.mahs, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/ho-so-hoc-vien", data);
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
  await loadData();
});
</script>

<style scoped>
.ho-so-header {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  color: #fff;
}
.ho-so-photo {
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  padding: 10px;
  background: #f8fafc;
}
.ho-so-photo img {
  max-height: 280px;
  width: 100%;
  object-fit: cover;
}
.ho-so-photo-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #94a3b8;
  min-height: 200px;
  font-size: 14px;
}
.ho-so-photo-empty i {
  font-size: 48px;
}
.ho-so-section {
  font-weight: 800;
  color: #0d6efd;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 6px;
  margin-bottom: 10px;
}
.ho-so-table th {
  width: 140px;
  color: #6b7280;
  font-weight: 600;
  vertical-align: top;
}
</style>
