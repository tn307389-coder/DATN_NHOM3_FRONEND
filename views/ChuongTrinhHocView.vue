<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>Quản lý chương trình học</h2>
        <p class="text-muted">Danh sách chương trình đào tạo lái xe</p>
      </div>

      <button class="btn btn-primary">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm chương trình
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input class="form-control" placeholder="Tìm kiếm chương trình..." />
          </div>

          <div class="col-md-3">
            <select class="form-select">
              <option>Tất cả hạng bằng</option>
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
              <th>Tên chương trình</th>
              <th>Hạng bằng</th>
              <th>Học phí</th>
              <th>Buổi lý thuyết</th>
              <th>Buổi thực hành</th>
              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>1</td>
              <td>Đào tạo lái xe hạng B2</td>
              <td>B2</td>
              <td>15,000,000đ</td>
              <td>12</td>
              <td>25</td>
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

        <div class="text-muted">Hiển thị 1 chương trình</div>
      </div>
    </div>
  </div>
</template>