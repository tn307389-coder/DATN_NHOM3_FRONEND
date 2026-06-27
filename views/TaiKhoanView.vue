<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Quản lý tài khoản</h2>
        <p class="text-muted mb-0">Danh sách tài khoản trong hệ thống</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm tài khoản
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm tài khoản..." />
          </div>

          <div class="col-md-3">
            <select class="form-select">
              <option>Tất cả vai trò</option>
              <option>Admin</option>
              <option>Nhân viên</option>
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
            <tr>
              <td>1</td>
              <td>admin</td>
              <td>Quản trị viên</td>
              <td>Admin</td>
              <td>
                <span class="badge bg-success">Hoạt động</span>
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

        <div class="text-muted">Hiển thị 1 tài khoản</div>
      </div>
    </div>
  </div>
</template>