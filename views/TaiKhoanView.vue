<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Tài khoản</h3><p class="text-muted mb-0 small">Quản lý người dùng hệ thống</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm tài khoản')"><i class="bi bi-plus-lg"></i> Thêm tài khoản</button>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm tài khoản..." />
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Tên đăng nhập</th><th>Họ tên</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Lần cuối</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in data" :key="t.username">
              <td class="fw-medium">{{ t.username }}</td><td>{{ t.fullname }}</td><td>{{ t.email }}</td>
              <td><span class="badge" :class="t.roleCls">{{ t.role }}</span></td>
              <td><span class="badge" :class="t.badge">{{ t.status }}</span></td>
              <td>{{ t.lastLogin }}</td>
              <td>
                <button class="btn btn-outline-secondary btn-sm me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { username:'admin', fullname:'Admin', email:'admin@drivehub.vn', role:'Quản trị', status:'Hoạt động', lastLogin:'30/06/2026 08:30', roleCls:'bg-primary bg-opacity-10 text-primary', badge:'bg-success bg-opacity-10 text-success' },
  { username:'hungnv', fullname:'Nguyễn Văn Hùng', email:'hung@drivehub.vn', role:'Giáo viên', status:'Hoạt động', lastLogin:'29/06/2026 14:15', roleCls:'bg-success bg-opacity-10 text-success', badge:'bg-success bg-opacity-10 text-success' },
  { username:'maitt', fullname:'Trần Thị Mai', email:'mai@drivehub.vn', role:'Giáo viên', status:'Hoạt động', lastLogin:'28/06/2026 09:45', roleCls:'bg-success bg-opacity-10 text-success', badge:'bg-success bg-opacity-10 text-success' },
  { username:'tuhv', fullname:'Hoàng Văn Tú', email:'tu@drivehub.vn', role:'Giáo viên', status:'Tạm khóa', lastLogin:'20/06/2026 10:00', roleCls:'bg-success bg-opacity-10 text-success', badge:'bg-warning bg-opacity-10 text-warning' },
  { username:'nguyenvanan', fullname:'Nguyễn Văn An', email:'an.nguyen@email.com', role:'Học viên', status:'Hoạt động', lastLogin:'15/06/2026 07:20', roleCls:'bg-secondary bg-opacity-10 text-secondary', badge:'bg-success bg-opacity-10 text-success' },
]
</script>
