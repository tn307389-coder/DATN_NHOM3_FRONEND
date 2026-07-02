<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Quản lý thi sát hạch</h2>
        <p class="text-muted mb-0">Theo dõi lịch thi và kết quả thi của học viên</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm lịch thi
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm học viên..." />
          </div>

          <div class="col-md-3">
            <select class="form-select">
              <option>Tất cả kết quả</option>
              <option>Đạt</option>
              <option>Không đạt</option>
              <option>Chưa thi</option>
            </select>
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Mã thi</th>
              <th>Học viên</th>
              <th>Ngày thi</th>
              <th>Kết quả</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>2026-06-26</td>
              <td>
                <span class="badge bg-success">Đạt</span>
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
          </tbody>
        </table>

        <div class="text-muted">Hiển thị 1 lịch thi</div>
      </div>
    </div>
  </div>
</template>