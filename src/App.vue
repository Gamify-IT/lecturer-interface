<script setup lang="ts">
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { exampleWorlds, IWorld } from "./ts/models";

const worlds: IWorld[] = exampleWorlds();

const menu = [
  {
    header: "Main Navigation",
    hiddenOnCollapse: false,
  },
];
worlds.forEach((world) => {
  menu.push({
    href: "/worlds/" + world.id,
    title: world.name,
    icon: "fa-user",
  });
});
</script>

<template>
  <div class="app-wrapper">
    <sidebar-menu :menu="menu" :relative="true" />
    <!-- route outlet -->
    <!-- component matched by the route will render here -->
    <div class="router-view-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
body {
  height: 100vh;
}

.app-wrapper {
  display: flex;
}

.app-wrapper .v-sidebar-menu {
  height: 100vh;
}

.router-view-wrapper {
  width: 100%;
  overflow: scroll;
}
</style>
