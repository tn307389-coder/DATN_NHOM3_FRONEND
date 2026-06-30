<template>
  <div>
    <h3 class="fw-bold">Tra cứu & Trả GPLX</h3>
    <p class="text-muted">Tra cứu thông tin và quản lý việc trả GPLX</p>
    <div class="row g-3">
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold"><i class="bi bi-search text-primary"></i> Tra cứu GPLX</div>
          <div class="card-body">
            <div class="mb-3"><label class="form-label small fw-medium">Số GPLX / CMND</label><input class="form-control" placeholder="Nhập số GPLX hoặc CMND..." /></div>
            <button class="btn btn-primary mb-3" @click="alert('Kết quả tra cứu GPLX')"><i class="bi bi-search"></i> Tra cứu</button>
            <hr />
            <div class="bg-light rounded p-3 small">
              <p class="fw-medium mb-2 text-muted">Kết quả tra cứu mẫu:</p>
              <p class="mb-1"><strong>Họ tên:</strong> Nguyễn Văn An</p>
              <p class="mb-1"><strong>Số GPLX:</strong> 790123456789</p>
              <p class="mb-1"><strong>Hạng:</strong> B1</p>
              <p class="mb-1"><strong>Ngày cấp:</strong> 20/06/2026</p>
              <p class="mb-1"><strong>Nơi cấp:</strong> Sở GTVT Hà Nội</p>
              <p class="mb-0"><strong>Trạng thái:</strong> <span class="badge bg-success bg-opacity-10 text-success">Đã trả</span></p>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card border-0 shadow-sm">
          <div class="card-header bg-white fw-semibold"><i class="bi bi-card-text text-success"></i> Danh sách chờ trả GPLX</div>
          <div class="table-responsive">
            <table class="table table-hover mb-0 small">
              <thead class="table-light"><tr><th>Học viên</th><th>Hạng</th><th>Ngày thi</th><th>GPLX số</th><th>Trạng thái</th></tr></thead>
              <tbody>
                <tr v-for="g in data" :key="g.so">
                  <td class="fw-medium">{{ g.hv }}</td><td>{{ g.hang }}</td><td>{{ g.ngayThi }}</td><td>{{ g.so }}</td>
                  <td><span class="badge" :class="g.badge">{{ g.status }}</span></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="card-footer bg-white">
            <button class="btn btn-success btn-sm" @click="alert('Xác nhận trả GPLX demo')"><i class="bi bi-check-lg"></i> Xác nhận trả GPLX</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const data = [
  { hv:'Nguyễn Văn An', hang:'B1', ngayThi:'10/06/2026', so:'790123456789', status:'Đã trả', badge:'bg-success bg-opacity-10 text-success' },
  { hv:'Trần Thị Bình', hang:'B2', ngayThi:'10/06/2026', so:'790987654321', status:'Chờ trả', badge:'bg-warning bg-opacity-10 text-warning' },
  { hv:'Phạm Thị Dung', hang:'B1', ngayThi:'11/06/2026', so:'790456123789', status:'Chờ trả', badge:'bg-warning bg-opacity-10 text-warning' },
  { hv:'Hoàng Văn Em', hang:'B1', ngayThi:'12/06/2026', so:'790789123456', status:'Đang xử lý', badge:'bg-info bg-opacity-10 text-info' },
]
</script>
