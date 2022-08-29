<script setup lang="ts">
import CourseSidebarMenu from "@/components/CourseSidebarMenu.vue";
</script>

<template>
  {{ course }}
  <div class="app-wrapper">
    <CourseSidebarMenu />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div class="router-view-wrapper">
      <router-view></router-view>
      <footer class="py-2 footer">
        <div class="notice-right">
          <a href="/third-party-licence-notice">Licence notice</a>
        </div>
      </footer>
    </div>
  </div>
</template>
<style scoped>
.footer {
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  color: maroon;
  text-align: center;
  background-color: #1e1e21;
}
.notice-right {
  text-align: right;
  margin-right: 25px;
}
a {
  color: rgb(118, 66, 177);
  text-decoration: none;
}
</style>
