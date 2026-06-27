<template>
  <div class="container-fluid">
    <h2 class="mb-4">Dashboard</h2>

    <p class="text-muted">
      Chào mừng đến hệ thống quản lý trung tâm GPLX
    </p>

    <!-- Card thống kê -->
    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white shadow dashboard-card">
          <div class="card-body">
            <h5>👨‍🎓 Tổng học viên</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-success text-white shadow dashboard-card">
          <div class="card-body">
            <h5>👨‍🏫 Giáo viên</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-warning text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🚗 Xe tập lái</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-danger text-white shadow dashboard-card">
          <div class="card-body">
            <h5>📅 Lịch học</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-info text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🏫 Phòng học</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-dark text-white shadow dashboard-card">
          <div class="card-body">
            <h5>💰 Doanh thu tháng</h5>
            <h2>0đ</h2>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card bg-secondary text-white shadow dashboard-card">
          <div class="card-body">
            <h5>📝 Thi sát hạch hôm nay</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>
    </div>

    <!-- Biểu đồ + Thông báo -->
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
                12 học viên sắp thi sát hạch
              </li>
              <li class="list-group-item">
                5 GPLX đang chờ trả
              </li>
              <li class="list-group-item">
                2 xe tập lái đang bảo trì
              </li>
              <li class="list-group-item">
                8 học viên chưa thanh toán học phí
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Hoạt động gần đây -->
    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h5 class="mb-3">📋 Hoạt động gần đây</h5>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Học viên</th>
              <th>Hoạt động</th>
              <th>Thời gian</th>
              <th>Trạng thái</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>Đăng ký khóa học B2</td>
              <td>Hôm nay</td>
              <td>
                <span class="badge bg-success">Hoàn tất</span>
              </td>
            </tr>

            <tr>
              <td>2</td>
              <td>Trần Văn B</td>
              <td>Thanh toán học phí</td>
              <td>Hôm qua</td>
              <td>
                <span class="badge bg-primary">Đã thanh toán</span>
              </td>
            </tr>

            <tr>
              <td>3</td>
              <td>Lê Văn C</td>
              <td>Thi sát hạch</td>
              <td>2 ngày trước</td>
              <td>
                <span class="badge bg-warning text-dark">Chờ kết quả</span>
              </td>
            </tr>

            <tr>
              <td>4</td>
              <td>Phạm Văn D</td>
              <td>Nhận GPLX</td>
              <td>3 ngày trước</td>
              <td>
                <span class="badge bg-info">Đã nhận</span>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  </div>
</template>

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