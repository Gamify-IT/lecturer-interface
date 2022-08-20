<script setup lang="ts">
import CourseSidebarMenu from "@/components/CourseSidebarMenu.vue";
import { ref } from "vue";

const upClicked = ref();
const downClicked = ref();
</script>

<template>
  <div
    class="app-wrapper"
    tabindex="-1"
    @keydown.up="upClicked = true"
    @keydown.down="downClicked = true"
    @keyup.up="upClicked = false"
    @keyup.down="downClicked = false"
  >
    <CourseSidebarMenu />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div class="router-view-wrapper">
      <router-view
        :upClicked="upClicked"
        :downClicked="downClicked"
      ></router-view>
    </div>
  </div>
</template>
