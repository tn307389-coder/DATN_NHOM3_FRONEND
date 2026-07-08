<template>
  <router-view v-if="$route.path === '/login'" />

  <div v-else class="app-layout">
    <Sidebar />

    <div class="main-content">
      <Header />

      <main class="content-area">
        <div class="page-container">
          <router-view />
        </div>
      </main>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import Footer from "./components/layout/Footer.vue";
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #f3f6fb;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.content-area {
  flex: 1;
  padding: 28px;
  background: linear-gradient(180deg, #f3f6fb, #eef2f7);
}

.page-container {
  max-width: 100%;
  animation: fadeIn 0.25s ease-in-out;
}

:deep(.card) {
  border: none;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
}

:deep(.card-body) {
  padding: 24px;
}

:deep(h2) {
  font-weight: 800;
  color: #111827;
}

:deep(.text-muted) {
  color: #6b7280 !important;
}

:deep(.btn) {
  border-radius: 12px;
  font-weight: 600;
  padding: 8px 14px;
}

:deep(.btn-primary) {
  background: linear-gradient(135deg, #0d6efd, #2563eb);
  border: none;
  box-shadow: 0 6px 16px rgba(13, 110, 253, 0.28);
}

:deep(.btn-primary:hover) {
  background: linear-gradient(135deg, #0b5ed7, #1d4ed8);
}

:deep(.form-control),
:deep(.form-select) {
  border-radius: 12px;
  border: 1px solid #dbe3ef;
  padding: 10px 14px;
}

:deep(.form-control:focus),
:deep(.form-select:focus) {
  border-color: #0d6efd;
  box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.12);
}

:deep(.table) {
  margin-bottom: 0;
  border-radius: 14px;
  overflow: hidden;
}

:deep(.table thead th) {
  background: #f8fafc;
  color: #111827;
  font-weight: 700;
  border-bottom: 1px solid #e5e7eb;
  padding: 14px;
}

:deep(.table tbody td) {
  padding: 14px;
  color: #374151;
  vertical-align: middle;
}

:deep(.table tbody tr:hover) {
  background: #f1f5f9;
}

:deep(.badge) {
  border-radius: 999px;
  padding: 7px 10px;
  font-weight: 600;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>