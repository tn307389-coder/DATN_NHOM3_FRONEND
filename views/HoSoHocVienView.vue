<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Hồ sơ học viên</h3><p class="text-muted mb-0 small">Quản lý hồ sơ đăng ký của học viên</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm hồ sơ')"><i class="bi bi-plus-lg"></i> Thêm hồ sơ</button>
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
      <div class="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm hồ sơ..." />
        </div>
        <select class="form-select form-select-sm" style="width:auto;"><option>Tất cả trạng thái</option><option>Đã duyệt</option><option>Chờ duyệt</option><option>Thiếu giấy tờ</option></select>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Mã HS</th><th>Học viên</th><th>Hạng</th><th>Ngày nộp</th><th>Giấy tờ</th><th>Trạng thái</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="h in data" :key="h.ma">
              <td>{{ h.ma }}</td><td class="fw-medium">{{ h.hv }}</td><td>{{ h.hang }}</td><td>{{ h.ngayNop }}</td>
              <td>{{ h.giayTo }}</td><td><span class="badge" :class="h.badge">{{ h.status }}</span></td>
              <td><button class="btn btn-outline-secondary btn-sm"><i class="bi bi-eye"></i> Xem</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { ma:'HS001', hv:'Nguyễn Văn An', hang:'B1', ngayNop:'15/06/2026', giayTo:'Đầy đủ', status:'Đã duyệt', badge:'bg-success bg-opacity-10 text-success' },
  { ma:'HS002', hv:'Trần Thị Bình', hang:'B2', ngayNop:'14/06/2026', giayTo:'Đầy đủ', status:'Đã duyệt', badge:'bg-success bg-opacity-10 text-success' },
  { ma:'HS003', hv:'Lê Văn Cường', hang:'C', ngayNop:'12/06/2026', giayTo:'Đầy đủ', status:'Chờ duyệt', badge:'bg-warning bg-opacity-10 text-warning' },
  { ma:'HS004', hv:'Phạm Thị Dung', hang:'B1', ngayNop:'10/06/2026', giayTo:'Thiếu CMND', status:'Thiếu giấy tờ', badge:'bg-danger bg-opacity-10 text-danger' },
  { ma:'HS005', hv:'Hoàng Văn Em', hang:'B1', ngayNop:'08/06/2026', giayTo:'Đầy đủ', status:'Chờ duyệt', badge:'bg-warning bg-opacity-10 text-warning' },
]
const sum = [
  { value: data.length, label: 'Tổng hồ sơ', clr: '' },
  { value: data.filter(h=>h.status==='Đã duyệt').length, label: 'Đã duyệt', clr: '#198754' },
  { value: data.filter(h=>h.status==='Chờ duyệt').length, label: 'Chờ duyệt', clr: '#ffc107' },
  { value: data.filter(h=>h.status==='Thiếu giấy tờ').length, label: 'Thiếu', clr: '#dc3545' },
]
</script>
