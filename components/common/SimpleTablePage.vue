<template>
  <div>
    <div class="d-flex flex-wrap justify-content-end mb-4 gap-2">
      <button v-if="canAdd" class="btn btn-primary rounded-pill px-4 shadow-sm" @click="$emit('add')">
        <i class="bi bi-plus-lg me-1"></i> Thêm mới
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-4">
        <div class="row mb-3">
          <div class="col-md-5 col-lg-4">
            <div class="input-group">
              <span class="input-group-text bg-white border-end-0">
                <i class="bi bi-search text-muted"></i>
              </span>
              <input
                v-model="keyword"
                class="form-control border-start-0 ps-0"
                :placeholder="searchPlaceholder"
              />
            </div>
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-primary bg-gradient">
              <tr>
                <th v-for="col in columns" :key="col.key" class="fw-semibold text-nowrap">
                  {{ col.label }}
                </th>
                <th class="text-center fw-semibold text-nowrap">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in filteredRows" :key="index" class="align-middle">
                <td v-for="col in columns" :key="col.key">
                  <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
                    {{ row[col.key] }}
                  </slot>
                </td>
                <td class="text-center text-nowrap">
                  <button
                    v-if="canEdit"
                    class="btn btn-sm btn-outline-warning rounded-circle me-1"
                    title="Sửa"
                    @click="$emit('edit', row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <slot name="extra-actions" :row="row" />
                  <button
                    v-if="canDelete"
                    class="btn btn-sm btn-outline-danger rounded-circle"
                    title="Xoá"
                    @click="handleDelete(row)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Đang tải...</span>
          </div>
          <p class="text-muted mb-0">Đang tải dữ liệu...</p>
        </div>

        <div v-else-if="error" class="text-center py-5">
          <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
          <p class="text-warning mt-2 mb-1">Không thể tải dữ liệu</p>
          <p class="text-muted small mb-2">{{ error }}</p>
          <button class="btn btn-outline-primary btn-sm rounded-pill" @click="$emit('reload')">
            <i class="bi bi-arrow-clockwise me-1"></i> Thử lại
          </button>
        </div>

        <div v-else-if="filteredRows.length === 0" class="text-center py-5">
          <slot name="empty-state">
            <i class="bi bi-inbox display-1 text-muted"></i>
            <p class="text-muted mt-2 mb-0">Không có dữ liệu</p>
          </slot>
        </div>

        <div v-else class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
          <small class="text-muted">
            <i class="bi bi-list-ul me-1"></i> Hiển thị {{ filteredRows.length }} dữ liệu
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { deleteData } from "../../services/crudService";

const props = defineProps({
  title: { type: String, default: "" },
  subtitle: { type: String, default: "" },
  searchPlaceholder: { type: String, default: "Tìm kiếm..." },
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  endpoint: { type: String, default: "" },
  idKey: { type: String, default: "" },
  editable: { type: Boolean, default: true },
  deletable: { type: Boolean, default: true },
  addable: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const emit = defineEmits(["add", "edit", "reload"]);

const readOnly = inject("readOnly", ref(false));
const canAdd = computed(() => !readOnly.value && props.addable);
const canEdit = computed(() => !readOnly.value && props.editable);
const canDelete = computed(() => !readOnly.value && props.deletable);

const keyword = ref("");

const filteredRows = computed(() => {
  if (!keyword.value) return props.rows;
  const k = keyword.value.toLowerCase();
  return props.rows.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(k))
  );
});

const handleDelete = async (row) => {
  if (!props.endpoint || !props.idKey) {
    window.$toast?.add("Trang này chưa cấu hình chức năng xóa", "warning");
    return;
  }
  const id = row[props.idKey];
  if (!id) {
    window.$toast?.add("Không tìm thấy ID để xóa", "error");
    return;
  }
  if (!confirm("Bạn có chắc muốn xóa dữ liệu này không?")) return;
  try {
    await deleteData(props.endpoint, id);
    window.$toast?.add("Xóa thành công", "success");
    emit("reload");
  } catch (error) {
    console.log(error);
    window.$toast?.add("Xóa thất bại", "error");
  }
};
</script>

<style scoped>
.table-primary.bg-gradient {
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%) !important;
}
.table > :not(caption) > * > * {
  padding: 0.75rem 0.5rem;
}
.table tbody tr:hover {
  background-color: #f0f7ff;
}
.btn-outline-warning { border-color: #ffc107; color: #ffc107; }
.btn-outline-warning:hover { background: #ffc107; color: #fff; }
.btn-outline-danger { border-color: #dc3545; color: #dc3545; }
.btn-outline-danger:hover { background: #dc3545; color: #fff; }
</style>
