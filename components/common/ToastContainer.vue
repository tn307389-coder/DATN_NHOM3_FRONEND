<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
    <transition-group name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show align-items-center border-0 mb-2"
        role="alert"
        :class="toastClass(toast.type)"
      >
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <i :class="iconClass(toast.type)" class="me-2"></i>
            {{ toast.message }}
          </div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="remove(toast.id)"
          ></button>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const toasts = ref([]);
let idCounter = 0;

const toastClass = (type) => {
  const map = {
    success: "bg-success text-white",
    error: "bg-danger text-white",
    warning: "bg-warning text-dark",
    info: "bg-info text-white",
  };
  return map[type] || "bg-primary text-white";
};

const iconClass = (type) => {
  const map = {
    success: "bi bi-check-circle",
    error: "bi bi-exclamation-triangle",
    warning: "bi bi-exclamation-circle",
    info: "bi bi-info-circle",
  };
  return map[type] || "bi bi-bell";
};

const add = (message, type = "info", duration = 4000) => {
  const id = ++idCounter;
  toasts.value.push({ id, message, type });
  if (duration > 0) {
    setTimeout(() => remove(id), duration);
  }
};

const remove = (id) => {
  toasts.value = toasts.value.filter((t) => t.id !== id);
};

// Make it globally available
window.$toast = { add, remove };
</script>

<style scoped>
.toast {
  min-width: 280px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>