<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="mb-0">Lịch sử bảo trì xe</h2>
      <button class="btn btn-primary" @click="addBaoTri"><i class="bi bi-plus-lg"></i> Thêm bảo trì</button>
    </div>

    <div v-if="loading" class="text-center py-4"><div class="spinner-border text-primary"></div></div>

    <table v-else class="table table-hover align-middle">
      <thead class="table-light">
        <tr>
          <th>STT</th>
          <th>Biển số xe</th>
          <th>Loại bảo trì</th>
          <th>Ngày bảo trì</th>
          <th>Chi phí</th>
          <th>Đơn vị</th>
          <th>Trạng thái</th>
          <th>Ngày bảo trì tiếp theo</th>
          <th>Ghi chú</th>
          <th class="text-center">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, i) in list" :key="item.id">
          <td>{{ i + 1 }}</td>
          <td>{{ item.xe?.bienso }}</td>
          <td>{{ item.loaiBaoTri }}</td>
          <td>{{ formatDate(item.ngayBaoTri) }}</td>
          <td>{{ item.chiPhi?.toLocaleString('vi-VN') || '—' }} đ</td>
          <td>{{ item.donViBaoTri || '—' }}</td>
          <td><span class="badge" :class="trangThaiClass(item.trangThai)">{{ item.trangThai }}</span></td>
          <td>{{ formatDate(item.ngayBaoTriTiepTheo) }}</td>
          <td><small>{{ item.moTa || '—' }}</small></td>
          <td class="text-center">
            <button class="btn btn-sm btn-outline-primary me-1" @click="editItem(item)"><i class="bi bi-pencil"></i></button>
            <button class="btn btn-sm btn-outline-danger" @click="deleteItem(item.id)"><i class="bi bi-trash"></i></button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal -->
    <div class="modal fade" id="baoTriModal" tabindex="-1" ref="modalElement">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <form @submit.prevent="save" class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? 'Cập nhật bảo trì' : 'Thêm bảo trì mới' }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label">Xe</label>
                <select v-model="form.maxe" class="form-select" required>
                  <option :value="null">-- Chọn xe --</option>
                  <option v-for="x in xeVehicles" :key="x.maxe" :value="x.maxe">{{ x.bienso }} - {{ x.loaixe }}</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Loại bảo trì</label>
                <select v-model="form.loaiBaoTri" class="form-select" required>
                  <option value="BAN_SUONG">Bảo trì bảo suống</option>
                  <option value="THAY_NHIEU">Thay nhớt</option>
                  <option value="THAY_LLANH">Thay lốc lạnh</option>
                  <option value="DANG_KIEM">Đăng kiểm</option>
                  <option value="SU_SUA_KHAC">Sửa chữa khác</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày bảo trì</label>
                <input v-model="form.ngayBaoTri" type="date" class="form-control" required />
              </div>
              <div class="col-md-6">
                <label class="form-label">Số km hiện tại</label>
                <input v-model="form.soKmHienTai" type="number" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Chi phí</label>
                <input v-model="form.chiPhi" type="number" step="1000" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Đơn vị bảo trì</label>
                <input v-model="form.donViBaoTri" type="text" class="form-control" />
              </div>
              <div class="col-md-6">
                <label class="form-label">Trạng thái</label>
                <select v-model="form.trangThai" class="form-select">
                  <option value="HOAN_THANH">Hoàn thành</option>
                  <option value="DANG_XU_LY">Đang xử lý</option>
                  <option value="HEN_THOI_GIAN">Hẹn thời gian</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Ngày bảo trì tiếp theo</label>
                <input v-model="form.ngayBaoTriTiepTheo" type="date" class="form-control" />
              </div>
              <div class="col-12">
                <label class="form-label">Mô tả</label>
                <textarea v-model="form.moTa" class="form-control" rows="3"></textarea>
              </div>
              <div class="col-12">
                <label class="form-label">Người tạo</label>
                <input v-model="form.nguoiTao" type="text" class="form-control" />
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeModal">Hủy</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">{{ isEdit ? 'Cập nhật' : 'Thêm mới' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { Modal } from "bootstrap";
import { getAll, createData, updateData, deleteData } from "../services/crudService";

const route = useRoute();
const list = ref([]);
const xeVehicles = ref([]);
const loading = ref(false);
const showModal = ref(false);
const isEdit = ref(false);
const saving = ref(false);
const filterMaxe = ref(route.query.maxe || null);
const form = ref({
  maxe: null,
  loaiBaoTri: "",
  ngayBaoTri: "",
  soKmHienTai: null,
  chiPhi: null,
  donViBaoTri: "",
  trangThai: "HOAN_THANH",
  ngayBaoTriTiepTheo: null,
  moTa: "",
  nguoiTao: ""
});

const trangThaiClass = (s) => {
  const map = { HOAN_THANH: "bg-success", DANG_XU_LY: "bg-warning", HEN_THOI_GIAN: "bg-info" };
  return map[s] || "bg-secondary";
};

const formatDate = (d) => {
  if (!d) return "—";
  const parts = d.split("-");
  return parts.length === 3 ? `${parts[2]}/${parts[1]}/${parts[0]}` : d;
};

const modalElement = ref(null);
const modalInstance = ref(null);

const openModal = () => {
  if (!modalInstance.value) {
    modalInstance.value = new Modal(document.getElementById("baoTriModal"));
  }
  modalInstance.value.show();
};

const closeModal = () => {
  if (modalInstance.value) {
    modalInstance.value.hide();
  }
  isEdit.value = false;
  form.value = {
    maxe: null,
    loaiBaoTri: "",
    ngayBaoTri: "",
    soKmHienTai: null,
    chiPhi: null,
    donViBaoTri: "",
    trangThai: "HOAN_THANH",
    ngayBaoTriTiepTheo: null,
    moTa: "",
    nguoiTao: ""
  };
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getAll("/lich-su-bao-tri-xe");
    list.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const loadXe = async () => {
  try {
    const res = await getAll("/xe");
    xeVehicles.value = res.data || [];
    if (filterMaxe.value) {
      form.value.maxe = Number(filterMaxe.value);
    }
  } catch (e) {
    console.error(e);
  }
};

const addBaoTri = () => {
  isEdit.value = false;
  resetForm();
  if (filterMaxe.value) form.value.maxe = Number(filterMaxe.value);
  openModal();
};

const resetForm = () => {
  form.value = {
    maxe: null,
    loaiBaoTri: "",
    ngayBaoTri: "",
    soKmHienTai: null,
    chiPhi: null,
    donViBaoTri: "",
    trangThai: "HOAN_THANH",
    ngayBaoTriTiepTheo: null,
    moTa: "",
    nguoiTao: ""
  };
};

const editItem = (item) => {
  isEdit.value = true;
  form.value = {
    id: item.id,
    maxe: item.xe?.maxe,
    loaiBaoTri: item.loaiBaoTri,
    ngayBaoTri: item.ngayBaoTri,
    soKmHienTai: item.soKmHienTai,
    chiPhi: item.chiPhi,
    donViBaoTri: item.donViBaoTri,
    trangThai: item.trangThai,
    ngayBaoTriTiepTheo: item.ngayBaoTriTiepTheo,
    moTa: item.moTa,
    nguoiTao: item.nguoiTao
  };
  openModal();
};

const save = async () => {
  if (!form.value.maxe || !form.value.loaiBaoTri || !form.value.ngayBaoTri) {
    alert("Vui lòng điền đầy đủ thông tin bắt buộc!");
    return;
  }
  saving.value = true;
  try {
    const data = {
      maxe: form.value.maxe,
      loaiBaoTri: form.value.loaiBaoTri,
      ngayBaoTri: form.value.ngayBaoTri,
      soKmHienTai: form.value.soKmHienTai || null,
      chiPhi: form.value.chiPhi || null,
      donViBaoTri: form.value.donViBaoTri || "",
      trangThai: form.value.trangThai,
      ngayBaoTriTiepTheo: form.value.ngayBaoTriTiepTheo || null,
      moTa: form.value.moTa || "",
      nguoiTao: form.value.nguoiTao || ""
    };
    console.log("Sending data:", data);
    if (isEdit.value) {
      await updateData("/lich-su-bao-tri-xe", form.value.id, data);
    } else {
      await createData("/lich-su-bao-tri-xe", data);
    }
    closeModal();
    loadData();
  } catch (e) {
    console.error("Save error:", e.response?.data || e.message);
    alert("Lưu thất bại! " + (e.response?.data?.message || e.message));
  } finally {
    saving.value = false;
  }
};

const deleteItem = async (id) => {
  if (!confirm("Bạn có chắc muốn xóa?")) return;
  try {
    await deleteData("/lich-su-bao-tri-xe", id);
    loadData();
  } catch (e) {
    console.error(e);
  }
};

onMounted(() => {
  loadData();
  loadXe();
});
</script>

<style scoped>
.modal { background: rgba(0,0,0,0.5); }
</style>