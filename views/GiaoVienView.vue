<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Giáo viên</h3><p class="text-muted mb-0 small">Danh sách giáo viên của trung tâm</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm giáo viên')"><i class="bi bi-plus-lg"></i> Thêm giáo viên</button>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-4" v-for="s in sum" :key="s.label">
        <div class="card border-0 shadow-sm">
          <div class="card-body d-flex align-items-center gap-3">
            <div class="rounded-3 d-flex align-items-center justify-content-center" :style="{ background: s.bg, color: s.clr, width: 44, height: 44 }">
              <i :class="'bi bi-' + s.icon + ' fs-5'"></i>
            </div>
            <div><div class="fs-4 fw-bold">{{ s.value }}</div><div class="text-muted small">{{ s.label }}</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm giáo viên..." />
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Mã GV</th><th>Họ tên</th><th>Chuyên môn</th><th>SĐT</th><th>Email</th><th>Số năm KN</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="g in data" :key="g.id">
              <td>{{ g.id }}</td><td class="fw-medium">{{ g.name }}</td><td>Hạng {{ g.chuyenMon }}</td>
              <td>{{ g.phone }}</td><td>{{ g.email }}</td><td>{{ g.kinhNghiem }}</td>
              <td><span class="badge" :class="g.badge">{{ g.status }}</span></td>
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
  { id:'GV001', name:'Nguyễn Văn Hùng', chuyenMon:'B1, B2', phone:'0912 345 678', email:'hung@drivehub.vn', kinhNghiem:8, status:'Đang dạy', badge:'bg-success bg-opacity-10 text-success' },
  { id:'GV002', name:'Trần Thị Mai', chuyenMon:'B1, B2, C', phone:'0978 901 234', email:'mai@drivehub.vn', kinhNghiem:12, status:'Đang dạy', badge:'bg-success bg-opacity-10 text-success' },
  { id:'GV003', name:'Lê Hoàng Nam', chuyenMon:'C', phone:'0965 432 109', email:'nam@drivehub.vn', kinhNghiem:5, status:'Đang dạy', badge:'bg-success bg-opacity-10 text-success' },
  { id:'GV004', name:'Phạm Thị Hoa', chuyenMon:'B1, B2', phone:'0999 888 777', email:'hoa@drivehub.vn', kinhNghiem:6, status:'Tạm nghỉ', badge:'bg-warning bg-opacity-10 text-warning' },
  { id:'GV005', name:'Hoàng Văn Tú', chuyenMon:'B1, C', phone:'0900 111 222', email:'tu@drivehub.vn', kinhNghiem:10, status:'Đang dạy', badge:'bg-success bg-opacity-10 text-success' },
]
const sum = [
  { icon:'person-badge', bg:'#dbeafe', clr:'#0d6efd', value: data.length, label: 'Tổng giáo viên' },
  { icon:'check-circle', bg:'#d1e7dd', clr:'#198754', value: data.filter(g=>g.status==='Đang dạy').length, label: 'Đang giảng dạy' },
  { icon:'clock', bg:'#fff3cd', clr:'#ffc107', value: data.filter(g=>g.status!=='Đang dạy').length, label: 'Tạm nghỉ' },
]
</script>
