<template>
  <div>
    <div class="d-flex flex-wrap justify-content-end mb-4 gap-2">
      <button v-if="canAdd" class="btn btn-primary rounded-pill px-4 shadow-sm" @click="$emit('add')">
        <i class="bi bi-plus-lg me-1"></i> Thêm mới
      </button>
    </div>

    <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-body p-4">
        <div class="row mb-3 g-2 align-items-center">
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
          <div class="col">
            <slot name="filters" />
          </div>
        </div>

        <div class="table-responsive">
          <table class="table table-hover align-middle mb-0 stp-table">
            <thead>
              <tr>
                <th
                  v-for="col in columns"
                  :key="col.key"
                  class="fw-semibold text-nowrap stp-th"
                  :class="{ 'stp-sortable': col.sortable, 'stp-sorted': sortKey === col.key }"
                  @click="col.sortable ? toggleSort(col.key) : null"
                >
                  <span class="d-inline-flex align-items-center gap-1">
                    {{ col.label }}
                    <i
                      v-if="col.sortable && sortKey !== col.key"
                      class="bi bi-arrow-down-up text-muted small stp-sort-icon"
                    ></i>
                    <i
                      v-else-if="col.sortable && sortKey === col.key && sortDir === 'asc'"
                      class="bi bi-sort-up small stp-sort-icon"
                    ></i>
                    <i
                      v-else-if="col.sortable && sortKey === col.key && sortDir === 'desc'"
                      class="bi bi-sort-down small stp-sort-icon"
                    ></i>
                  </span>
                </th>
                <th class="text-center fw-semibold text-nowrap stp-th">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, index) in pagedRows"
                :key="index"
                class="align-middle stp-row"
                :class="{ 'stp-clickable': detailEnabled }"
              >
                <td
                  v-for="col in columns"
                  :key="col.key"
                  @click="detailEnabled ? openDetail(row) : null"
                >
                  <slot :name="'cell-' + col.key" :row="row" :value="row[col.key]">
                    {{ row[col.key] }}
                  </slot>
                </td>
                <td class="text-center text-nowrap">
                  <button
                    v-if="canEdit"
                    class="btn btn-sm btn-outline-warning rounded-circle me-1"
                    title="Sửa"
                    @click.stop="$emit('edit', row)"
                  >
                    <i class="bi bi-pencil"></i>
                  </button>
                  <slot name="extra-actions" :row="row" />
                  <button
                    v-if="canDelete"
                    class="btn btn-sm btn-outline-danger rounded-circle"
                    title="Xoá"
                    @click.stop="handleDelete(row)"
                  >
                    <i class="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="loading" class="pt-3">
          <div
            v-for="n in 6"
            :key="n"
            class="d-flex align-items-center gap-3 mb-2 px-2"
          >
            <div class="stp-skeleton stp-skeleton-avatar"></div>
            <div class="flex-grow-1">
              <div class="stp-skeleton" style="width: 40%"></div>
              <div class="stp-skeleton mt-1" style="width: 70%"></div>
            </div>
          </div>
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

        <div
          v-else
          class="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top"
        >
          <small class="text-muted">
            <i class="bi bi-list-ul me-1"></i> Hiển thị {{ pagedRows.length }} /
            {{ filteredRows.length }} dữ liệu
          </small>
          <div class="d-flex align-items-center gap-2">
            <label class="small text-muted mb-0">
              <i class="bi bi-list-nums me-1"></i>
              <select v-model="pageSize" class="form-select form-select-sm d-inline-block w-auto">
                <option :value="10">10</option>
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
            </label>
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage = 1">
                  <i class="bi bi-chevron-double-left"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="currentPage--">
                  <i class="bi bi-chevron-left"></i>
                </button>
              </li>
              <li
                v-for="p in totalPages"
                :key="p"
                class="page-item"
                :class="{ active: p === currentPage }"
              >
                <button class="page-link" @click="currentPage = p">{{ p }}</button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage++">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </li>
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="currentPage = totalPages">
                  <i class="bi bi-chevron-double-right"></i>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="stpDetailModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow rounded-4 overflow-hidden">
          <div class="modal-header border-bottom-0 pb-0 bg-primary-subtle">
            <h5 class="modal-title fw-bold">
              <slot name="detail-header"><i class="bi bi-info-circle me-2"></i> Chi tiết</slot>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            <slot name="detail" :row="detailRow">
              <pre class="text-muted">{{ detailRow }}</pre>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, nextTick, ref, watch } from "vue";
import { Modal } from "bootstrap";
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
  detailEnabled: { type: Boolean, default: false },
  // Hàm bất đồng bộ (row) => Promise<string> trả về nội dung confirm khi xóa
  deleteConfirmMessage: { type: Function, default: null },
});

const emit = defineEmits(["add", "edit", "reload"]);

const readOnly = inject("readOnly", ref(false));
const canAdd = computed(() => !readOnly.value && props.addable);
const canEdit = computed(() => !readOnly.value && props.editable);
const canDelete = computed(() => !readOnly.value && props.deletable);

const keyword = ref("");
const currentPage = ref(1);
const pageSize = ref(10);
const sortKey = ref("");
const sortDir = ref("asc");

const filteredRows = computed(() => {
  if (!keyword.value) return props.rows;
  const k = keyword.value.toLowerCase();
  return props.rows.filter((row) =>
    Object.values(row).some((v) => String(v).toLowerCase().includes(k))
  );
});

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value;
  const dir = sortDir.value === "asc" ? 1 : -1;
  return [...filteredRows.value].sort((a, b) => {
    const va = a[sortKey.value];
    const vb = b[sortKey.value];
    if (va == null && vb == null) return 0;
    if (va == null) return 1;
    if (vb == null) return -1;
    if (typeof va === "string") return va.localeCompare(String(vb), "vi") * dir;
    return (va - vb) * dir;
  });
});

const totalPages = computed(() =>
  Math.max(1, Math.ceil(sortedRows.value.length / pageSize.value))
);

const pagedRows = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return sortedRows.value.slice(start, start + pageSize.value);
});

watch(keyword, () => {
  currentPage.value = 1;
});
watch([() => props.rows, pageSize, sortKey, sortDir], () => {
  if (currentPage.value > totalPages.value) currentPage.value = totalPages.value;
});

const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortDir.value = "asc";
  }
};

const detailRow = ref(null);
const openDetail = (row) => {
  detailRow.value = row;
  nextTick(() => {
    const el = document.getElementById("stpDetailModal");
    if (el) Modal.getOrCreateInstance(el).show();
  });
};

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
  let message = "Bạn có chắc muốn xóa dữ liệu này không?";
  if (typeof props.deleteConfirmMessage === "function") {
    try {
      const custom = await props.deleteConfirmMessage(row);
      if (typeof custom === "string" && custom) message = custom;
    } catch (e) {
      console.log(e);
      window.$toast?.add("Không thể kiểm tra dữ liệu liên quan", "warning");
    }
  }
  if (!confirm(message)) return;
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
.stp-table thead .stp-th {
  background: linear-gradient(135deg, #e8f0fe 0%, #d2e3fc 100%);
  position: sticky;
  top: 0;
  z-index: 1;
}
.stp-sortable {
  cursor: pointer;
  user-select: none;
}
.stp-sortable:hover {
  color: var(--bs-primary);
}
.stp-sort-icon {
  font-size: 0.75rem;
}
.stp-row {
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}
.stp-clickable {
  cursor: pointer;
}
.stp-clickable:hover {
  background-color: #f0f7ff !important;
}
.stp-skeleton {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #eceef1 25%, #f6f7f9 50%, #eceef1 75%);
  background-size: 200% 100%;
  animation: stp-shimmer 1.2s infinite linear;
}
.stp-skeleton-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex: 0 0 auto;
}
@keyframes stp-shimmer {
  to {
    background-position: -200% 0;
  }
}
.stp-detail-canvas {
  width: 380px;
  max-width: 90vw;
}
</style>
