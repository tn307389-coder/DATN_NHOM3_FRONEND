<template>
  <div class="container-fluid">
    <h2 class="mb-4">Phòng học</h2>
    <p class="text-muted">Tổng quan trạng thái phòng học và lịch học.</p>

    <div class="row g-3 mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🏫 Tổng phòng học</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🟢 Phòng đang dùng</h5>
            <h2>0</h2>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white shadow dashboard-card">
          <div class="card-body">
            <h5>🛠️ Phòng bảo trì</h5>
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
    </div>

    <div class="row g-3 mb-4">
      <div class="col-md-8">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <h5 class="mb-3">📊 Biểu đồ phòng theo tháng</h5>
            <div class="chart-box">
              <div class="chart-item">
                <span>Tháng 1</span>
                <div class="progress">
                  <div class="progress-bar bg-primary" style="width: 35%">35%</div>
                </div>
              </div>
              <div class="chart-item">
                <span>Tháng 2</span>
                <div class="progress">
                  <div class="progress-bar bg-success" style="width: 50%">50%</div>
                </div>
              </div>
              <div class="chart-item">
                <span>Tháng 3</span>
                <div class="progress">
                  <div class="progress-bar bg-warning" style="width: 65%">65%</div>
                </div>
              </div>
              <div class="chart-item">
                <span>Tháng 4</span>
                <div class="progress">
                  <div class="progress-bar bg-danger" style="width: 40%">40%</div>
                </div>
              </div>
              <div class="chart-item">
                <span>Tháng 5</span>
                <div class="progress">
                  <div class="progress-bar bg-info" style="width: 75%">75%</div>
                </div>
              </div>
              <div class="chart-item">
                <span>Tháng 6</span>
                <div class="progress">
                  <div class="progress-bar bg-dark" style="width: 90%">90%</div>
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
              <li class="list-group-item">0 phòng trống</li>
              <li class="list-group-item">0 phòng cần sửa</li>
              <li class="list-group-item">0 lịch học đổi</li>
              <li class="list-group-item">0 giáo viên cần hỗ trợ</li>
            </ul>
          </div>
        </div>
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
  <h2>Phòng học</h2>
</template>
