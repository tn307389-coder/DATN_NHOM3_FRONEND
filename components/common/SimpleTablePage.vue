<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2>{{ title }}</h2>
        <p class="text-muted mb-0">{{ subtitle }}</p>
      </div>

      <button v-if="canAdd" class="btn btn-primary" @click="$emit('add')">
        <i class="bi bi-plus-circle me-1"></i>
        Thêm mới
      </button>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-md-4">
            <input
              v-model="keyword"
              class="form-control"
              :placeholder="searchPlaceholder"
            />
          </div>
        </div>

        <table class="table table-hover align-middle">
          <thead class="table-light">
            <tr>
              <th v-for="col in columns" :key="col.key">
                {{ col.label }}
              </th>

              <th class="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, index) in filteredRows" :key="index">
              <td v-for="col in columns" :key="col.key">
                {{ row[col.key] }}
              </td>

              <td class="text-center">
                <button
                  v-if="canEdit"
                  class="btn btn-sm btn-warning me-2"
                  @click="$emit('edit', row)"
                >
                  <i class="bi bi-pencil-square"></i>
                </button>

                <slot name="extra-actions" :row="row" />

                <button
                  v-if="canDelete"
                  class="btn btn-sm btn-danger"
                  @click="handleDelete(row)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>

            <tr v-if="filteredRows.length === 0">
              <td
                :colspan="columns.length + 1"
                class="text-center text-muted py-4"
              >
                Không có dữ liệu
              </td>
            </tr>
          </tbody>
        </table>

        <div class="text-muted mt-3">
          Hiển thị {{ filteredRows.length }} dữ liệu
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject, ref } from "vue";
import { deleteData } from "../../services/crudService";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    default: "",
  },
  searchPlaceholder: {
    type: String,
    default: "Tìm kiếm...",
  },
  columns: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  endpoint: {
    type: String,
    default: "",
  },
  idKey: {
    type: String,
    default: "",
  },
  editable: {
    type: Boolean,
    default: true,
  },
  deletable: {
    type: Boolean,
    default: true,
  },
  addable: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["add", "edit", "reload"]);

// Chế độ chỉ xem (view) được cung cấp từ layout theo vai trò + trang
const readOnly = inject("readOnly", ref(false));
const canAdd = computed(() => !readOnly.value && props.addable);
const canEdit = computed(() => !readOnly.value && props.editable);
const canDelete = computed(() => !readOnly.value && props.deletable);

const keyword = ref("");

const filteredRows = computed(() => {
  if (!keyword.value) {
    return props.rows;
  }

  const key = keyword.value.toLowerCase();

  return props.rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(key)
    )
  );
});

const handleDelete = async (row) => {
  if (!props.endpoint || !props.idKey) {
    alert("Trang này chưa cấu hình chức năng xóa");
    return;
  }

  const id = row[props.idKey];

  if (!id) {
    alert("Không tìm thấy ID để xóa");
    return;
  }

  const confirmDelete = confirm("Bạn có chắc muốn xóa dữ liệu này không?");

  if (!confirmDelete) {
    return;
  }

  try {
    await deleteData(props.endpoint, id);
    alert("Xóa thành công");
    emit("reload");
  } catch (error) {
    console.log(error);
    alert("Xóa thất bại");
  }
};
</script>