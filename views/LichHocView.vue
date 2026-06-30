<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <div><h3 class="fw-bold mb-0">Lịch học</h3><p class="text-muted mb-0 small">Thời khóa biểu và lịch dạy</p></div>
      <button class="btn btn-primary btn-sm" @click="alert('Demo: Tạo lịch học')"><i class="bi bi-plus-lg"></i> Tạo lịch học</button>
    </div>
    <div class="card border-0 shadow-sm mb-3">
      <div class="card-header bg-white d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-chevron-left"></i></button>
          <span class="fw-semibold">Tháng 06/2026</span>
          <button class="btn btn-outline-secondary btn-sm"><i class="bi bi-chevron-right"></i></button>
        </div>
        <select class="form-select form-select-sm" style="width:auto;"><option>Tất cả lớp</option><option>B1.01</option><option>B2.01</option><option>C.01</option></select>
      </div>
      <div class="table-responsive">
        <table class="table table-bordered mb-0 small align-middle">
          <thead class="table-light">
            <tr><th style="width:100px;">Thứ</th><th>Sáng (7:30 - 11:30)</th><th>Chiều (13:30 - 17:30)</th></tr>
          </thead>
          <tbody>
            <tr v-for="l in lich" :key="l.thu">
              <td class="fw-medium">{{ l.thu }}</td>
              <td><span v-if="l.sang" class="badge bg-primary bg-opacity-10 text-primary">{{ l.sang }}</span><span v-else class="text-muted">—</span></td>
              <td><span v-if="l.chieu" class="badge bg-success bg-opacity-10 text-success">{{ l.chieu }}</span><span v-else class="text-muted">—</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="card border-0 shadow-sm">
      <div class="card-header bg-white fw-semibold">Lịch dạy của giáo viên - Hôm nay</div>
      <div class="table-responsive">
        <table class="table table-hover mb-0 small">
          <thead class="table-light"><tr><th>Giáo viên</th><th>Ca sáng</th><th>Ca chiều</th></tr></thead>
          <tbody>
            <tr v-for="g in gv" :key="g.name">
              <td class="fw-medium">{{ g.name }}</td>
              <td><span v-if="g.sang" class="badge" :class="g.sang.cls">{{ g.sang.text }}</span><span v-else class="text-muted">—</span></td>
              <td><span v-if="g.chieu" class="badge" :class="g.chieu.cls">{{ g.chieu.text }}</span><span v-else class="text-muted">—</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
const lich = [
  { thu:'Thứ 2', sang:'B1.01 - LT - P.101', chieu:'B2.01 - TH - Sân tập' },
  { thu:'Thứ 3', sang:'B1.01 - TH - Sân tập', chieu:'C.01 - LT - P.102' },
  { thu:'Thứ 4', sang:'B2.01 - LT - P.101', chieu:'B1.01 - TH - Đường trường' },
  { thu:'Thứ 5', sang:'C.01 - LT - P.102', chieu:'B2.01 - TH - Sân tập' },
  { thu:'Thứ 6', sang:'B1.01 - TH - Sân tập', chieu:'B2.01 - LT - P.101' },
  { thu:'Thứ 7', sang:'C.01 - TH - Đường trường', chieu:null },
  { thu:'CN', sang:null, chieu:null },
]
const gv = [
  { name:'Nguyễn Văn Hùng', sang:{text:'B1.01 - Thực hành',cls:'bg-success bg-opacity-10 text-success'}, chieu:{text:'B2.01 - Thực hành',cls:'bg-warning bg-opacity-10 text-warning'} },
  { name:'Trần Thị Mai', sang:{text:'B2.01 - Lý thuyết',cls:'bg-primary bg-opacity-10 text-primary'}, chieu:null },
  { name:'Lê Hoàng Nam', sang:null, chieu:{text:'C.01 - Thực hành',cls:'bg-success bg-opacity-10 text-success'} },
]
</script>
