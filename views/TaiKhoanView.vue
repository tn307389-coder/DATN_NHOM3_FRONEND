<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Quản lý tài khoản</h2>
        <p class="text-muted mb-0">Danh sách tài khoản trong hệ thống</p>
      </div>

      <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addModal">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm tài khoản
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input v-model="keyword" class="form-control" placeholder="Tìm kiếm tài khoản..." />
          </div>

          <div class="col-md-3">
            <select v-model="roleFilter" class="form-select">
              <option value="">Tất cả vai trò</option>
              <option v-for="r in roles" :key="r.maVaiTro" :value="r.maVaiTro">
                {{ r.tenVaiTro }}
              </option>
            </select>
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Tên đăng nhập</th>
              <th>Họ tên</th>
              <th>Vai trò</th>
              <th>Trạng thái</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(item, index) in filteredTaiKhoan" :key="item.matk">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tendangnhap }}</td>
              <td>{{ item.hoten }}</td>
              <td>{{ item.vaitro ? item.vaitro.tenVaiTro : "" }}</td>
              <td>
                <span class="badge" :class="item.trangthai === 'ACTIVE' ? 'bg-success' : 'bg-secondary'">
                  {{ item.trangthai === 'ACTIVE' ? 'Hoạt động' : 'Khóa' }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-2" @click="openEdit(item)" data-bs-toggle="modal" data-bs-target="#editModal">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger" @click="removeTaiKhoan(item)">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredTaiKhoan.length === 0">
              <td colspan="6" class="text-center text-muted">Không có dữ liệu</td>
            </tr>
          </tbody>
        </table>

        <div class="text-muted">Hiển thị {{ filteredTaiKhoan.length }} tài khoản</div>
      </div>
    </div>

    <!-- Modal Thêm -->
    <div class="modal fade" id="addModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Thêm tài khoản</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Tên đăng nhập</label>
              <input v-model="newTaiKhoan.tendangnhap" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Mật khẩu</label>
              <input v-model="newTaiKhoan.matkhau" type="password" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Họ tên</label>
              <input v-model="newTaiKhoan.hoten" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Email</label>
              <input v-model="newTaiKhoan.email" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Vai trò</label>
              <select v-model="newTaiKhoan.maVaiTro" class="form-select">
                <option v-for="r in roles" :key="r.maVaiTro" :value="r.maVaiTro">
                  {{ r.tenVaiTro }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button class="btn btn-primary" @click="saveTaiKhoan">Lưu</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Sửa -->
    <div class="modal fade" id="editModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Sửa tài khoản</h5>
            <button class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label>Tên đăng nhập</label>
              <input v-model="editTaiKhoan.tendangnhap" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Mật khẩu (để trống nếu không đổi)</label>
              <input v-model="editTaiKhoan.matkhau" type="password" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Họ tên</label>
              <input v-model="editTaiKhoan.hoten" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Email</label>
              <input v-model="editTaiKhoan.email" class="form-control" />
            </div>

            <div class="mb-3">
              <label>Vai trò</label>
              <select v-model="editTaiKhoan.maVaiTro" class="form-select">
                <option v-for="r in roles" :key="r.maVaiTro" :value="r.maVaiTro">
                  {{ r.tenVaiTro }}
                </option>
              </select>
            </div>

            <div class="mb-3">
              <label>Trạng thái</label>
              <select v-model="editTaiKhoan.trangthai" class="form-select">
                <option :value="true">Hoạt động</option>
                <option :value="false">Khóa</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button class="btn btn-primary" @click="updateTaiKhoanHandler">Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  getAllTaiKhoan,
  addTaiKhoan,
  updateTaiKhoan,
  deleteTaiKhoan,
} from "../services/taiKhoanService";

const roles = [
  { maVaiTro: "ADMIN", tenVaiTro: "Quản trị viên" },
  { maVaiTro: "GV", tenVaiTro: "Giáo viên" },
  { maVaiTro: "HV", tenVaiTro: "Học viên" },
  { maVaiTro: "NV", tenVaiTro: "Nhân viên" },
];

const taiKhoanList = ref([]);
const keyword = ref("");
const roleFilter = ref("");

const newTaiKhoan = ref({
  tendangnhap: "",
  matkhau: "",
  hoten: "",
  email: "",
  maVaiTro: "NV",
});

const editTaiKhoan = ref({
  matk: null,
  tendangnhap: "",
  matkhau: "",
  hoten: "",
  email: "",
  maVaiTro: "NV",
  trangthai: true,
});

const loadTaiKhoan = async () => {
  try {
    const res = await getAllTaiKhoan();
    taiKhoanList.value = res.data;
  } catch (error) {
    console.error("Lỗi tải tài khoản:", error);
  }
};

const saveTaiKhoan = async () => {
  try {
    await addTaiKhoan({ ...newTaiKhoan.value });
    await loadTaiKhoan();
    newTaiKhoan.value = {
      tendangnhap: "",
      matkhau: "",
      hoten: "",
      email: "",
  maVaiTro: "NV",
    };
    alert("Thêm tài khoản thành công");
  } catch (error) {
    console.error("Lỗi thêm tài khoản:", error);
    alert("Thêm tài khoản thất bại");
  }
};

const openEdit = (item) => {
  editTaiKhoan.value = {
    matk: item.matk,
    tendangnhap: item.tendangnhap,
    matkhau: "",
    hoten: item.hoten,
    email: item.email,
    maVaiTro: item.vaitro ? item.vaitro.maVaiTro : "NV",
    trangthai: item.trangthai === "ACTIVE",
  };
};

const updateTaiKhoanHandler = async () => {
  try {
    const payload = { ...editTaiKhoan.value };
    await updateTaiKhoan(payload.matk, payload);
    await loadTaiKhoan();
    alert("Cập nhật tài khoản thành công");
  } catch (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    alert("Cập nhật tài khoản thất bại");
  }
};

const removeTaiKhoan = async (item) => {
  if (!confirm(`Bạn có chắc muốn xóa tài khoản "${item.tendangnhap}"?`)) return;
  try {
    await deleteTaiKhoan(item.matk);
    await loadTaiKhoan();
    alert("Xóa tài khoản thành công");
  } catch (error) {
    console.error("Lỗi xóa tài khoản:", error);
    alert("Xóa tài khoản thất bại");
  }
};

const filteredTaiKhoan = computed(() => {
  return taiKhoanList.value.filter((item) => {
    const matchKeyword =
      !keyword.value ||
      item.tendangnhap?.toLowerCase().includes(keyword.value.toLowerCase()) ||
      item.hoten?.toLowerCase().includes(keyword.value.toLowerCase());

    const matchRole = !roleFilter.value || (item.vaitro && item.vaitro.maVaiTro === roleFilter.value);

    return matchKeyword && matchRole;
  });
});

onMounted(() => {
  loadTaiKhoan();
});
</script>
