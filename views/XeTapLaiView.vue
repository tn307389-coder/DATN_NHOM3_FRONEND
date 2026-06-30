<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Xe tập lái</h3><p class="text-muted mb-0 small">Danh sách xe tập lái của trung tâm</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm xe')"><i class="bi bi-plus-lg"></i> Thêm xe</button>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-3" v-for="s in sum" :key="s.label">
        <div class="card border-0 shadow-sm"><div class="card-body">
          <div class="fs-3 fw-bold" :style="{ color: s.clr }">{{ s.value }}</div>
          <div class="text-muted small">{{ s.label }}</div>
        </div></div>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm xe..." />
        </div>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Biển số</th><th>Hiệu xe</th><th>Năm SX</th><th>Hạng</th><th>Số ghế</th><th>Nhiên liệu</th><th>Trạng thái</th><th>Bảo dưỡng</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="x in data" :key="x.bienSo">
              <td class="fw-medium">{{ x.bienSo }}</td><td>{{ x.hieu }}</td><td>{{ x.nam }}</td><td>{{ x.hang }}</td>
              <td>{{ x.choNgoi }}</td><td>{{ x.nhienLieu }}</td>
              <td><span class="badge" :class="x.badge">{{ x.status }}</span></td><td>{{ x.baoDuong }}</td>
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
  { bienSo:'29A-123.45', hieu:'Toyota Vios', nam:2022, hang:'B1, B2', choNgoi:5, nhienLieu:'Xăng', status:'Tốt', baoDuong:'10/05/2026', badge:'bg-success bg-opacity-10 text-success' },
  { bienSo:'29A-123.46', hieu:'Toyota Vios', nam:2022, hang:'B1, B2', choNgoi:5, nhienLieu:'Xăng', status:'Tốt', baoDuong:'10/05/2026', badge:'bg-success bg-opacity-10 text-success' },
  { bienSo:'29B-456.78', hieu:'Hyundai Accent', nam:2023, hang:'B1, B2', choNgoi:5, nhienLieu:'Xăng', status:'Bảo dưỡng', baoDuong:'01/04/2026', badge:'bg-warning bg-opacity-10 text-warning' },
  { bienSo:'29C-789.01', hieu:'Ford Ranger', nam:2021, hang:'C', choNgoi:5, nhienLieu:'Dầu', status:'Tốt', baoDuong:'20/04/2026', badge:'bg-success bg-opacity-10 text-success' },
  { bienSo:'29D-012.34', hieu:'Kia Cerato', nam:2022, hang:'B1, B2', choNgoi:5, nhienLieu:'Xăng', status:'Hỏng', baoDuong:'15/03/2026', badge:'bg-danger bg-opacity-10 text-danger' },
]
const sum = [
  { value: data.length, label: 'Tổng số xe', clr: '' },
  { value: data.filter(x=>x.status==='Tốt').length, label: 'Đang hoạt động', clr: '#198754' },
  { value: data.filter(x=>x.status==='Bảo dưỡng').length, label: 'Đang bảo dưỡng', clr: '#ffc107' },
  { value: data.filter(x=>x.status==='Hỏng').length, label: 'Hỏng', clr: '#dc3545' },
]
</script>
