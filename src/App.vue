<script setup lang="ts">
import { SidebarHeaderItem, SidebarItem } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { exampleWorlds, IWorld } from "./ts/models";

const worlds: IWorld[] = exampleWorlds();

const menu: (SidebarHeaderItem | SidebarItem)[] = [
  {
    header: "Main Navigation",
    hiddenOnCollapse: false,
  },
];
worlds.forEach((world) => {
  menu.push({
    href: "/worlds/" + world.id,
    title: world.name,
    icon: "bi-map-fill",
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
.app-wrapper {
  height: 100vh;
  display: flex;
}

.v-sidebar-menu {
  height: 100%;
}

.router-view-wrapper {
  width: 100%;
  overflow: scroll;
}
</style>
