<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { SidebarHeaderItem, SidebarItem } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { exampleWorlds, ICourse, IWorld } from "./ts/models";
import { store } from "@/store";

import { computed } from "vue";
import { useRouter } from "vue-router";
import { getCourse } from "./ts/course-rest-client";

const router = useRouter();
let course: ICourse;
const menu = ref([]);

function loadCourse(id: number) {
  getCourse(id)
    .then((response) => {
      const result: ICourse = response.data;
      course = result;
      console.log(course);
      loadMenu();
    })
    .catch((error) => {
      console.log(error);
    });
}

function loadMenu() {
  if (course == null) {
    return;
  }
  menu.value = [
    {
      header: "Main Navigation",
      hiddenOnCollapse: false,
    },
  ];
  const worlds = course.worlds.sort(
    (world1, world2) => world1.index > world2.index
  );
  worlds.forEach((world: IWorld) => {
    menu.value.push({
      href: "/courses/" + course.id + "/worlds/" + world.index,
      title: world.staticName,
      icon: "bi-map-fill",
    });
  });
  console.log("LOADED MENU");
  console.log(menu.value);
}

getCourseId().then((courseId) => {
  loadCourse(courseId);
});

const sidebarActive = ["course", "worlds"];

const showSideBar = computed(() => {
  const route = router.currentRoute.value.name;
  if (route) {
    return sidebarActive.includes(route.toString());
  }
  return false;
});

async function getCourseId(): Promise<number> {
  console.log(showSideBar);
  await router.isReady();
  const args = router.currentRoute.value.fullPath.split("/");
  console.log("ARGS");
  console.log(args);
  if (args.length > 2) {
    if (args[1].toLowerCase() == "courses") {
      return parseInt(args[2] as string);
    }
  }
  return 0;
}
</script>

<template>
  {{ course }}
  <div class="app-wrapper">
    <sidebar-menu :menu="menu" :relative="true" v-if="showSideBar" />
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
