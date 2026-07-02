<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Quản lý tài khoản</h2>
        <p class="text-muted mb-0">Danh sách tài khoản trong hệ thống</p>
      </div>

      <button
        class="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#addModal"
      >
        <i class="bi bi-plus-circle me-1"></i>
        Thêm tài khoản
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input
              v-model="keyword"
              class="form-control"
              placeholder="Tìm kiếm tài khoản..."
            />
          </div>

          <div class="col-md-3">
            <select v-model="roleFilter" class="form-select">
              <option value="">Tất cả vai trò</option>
              <option value="Admin">Admin</option>
              <option value="Nhân viên">Nhân viên</option>
              <option value="Giáo viên">Giáo viên</option>
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
              <td>{{ item.vaitro }}</td>
              <td>
                <span
                  class="badge"
                  :class="item.trangthai ? 'bg-success' : 'bg-secondary'"
                >
                  {{ item.trangthai ? "Hoạt động" : "Khóa" }}
                </span>
              </td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-2">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredTaiKhoan.length === 0">
              <td colspan="6" class="text-center text-muted">
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>

        <div class="text-muted">
          Hiển thị {{ filteredTaiKhoan.length }} tài khoản
        </div>
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
              <input v-model="newTaiKhoan.matkhau" class="form-control" />
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
              <select v-model="newTaiKhoan.vaitro" class="form-select">
                <option>Admin</option>
                <option>Giáo viên</option>
                <option>Nhân viên</option>
              </select>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              Hủy
            </button>

            <button class="btn btn-primary" @click="saveTaiKhoan">
  Lưu
</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { getAllTaiKhoan, addTaiKhoan } from "../services/taiKhoanService";

const taiKhoanList = ref([]);
const keyword = ref("");
const roleFilter = ref("");

const newTaiKhoan = ref({
  tendangnhap: "",
  matkhau: "",
  hoten: "",
  email: "",
  vaitro: "Nhân viên",
  trangthai: true,
  ngayTao: new Date().toISOString(),
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
    const res = await addTaiKhoan(newTaiKhoan.value);
    console.log("Kết quả trả về:", res.data);

    await loadTaiKhoan();

    newTaiKhoan.value = {
  tendangnhap: "",
  matkhau: "",
  hoten: "",
  email: "",
  vaitro: "Nhân viên",
  trangthai: true,
  ngayTao: new Date().toISOString(),
};

    alert("Thêm tài khoản thành công");
  } catch (error) {
    console.error("Lỗi thêm tài khoản:", error);
    alert("Thêm tài khoản thất bại");
  }
};

const filteredTaiKhoan = computed(() => {
  return taiKhoanList.value.filter((item) => {
    const matchKeyword =
      item.tendangnhap?.toLowerCase().includes(keyword.value.toLowerCase()) ||
      item.hoten?.toLowerCase().includes(keyword.value.toLowerCase());

    const matchRole =
      roleFilter.value === "" || item.vaitro === roleFilter.value;

    return matchKeyword && matchRole;
  });
});

onMounted(() => {
  loadTaiKhoan();
});
</script>