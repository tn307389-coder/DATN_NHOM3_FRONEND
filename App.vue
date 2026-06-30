<template>
  <div class="d-flex">
    <Sidebar />

    <div class="flex-grow-1">
      <Header />

      <div class="container-fluid p-4">
        <router-view />
      </div>

      <Footer />
    </div>
  </div>
</template>

<script setup>
import Header from "./components/layout/Header.vue";
import Sidebar from "./components/layout/Sidebar.vue";
import Footer from "./components/layout/Footer.vue";
</script>