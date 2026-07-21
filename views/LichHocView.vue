<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div class="d-flex gap-2 align-items-center">
        <h2 class="mb-0">Quản lý lịch học</h2>
        <button v-if="!isHV" class="btn btn-outline-primary btn-sm" @click="openBatchScheduling">
          <i class="bi bi-calendar-plus"></i> Xếp lịch hàng loạt
        </button>
      </div>
    </div>

    <SimpleTablePage
      title=""
      subtitle="Danh sách lịch học của lớp, môn, giáo viên và phòng học"
      search-placeholder="Tìm kiếm lịch học..."
      endpoint="/lich-hoc"
      id-key="malich"
      :columns="columns"
      :rows="rows"
      :addable="!isHV"
      :editable="!isHV"
      :deletable="!isHV"
      @reload="loadData"
      @add="openAdd"
      @edit="openEdit"
    />

    <!-- Modal thêm / sửa lịch học -->
    <div class="modal fade" id="lichHocModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEdit ? "Sửa lịch học" : "Thêm lịch học" }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Lớp học <span class="text-danger">*</span></label>
                <select v-model="form.malop" class="form-select" required @change="autoFillTeacher">
                  <option value="">-- Chọn lớp học --</option>
                  <option v-for="lop in lopHocList" :key="lop.malop" :value="lop.malop">{{ lop.tenlop }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Môn học <span class="text-danger">*</span></label>
                <select v-model="form.mamh" class="form-select" required>
                  <option value="">-- Chọn môn học --</option>
                  <option v-for="mh in monHocList" :key="mh.mamh" :value="mh.mamh">{{ mh.tenmonhoc }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Giáo viên <span class="text-danger">*</span></label>
                <select v-model="form.magv" class="form-select" required>
                  <option value="">-- Chọn giáo viên --</option>
                  <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phòng học <span class="text-danger">*</span></label>
                <select v-model="form.maphong" class="form-select" required>
                  <option value="">-- Chọn phòng học --</option>
                  <option v-for="phong in phongHocList" :key="phong.maphong" :value="phong.maphong">{{ phong.tenphong }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ca học <span class="text-danger">*</span></label>
                <select v-model="form.macahoc" class="form-select" required>
                  <option value="">-- Chọn ca học --</option>
                  <option v-for="ca in caHocList" :key="ca.macahoc" :value="ca.macahoc">{{ ca.tencahoc }} - {{ ca.giobatdau }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày học <span class="text-danger">*</span></label>
                <input v-model="form.ngayhoc" type="date" class="form-control" required />
              </div>
              <div class="col-md-12 mb-3">
                <label class="form-label">Ghi chú</label>
                <textarea v-model="form.ghichu" class="form-control" rows="2" placeholder="Nhập ghi chú"></textarea>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button class="btn btn-primary" @click="saveData">{{ isEdit ? "Cập nhật" : "Thêm mới" }}</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal xếp lịch hàng loạt -->
    <div class="modal fade" id="batchModal" tabindex="-1">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Xếp lịch hàng loạt</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label class="form-label">Lớp học <span class="text-danger">*</span></label>
                <select v-model="batch.malop" class="form-select" required @change="autoFillTeacherBatch">
                  <option value="">-- Chọn lớp học --</option>
                  <option v-for="lop in lopHocList" :key="lop.malop" :value="lop.malop">{{ lop.tenlop }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Môn học <span class="text-danger">*</span></label>
                <select v-model="batch.mamh" class="form-select" required>
                  <option value="">-- Chọn môn học --</option>
                  <option v-for="mh in monHocList" :key="mh.mamh" :value="mh.mamh">{{ mh.tenmonhoc }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Giáo viên <span class="text-danger">*</span></label>
                <select v-model="batch.magv" class="form-select" required>
                  <option value="">-- Chọn giáo viên --</option>
                  <option v-for="gv in giaoVienList" :key="gv.magv" :value="gv.magv">{{ gv.hoten }} - {{ gv.hangday }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Phòng học <span class="text-danger">*</span></label>
                <select v-model="batch.maphong" class="form-select" required>
                  <option value="">-- Chọn phòng học --</option>
                  <option v-for="phong in phongHocList" :key="phong.maphong" :value="phong.maphong">{{ phong.tenphong }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ca học <span class="text-danger">*</span></label>
                <select v-model="batch.macahoc" class="form-select" required>
                  <option value="">-- Chọn ca học --</option>
                  <option v-for="ca in caHocList" :key="ca.macahoc" :value="ca.macahoc">{{ ca.tencahoc }} - {{ ca.giobatdau }}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày bắt đầu <span class="text-danger">*</span></label>
                <input v-model="batch.ngayBatDau" type="date" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ngày kết thúc <span class="text-danger">*</span></label>
                <input v-model="batch.ngayKetThuc" type="date" class="form-control" required />
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Thứ trong tuần <span class="text-danger">*</span></label>
                <div class="d-flex flex-wrap gap-2">
                  <label v-for="d in days" :key="d.value" class="btn btn-sm" :class="batch.thuTrongTuan.includes(d.value) ? 'btn-primary' : 'btn-outline-secondary'" @click="toggleDay(d.value)">
                    {{ d.label }}
                  </label>
                </div>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Ghi chú</label>
                <input v-model="batch.ghichu" class="form-control" placeholder="Ghi chú chung cho các buổi học" />
              </div>
              <div class="col-12 mb-3" v-if="soBuoiUocTinh > 0">
                <div class="alert alert-info">Sẽ tạo <strong>{{ soBuoiUocTinh }}</strong> buổi học</div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
            <button class="btn btn-primary" @click="saveBatch" :disabled="savingBatch">
              <i class="bi bi-calendar-check"></i> {{ savingBatch ? "Đang xếp..." : "Xếp lịch" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import { Modal } from "bootstrap";
import SimpleTablePage from "../components/common/SimpleTablePage.vue";
import { getAll, createData, updateData } from "../services/crudService";
import { requiredError } from "../services/validation";
import { useMyScope } from "../composables/useMyScope";
import api from "../services/api";

const { isHV, myMalop, loadMyScope } = useMyScope();

const DAYS = [
  { label: "T2", value: 1 }, { label: "T3", value: 2 }, { label: "T4", value: 3 },
  { label: "T5", value: 4 }, { label: "T6", value: 5 }, { label: "T7", value: 6 }, { label: "CN", value: 7 },
];

const columns = [
  { key: "malich", label: "Mã" },
  { key: "lop", label: "Lớp học" },
  { key: "monhoc", label: "Môn học" },
  { key: "giaovien", label: "Giáo viên" },
  { key: "phonghoc", label: "Phòng học" },
  { key: "cahoc", label: "Ca học" },
  { key: "ngayhoc", label: "Ngày học" },
  { key: "ghichu", label: "Ghi chú" },
];

const rows = ref([]);
const lopHocList = ref([]);
const monHocList = ref([]);
const giaoVienList = ref([]);
const phongHocList = ref([]);
const caHocList = ref([]);
const isEdit = ref(false);
const savingBatch = ref(false);

const form = ref({
  malich: null, malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayhoc: "", ghichu: "",
});

const batch = ref({
  malop: "", mamh: "", magv: "", maphong: "", macahoc: "",
  ngayBatDau: "", ngayKetThuc: "", thuTrongTuan: [], ghichu: "",
});

const days = DAYS;

const toggleDay = (val) => {
  const idx = batch.value.thuTrongTuan.indexOf(val);
  if (idx >= 0) batch.value.thuTrongTuan.splice(idx, 1);
  else batch.value.thuTrongTuan.push(val);
};

const soBuoiUocTinh = computed(() => {
  if (!batch.value.ngayBatDau || !batch.value.ngayKetThuc || batch.value.thuTrongTuan.length === 0) return 0;
  let count = 0;
  const start = new Date(batch.value.ngayBatDau);
  const end = new Date(batch.value.ngayKetThuc);
  const current = new Date(start);
  while (current <= end) {
    const dayOfWeek = current.getDay() === 0 ? 7 : current.getDay();
    if (batch.value.thuTrongTuan.includes(dayOfWeek)) count++;
    current.setDate(current.getDate() + 1);
  }
  return count;
});

const loadData = async () => {
  try {
    const res = await getAll("/lich-hoc");
    let list = res.data.map((item) => ({
      malich: item.malich, lop: item.lopHoc?.tenlop || "", monhoc: item.monHoc?.tenmonhoc || "",
      giaovien: item.giaoVien?.hoten || "", phonghoc: item.phongHoc?.tenphong || "",
      cahoc: item.caHoc?.tencahoc || "", ngayhoc: item.ngayhoc, ghichu: item.ghichu,
      malop: item.lopHoc?.malop || "", mamh: item.monHoc?.mamh || "",
      magv: item.giaoVien?.magv || "", maphong: item.phongHoc?.maphong || "",
      macahoc: item.caHoc?.macahoc || "",
    }));
    if (isHV.value) {
      const lopSet = myMalop.value.map(String);
      list = list.filter((r) => lopSet.includes(String(r.malop)));
    }
    rows.value = list;
  } catch (error) {
    console.log(error);
    alert("Không thể tải dữ liệu lịch học");
  }
};

const autoFillTeacher = () => {
  const lop = lopHocList.value.find((l) => l.malop === Number(form.value.malop));
  if (lop?.giaoVien?.magv) form.value.magv = String(lop.giaoVien.magv);
};

const autoFillTeacherBatch = () => {
  const lop = lopHocList.value.find((l) => l.malop === Number(batch.value.malop));
  if (lop?.giaoVien?.magv) batch.value.magv = String(lop.giaoVien.magv);
};

const loadList = async (fn) => { try { const r = await fn; return r.data; } catch { return []; } };

const loadLopHoc = async () => { lopHocList.value = await loadList(getAll("/lop-hoc")); };
const loadMonHoc = async () => { monHocList.value = await loadList(getAll("/mon-hoc")); };
const loadGiaoVien = async () => { giaoVienList.value = await loadList(getAll("/giao-vien")); };
const loadPhongHoc = async () => { phongHocList.value = await loadList(getAll("/phong-hoc")); };
const loadCaHoc = async () => { caHocList.value = await loadList(getAll("/ca-hoc")); };

const resetForm = () => {
  form.value = { malich: null, malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayhoc: "", ghichu: "" };
};

const openModal = () => Modal.getOrCreateInstance(document.getElementById("lichHocModal")).show();
const closeModal = () => Modal.getOrCreateInstance(document.getElementById("lichHocModal")).hide();
const openBatchModal = () => Modal.getOrCreateInstance(document.getElementById("batchModal")).show();
const closeBatchModal = () => Modal.getOrCreateInstance(document.getElementById("batchModal")).hide();

const openAdd = () => { isEdit.value = false; resetForm(); openModal(); };

const openEdit = (row) => {
  isEdit.value = true;
  form.value = { malich: row.malich, malop: row.malop, mamh: row.mamh, magv: row.magv, maphong: row.maphong, macahoc: row.macahoc, ngayhoc: row.ngayhoc, ghichu: row.ghichu };
  openModal();
};

const openBatchScheduling = () => {
  batch.value = { malop: "", mamh: "", magv: "", maphong: "", macahoc: "", ngayBatDau: "", ngayKetThuc: "", thuTrongTuan: [], ghichu: "" };
  openBatchModal();
};

const requiredFields = [
  { key: "malop", label: "Lớp học" }, { key: "mamh", label: "Môn học" }, { key: "magv", label: "Giáo viên" },
  { key: "maphong", label: "Phòng học" }, { key: "macahoc", label: "Ca học" }, { key: "ngayhoc", label: "Ngày học" },
];

const saveData = async () => {
  const err = requiredError(form.value, requiredFields);
  if (err) { alert(err); return; }
  try {
    const data = {
      malich: form.value.malich, lopHoc: { malop: Number(form.value.malop) },
      monHoc: { mamh: Number(form.value.mamh) }, giaoVien: { magv: Number(form.value.magv) },
      phongHoc: { maphong: Number(form.value.maphong) }, caHoc: { macahoc: Number(form.value.macahoc) },
      ngayhoc: form.value.ngayhoc, ghichu: form.value.ghichu,
    };
    if (isEdit.value) {
      await updateData("/lich-hoc", form.value.malich, data);
      alert("Cập nhật thành công");
    } else {
      await createData("/lich-hoc", data);
      alert("Thêm thành công");
    }
    closeModal(); await loadData();
  } catch (error) { console.log(error); alert("Lưu thất bại"); }
};

const saveBatch = async () => {
  if (!batch.value.malop || !batch.value.mamh || !batch.value.magv || !batch.value.maphong || !batch.value.macahoc || !batch.value.ngayBatDau || !batch.value.ngayKetThuc || batch.value.thuTrongTuan.length === 0) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }
  savingBatch.value = true;
  try {
    const res = await api.post("/lich-hoc/hang-loat", {
      malop: Number(batch.value.malop),
      mamh: Number(batch.value.mamh),
      magv: Number(batch.value.magv),
      maphong: Number(batch.value.maphong),
      macahoc: Number(batch.value.macahoc),
      ngayBatDau: batch.value.ngayBatDau,
      ngayKetThuc: batch.value.ngayKetThuc,
      thuTrongTuan: batch.value.thuTrongTuan,
      ghichu: batch.value.ghichu || "",
    });
    closeBatchModal();
    await loadData();
    alert("Đã tạo " + res.data.soBuoiTao + " buổi học!");
  } catch (error) {
    console.error(error);
    alert("Xếp lịch thất bại!");
  } finally {
    savingBatch.value = false;
  }
};

onMounted(async () => {
  await loadMyScope();
  await loadLopHoc();
  await loadMonHoc();
  await loadGiaoVien();
  await loadPhongHoc();
  await loadCaHoc();
  await loadData();
});
</script>

<style scoped>
.btn-group .btn { min-width: 44px; font-size: 13px; }
</style>