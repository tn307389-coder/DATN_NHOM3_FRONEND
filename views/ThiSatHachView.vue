<template>
  <div>
    <h3 class="fw-bold">Thi sát hạch</h3>
    <p class="text-muted">Quản lý kỳ thi sát hạch và kết quả</p>
    <div class="row g-3 mb-3">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-semibold"><i class="bi bi-calendar text-primary"></i> Kỳ thi tháng 07/2026</span>
            <span class="badge bg-info bg-opacity-10 text-info">Sắp diễn ra</span>
          </div>
          <div class="card-body small"><p class="mb-1"><strong>Ngày thi:</strong> 15-17/07/2026</p><p class="mb-1"><strong>Số thí sinh:</strong> 45</p><p class="mb-1"><strong>Hạng:</strong> B1, B2, C</p><p class="mb-0"><strong>Địa điểm:</strong> Sân sát hạch Sở GTVT</p></div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white d-flex justify-content-between align-items-center">
            <span class="fw-semibold"><i class="bi bi-check-circle text-success"></i> Kỳ thi tháng 06/2026</span>
            <span class="badge bg-success bg-opacity-10 text-success">Hoàn thành</span>
          </div>
          <div class="card-body small"><p class="mb-1"><strong>Ngày thi:</strong> 10-12/06/2026</p><p class="mb-1"><strong>Số thí sinh:</strong> 42</p><p class="mb-1"><strong>Đỗ:</strong> 32 (76%)</p><p class="mb-0"><strong>Trượt:</strong> 10 (24%)</p></div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white fw-semibold"><i class="bi bi-bar-chart text-purple"></i> Thống kê</div>
          <div class="card-body small"><p class="mb-1"><strong>Tổng kỳ thi:</strong> 6</p><p class="mb-1"><strong>Tổng thí sinh:</strong> 210</p><p class="mb-1"><strong>Tỷ lệ đỗ TB:</strong> 78%</p><p class="mb-0"><strong>GPLX đã cấp:</strong> 164</p></div>
        </div>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white fw-semibold">Kết quả thi gần đây</div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small">
          <thead class="table-light"><tr><th>Học viên</th><th>Hạng</th><th>Lý thuyết</th><th>Thực hành</th><th>Kết quả</th><th>Ngày thi</th></tr></thead>
          <tbody>
            <tr v-for="k in data" :key="k.hv">
              <td class="fw-medium">{{ k.hv }}</td><td>{{ k.hang }}</td><td>{{ k.lyThuyet }}</td><td>{{ k.thucHanh }}</td>
              <td><span class="badge" :class="k.result==='Đỗ'?'bg-success bg-opacity-10 text-success':'bg-danger bg-opacity-10 text-danger'">{{ k.result }}</span></td>
              <td>{{ k.ngay }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { hv:'Nguyễn Văn An', hang:'B1', lyThuyet:'28/30', thucHanh:'Đạt', result:'Đỗ', ngay:'10/06/2026' },
  { hv:'Trần Thị Bình', hang:'B2', lyThuyet:'26/30', thucHanh:'Đạt', result:'Đỗ', ngay:'10/06/2026' },
  { hv:'Lê Văn Cường', hang:'C', lyThuyet:'18/30', thucHanh:'Không đạt', result:'Trượt', ngay:'11/06/2026' },
  { hv:'Phạm Thị Dung', hang:'B1', lyThuyet:'30/30', thucHanh:'Đạt', result:'Đỗ', ngay:'11/06/2026' },
  { hv:'Hoàng Văn Em', hang:'B1', lyThuyet:'27/30', thucHanh:'Đạt', result:'Đỗ', ngay:'12/06/2026' },
]
</script>
