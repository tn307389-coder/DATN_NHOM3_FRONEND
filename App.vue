<template>
  <div class="app-layout">
    <Sidebar />

    <div class="main-content">
      <Header />

      <main class="content-area">
        <router-view />
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
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  padding: 25px;
  background: #f4f6f9;
}
</style>