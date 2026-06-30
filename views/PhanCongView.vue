<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Phân công giảng dạy</h3><p class="text-muted mb-0 small">Phân công giáo viên cho các lớp học</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Thêm phân công')"><i class="bi bi-plus-lg"></i> Phân công mới</button>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="input-group input-group-sm" style="max-width:280px;">
          <span class="input-group-text bg-white"><i class="bi bi-search text-muted"></i></span>
          <input class="form-control" placeholder="Tìm kiếm..." />
        </div>
        <select class="form-select form-select-sm" style="width:auto;"><option>Tất cả lớp</option><option>B1.01</option><option>B2.01</option><option>C.01</option></select>
      </div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small align-middle">
          <thead class="table-light">
            <tr><th>Lớp</th><th>Môn học</th><th>Giáo viên</th><th>Ca học</th><th>Phòng</th><th>Ngày bắt đầu</th><th>Ngày kết thúc</th><th>Thao tác</th></tr>
          </thead>
          <tbody>
            <tr v-for="p in data" :key="p.lop + p.mon">
              <td class="fw-medium">{{ p.lop }}</td><td>{{ p.mon }}</td><td>{{ p.gv }}</td><td>{{ p.ca }}</td><td>{{ p.phong }}</td><td>{{ p.tuNgay }}</td><td>{{ p.denNgay }}</td>
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
  { lop:'B1.01', mon:'Lý thuyết', gv:'Nguyễn Văn Hùng', ca:'Sáng (T2, T4)', phong:'P.101', tuNgay:'01/06/2026', denNgay:'31/08/2026' },
  { lop:'B1.01', mon:'Thực hành', gv:'Trần Thị Mai', ca:'Chiều (T2, T4)', phong:'Sân tập', tuNgay:'01/06/2026', denNgay:'31/08/2026' },
  { lop:'B2.01', mon:'Lý thuyết', gv:'Trần Thị Mai', ca:'Sáng (T3, T5)', phong:'P.101', tuNgay:'01/06/2026', denNgay:'30/09/2026' },
  { lop:'B2.01', mon:'Thực hành', gv:'Nguyễn Văn Hùng', ca:'Chiều (T3, T5)', phong:'Sân tập', tuNgay:'01/06/2026', denNgay:'30/09/2026' },
  { lop:'C.01', mon:'Lý thuyết', gv:'Lê Hoàng Nam', ca:'Sáng (T3, T5)', phong:'P.102', tuNgay:'01/05/2026', denNgay:'30/09/2026' },
  { lop:'C.01', mon:'Thực hành', gv:'Hoàng Văn Tú', ca:'Chiều (T3, T5, T7)', phong:'Đường trường', tuNgay:'01/05/2026', denNgay:'30/09/2026' },
]
</script>
