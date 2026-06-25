<template>
  <div class="bg-dark text-white vh-100 p-3" style="width:260px">

    <h4 class="mb-4">
      MENU
    </h4>

    <ul class="nav flex-column">

      <li class="nav-item">
        <router-link class="nav-link text-white" to="/hoc-vien">
          Học viên
        </router-link>
      </li>

      <li class="nav-item">
        <router-link class="nav-link text-white" to="/giao-vien">
          Giáo viên
        </router-link>
      </li>

      <li class="nav-item">
        <router-link class="nav-link text-white" to="/chuong-trinh-hoc">
          Chương trình học
        </router-link>
      </li>

    </ul>

  </div>
</template>