<template>
  <div class="container-fluid">
    <h2 class="mb-4">Dashboard</h2>

    <p class="text-muted">
      Chào mừng đến hệ thống quản lý trung tâm GPLX
    </p>

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white shadow dashboard-card">
          <div class="card-body">
            <h5>👨‍🎓 Tổng học viên</h5>
            <h2>{{ tongHocVien }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white shadow dashboard-card">
          <div class="card-body">
            <h5>👨‍🏫 Giáo viên</h5>
            <h2>{{ tongGiaoVien }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-warning text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🚗 Xe tập lái</h5>
            <h2>{{ tongXeTapLai }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-danger text-white shadow dashboard-card">
          <div class="card-body">
            <h5>📅 Lịch học</h5>
            <h2>{{ tongLichHoc }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-info text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🏫 Phòng học</h5>
            <h2>{{ tongPhongHoc }}</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-dark text-white shadow dashboard-card">
          <div class="card-body">
            <h5>💰 Doanh thu tháng</h5>
            <h2>{{ doanhThu.toLocaleString("vi-VN") }} đ</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-secondary text-white shadow dashboard-card">
          <div class="card-body">
            <h5>📝 Thi sát hạch</h5>
            <h2>{{ tongThiSatHach }}</h2>
          </div>
        </div>
      </div>
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">📊 Biểu đồ học viên theo tháng</h5>

            <div class="chart-box">
              <div class="chart-item">
                <span>Tháng 1</span>
                <div class="progress">
                  <div class="progress-bar bg-primary" style="width: 35%">35</div>
                </div>
              </div>

              <div class="chart-item">
                <span>Tháng 2</span>
                <div class="progress">
                  <div class="progress-bar bg-success" style="width: 50%">50</div>
                </div>
              </div>

              <div class="chart-item">
                <span>Tháng 3</span>
                <div class="progress">
                  <div class="progress-bar bg-warning" style="width: 65%">65</div>
                </div>
              </div>

              <div class="chart-item">
                <span>Tháng 4</span>
                <div class="progress">
                  <div class="progress-bar bg-danger" style="width: 40%">40</div>
                </div>
              </div>

              <div class="chart-item">
                <span>Tháng 5</span>
                <div class="progress">
                  <div class="progress-bar bg-info" style="width: 75%">75</div>
                </div>
              </div>

              <div class="chart-item">
                <span>Tháng 6</span>
                <div class="progress">
                  <div class="progress-bar bg-dark" style="width: 90%">90</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">🔔 Thông báo</h5>

            <ul class="list-group list-group-flush">
              <li class="list-group-item">
                {{ tongThiSatHach }} lượt thi sát hạch
              </li>
              <li class="list-group-item">
                {{ tongXeTapLai }} xe tập lái trong hệ thống
              </li>
              <li class="list-group-item">
                {{ tongLichHoc }} lịch học đã tạo
              </li>
              <li class="list-group-item">
                Doanh thu: {{ doanhThu.toLocaleString("vi-VN") }} đ
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5 class="mb-3">📋 Hoạt động gần đây</h5>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Nội dung</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Tổng học viên hiện có: {{ tongHocVien }}</td>
              <td>Hôm nay</td>
              <td>
                <span class="badge bg-success">Đã cập nhật</span>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Tổng giáo viên hiện có: {{ tongGiaoVien }}</td>
              <td>Hôm nay</td>
              <td>
                <span class="badge bg-primary">Đã cập nhật</span>
              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>Tổng lịch học hiện có: {{ tongLichHoc }}</td>
              <td>Hôm nay</td>
              <td>
                <span class="badge bg-info">Đã cập nhật</span>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getAll } from "../services/crudService";

const tongHocVien = ref(0);
const tongGiaoVien = ref(0);
const tongXeTapLai = ref(0);
const tongLichHoc = ref(0);
const tongPhongHoc = ref(0);
const doanhThu = ref(0);
const tongThiSatHach = ref(0);

const loadDashboard = async () => {
  try {
    const [
      hocVien,
      giaoVien,
      xeTapLai,
      lichHoc,
      phongHoc,
      thiSatHach,
      thanhToan,
    ] = await Promise.all([
      getAll("/hoc-vien"),
      getAll("/giao-vien"),
      getAll("/xe-tap-lai"),
      getAll("/lich-hoc"),
      getAll("/phong-hoc"),
      getAll("/thi-sat-hach"),
      getAll("/thanh-toan"),
    ]);

    tongHocVien.value = hocVien.data.length;
    tongGiaoVien.value = giaoVien.data.length;
    tongXeTapLai.value = xeTapLai.data.length;
    tongLichHoc.value = lichHoc.data.length;
    tongPhongHoc.value = phongHoc.data.length;
    tongThiSatHach.value = thiSatHach.data.length;

    doanhThu.value = thanhToan.data.reduce(
      (tong, item) => tong + Number(item.sotien ?? 0),
      0
    );
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  loadDashboard();
});
</script>

<style scoped>
.dashboard-card {
  border-radius: 12px;
  transition: 0.25s;
}

.dashboard-card:hover {
  transform: translateY(-5px);
}

.card {
  border-radius: 12px;
}

.chart-box {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.chart-item span {
  font-weight: 600;
  display: block;
  margin-bottom: 6px;
}

.progress {
  height: 24px;
  border-radius: 10px;
}

.progress-bar {
  font-weight: 600;
}
</style>