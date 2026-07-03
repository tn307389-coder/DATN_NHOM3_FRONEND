<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Quản lý lịch học</h2>
        <p class="text-muted">Theo dõi lịch học của học viên</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm lịch học
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm học viên..." />
          </div>

          <div class="col-md-3">
            <input type="date" class="form-control" />
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Học viên</th>
              <th>Giáo viên</th>
              <th>Phòng học</th>
              <th>Ngày học</th>
              <th>Giờ bắt đầu</th>
              <th>Giờ kết thúc</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Minh Khang</td>
              <td>Nguyễn Văn An</td>
              <td>Phòng lý thuyết 01</td>
              <td>2026-07-01</td>
              <td>08:00</td>
              <td>10:00</td>
              <td class="text-center">
                <button class="btn btn-sm btn-warning me-2">
                  <i class="bi bi-pencil-square"></i>
                </button>
                <button class="btn btn-sm btn-danger">
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="text-muted">Hiển thị 1 lịch học</div>
      </div>
    </div>
  </div>
</template>