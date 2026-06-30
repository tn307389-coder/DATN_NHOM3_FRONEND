<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Quản lý Thanh toán</h3><p class="text-muted mb-0 small">Theo dõi học phí và các khoản thanh toán</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Tạo hóa đơn')"><i class="bi bi-plus-lg"></i> Tạo hóa đơn</button>
    </div>
    <div class="row g-3 mb-3">
      <div class="col-md-3" v-for="s in sum" :key="s.label">
        <div class="card border-0 shadow-sm"><div class="card-body">
          <div class="fs-3 fw-bold" :style="{ color: s.clr }">{{ s.value }}</div>
          <div class="text-muted small">{{ s.label }}</div>
        </div></div>
      </div>
    </div>
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-header bg-white fw-semibold">Hóa đơn gần đây</div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Mã HD</th><th>Học viên</th><th>Nội dung</th><th>Số tiền</th><th>Ngày tạo</th><th>Hạn thanh toán</th><th>Trạng thái</th></tr>
          </thead>
          <tbody>
            <tr v-for="t in data" :key="t.ma">
              <td>{{ t.ma }}</td><td class="fw-medium">{{ t.hv }}</td><td>{{ t.noiDung }}</td><td>{{ t.soTien }}</td>
              <td>{{ t.ngayTao }}</td><td>{{ t.han }}</td>
              <td><span class="badge" :class="t.badge">{{ t.status }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white fw-semibold">Thống kê thanh toán theo tháng</div>
      <div class="card-body">
        <div class="d-flex align-items-end gap-2" style="height:160px;">
          <div v-for="(m,i) in months" :key="i" class="flex-grow-1 d-flex flex-column align-items-center gap-1">
            <div class="w-100 rounded-top" :style="{ height: m.h + '%', background: i < 7 ? '#198754' : '#0d6efd', maxWidth: 40 }"></div>
            <span class="small text-muted">{{ m.l }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { ma:'HD001', hv:'Nguyễn Văn An', noiDung:'Học phí B1 - Đợt 1', soTien:'5.000.000', ngayTao:'15/06/2026', han:'15/07/2026', status:'Đã thanh toán', badge:'bg-success bg-opacity-10 text-success' },
  { ma:'HD002', hv:'Trần Thị Bình', noiDung:'Học phí B2 - Toàn bộ', soTien:'12.000.000', ngayTao:'14/06/2026', han:'14/07/2026', status:'Chờ thanh toán', badge:'bg-warning bg-opacity-10 text-warning' },
  { ma:'HD003', hv:'Lê Văn Cường', noiDung:'Phí thi sát hạch', soTien:'1.500.000', ngayTao:'12/06/2026', han:'12/07/2026', status:'Chờ thanh toán', badge:'bg-warning bg-opacity-10 text-warning' },
  { ma:'HD004', hv:'Phạm Thị Dung', noiDung:'Học phí B1 - Đợt 2', soTien:'5.000.000', ngayTao:'10/05/2026', han:'10/06/2026', status:'Quá hạn', badge:'bg-danger bg-opacity-10 text-danger' },
  { ma:'HD005', hv:'Hoàng Văn Em', noiDung:'Học phí B1 - Toàn bộ', soTien:'10.000.000', ngayTao:'08/06/2026', han:'08/07/2026', status:'Đã thanh toán', badge:'bg-success bg-opacity-10 text-success' },
]
const sum = [
  { value:'345.000.000 đ', label:'Tổng thu (VND)', clr:'#198754' },
  { value:'280.000.000 đ', label:'Đã thu', clr:'#0d6efd' },
  { value:'45.000.000 đ', label:'Chờ thu', clr:'#ffc107' },
  { value:'20.000.000 đ', label:'Quá hạn', clr:'#dc3545' },
]
const months = [
  {h:35,l:'T1'},{h:50,l:'T2'},{h:40,l:'T3'},{h:65,l:'T4'},{h:55,l:'T5'},{h:75,l:'T6'},
  {h:80,l:'T7'},{h:60,l:'T8'},{h:45,l:'T9'},{h:70,l:'T10'},{h:55,l:'T11'},{h:0,l:'T12'}
]
</script>
