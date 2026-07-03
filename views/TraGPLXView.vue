<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 class="mb-1">Quản lý trả GPLX</h2>
        <p class="text-muted mb-0">Theo dõi thông tin giấy phép lái xe của học viên</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm GPLX
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm GPLX..." />
          </div>

          <div class="col-md-3">
            <select class="form-select">
              <option>Tất cả hạng GPLX</option>
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
              <th>Học viên</th>
              <th>Số GPLX</th>
              <th>Hạng GPLX</th>
              <th>Ngày cấp</th>
              <th>Ngày hết hạn</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Nguyễn Văn A</td>
              <td>GPLX001</td>
              <td>B2</td>
              <td>2026-06-26</td>
              <td>2036-06-26</td>
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

        <div class="text-muted">Hiển thị 1 GPLX</div>
      </div>
    </div>
  </div>
</template>