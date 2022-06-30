<script setup lang="ts">
import { SidebarMenu } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { exampleWorlds, IWorld } from "./ts/worlds";
import { ref } from "vue";

const worlds: IWorld[] = exampleWorlds();

const menu = [
  {
    header: "Main Navigation",
    hiddenOnCollapse: true,
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
  <sidebar-menu :menu="menu" />

  <!-- route outlet -->
  <!-- component matched by the route will render here -->
  <router-view></router-view>
</template>

<style></style>
