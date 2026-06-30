<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Học viên</h3><p class="text-muted mb-0 small">Danh sách học viên của trung tâm</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm học viên')"><i class="bi bi-plus-lg"></i> Thêm học viên</button>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm học viên..." />
        </div>
        <div class="d-flex gap-2">
          <select class="form-select form-select-sm" style="width:auto;"><option>Tất cả hạng</option><option>B1</option><option>B2</option><option>C</option></select>
          <select class="form-select form-select-sm" style="width:auto;"><option>Tất cả trạng thái</option><option>Đang học</option><option>Chờ xếp lớp</option><option>Đã tốt nghiệp</option></select>
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th><input type="checkbox" /></th><th>Mã HV</th><th>Họ tên</th><th>Ngày sinh</th><th>SĐT</th><th>Hạng xe</th><th>Ngày đăng ký</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="h in data" :key="h.id">
              <td><input type="checkbox" /></td>
              <td>{{ h.id }}</td><td><span class="fw-medium">{{ h.name }}</span></td>
              <td>{{ h.dob }}</td><td>{{ h.phone }}</td><td>{{ h.hang }}</td><td>{{ h.regDate }}</td>
              <td><span class="badge" :class="h.badge">{{ h.status }}</span></td>
              <td>
                <button class="btn btn-outline-secondary btn-sm me-1"><i class="bi bi-pencil"></i></button>
                <button class="btn btn-outline-danger btn-sm"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="card-footer bg-white d-flex justify-content-between align-items-center small text-muted">
        <span>Hiển thị 1-{{ data.length }} / 256 học viên</span>
        <div>
          <button class="btn btn-outline-secondary btn-sm me-1" disabled><i class="bi bi-chevron-left"></i></button>
          <button class="btn btn-primary btn-sm me-1">1</button>
          <button class="btn btn-outline-secondary btn-sm me-1">2</button>
          <button class="btn btn-outline-secondary btn-sm me-1">3</button>
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-chevron-right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { id:'HV001', name:'Nguyễn Văn An', dob:'15/03/1998', phone:'0987 654 321', hang:'B1', regDate:'15/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { id:'HV002', name:'Trần Thị Bình', dob:'22/07/1999', phone:'0978 123 456', hang:'B2', regDate:'14/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { id:'HV003', name:'Lê Văn Cường', dob:'10/11/1997', phone:'0965 432 109', hang:'C', regDate:'12/06/2026', status:'Chờ xếp lớp', badge:'bg-warning bg-opacity-10 text-warning' },
  { id:'HV004', name:'Phạm Thị Dung', dob:'05/02/2000', phone:'0999 888 777', hang:'B1', regDate:'10/06/2026', status:'Đã tốt nghiệp', badge:'bg-info bg-opacity-10 text-info' },
  { id:'HV005', name:'Hoàng Văn Em', dob:'18/09/1998', phone:'0912 345 678', hang:'B1', regDate:'08/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { id:'HV006', name:'Ngô Thị Phương', dob:'30/05/1996', phone:'0900 111 222', hang:'B2', regDate:'05/06/2026', status:'Đang học', badge:'bg-success bg-opacity-10 text-success' },
  { id:'HV007', name:'Đặng Minh Tâm', dob:'12/12/1997', phone:'0933 444 555', hang:'C', regDate:'03/06/2026', status:'Chờ xếp lớp', badge:'bg-warning bg-opacity-10 text-warning' },
  { id:'HV008', name:'Vũ Thị Lan', dob:'25/08/1999', phone:'0944 555 666', hang:'B1', regDate:'01/06/2026', status:'Đã tốt nghiệp', badge:'bg-info bg-opacity-10 text-info' },
]
</script>
