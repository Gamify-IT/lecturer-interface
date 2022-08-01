<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { SidebarHeaderItem, SidebarItem } from "vue-sidebar-menu";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { exampleWorlds, ICourse, IWorld } from "@/ts/models";
import { store } from "@/store";

import { computed } from "vue";
import { useRouter } from "vue-router";
import { getCourse } from "@/ts/course-rest-client";

const router = useRouter();
let course: ICourse;
const menu = ref([]);

const sidebarActive = ["course", "worlds"];

watch(
  () => [router.currentRoute.value.fullPath],
  (newVal) => {
    getCourseIdFromRouter().then((id) => {
      if (course == null || course.id != id) {
        update();
      }
    });
  },
  { deep: true }
);

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
  menu.value.push({
    href: "/courses/" + course.id,
    title: "course : " + course.courseName,
    icon: "bi-book-half",
  });
  const worlds = course.worlds.sort(
    (world1, world2) => world1.index + world2.index
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

function update() {
  console.log("trigger sidebar update");
  showSideBar().then((show) => {
    if (show) {
      getCourseIdFromRouter().then((courseId) => {
        loadCourse(courseId);
      });
    }
  });
}

async function showSideBar(): Promise<boolean> {
  await router.isReady();
  const route = router.currentRoute.value.name;
  if (route) {
    return sidebarActive.includes(route.toString());
  }
  return false;
}

const showSideBarComputed = computed(() => {
  const route = router.currentRoute.value.name;
  if (route) {
    return sidebarActive.includes(route.toString());
  }
  return false;
});

async function getCourseIdFromRouter(): Promise<number> {
  console.log(showSideBar);
  await router.isReady();
  const args = router.currentRoute.value.fullPath.split("/");
  if (args.length > 2) {
    if (args[1].toLowerCase() == "courses") {
      return parseInt(args[2] as string);
    }
  }
  return 0;
}

update();
</script>

<template>
  <sidebar-menu :menu="menu" :relative="true" v-if="showSideBarComputed" />
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
