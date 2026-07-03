<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Quản lý giáo viên</h2>
        <p class="text-muted">Danh sách giáo viên giảng dạy</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm giáo viên
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm giáo viên..." />
          </div>

          <div class="col-md-3">
            <select class="form-select">
              <option>Tất cả hạng dạy</option>
              <option>A1</option>
              <option>B1</option>
              <option>B2</option>
              <option>C</option>
            </select>
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th>STT</th>
              <th>Họ tên</th>
              <th>Ngày sinh</th>
              <th>Giới tính</th>
              <th>Số điện thoại</th>
              <th>Email</th>
              <th>Hạng dạy</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn An</td>
              <td>1985-05-10</td>
              <td>Nam</td>
              <td>0901111222</td>
              <td>gv001@gmail.com</td>
              <td>B2</td>
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

        <div class="text-muted">Hiển thị 1 giáo viên</div>
      </div>
    </div>
  </div>
</template>