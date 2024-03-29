<script setup lang="ts">
import { computed, defineProps, nextTick, ref, watch } from "vue";
import "vue-sidebar-menu/dist/vue-sidebar-menu.css";
import { ICourse, IDungeon, IWorld } from "@/ts/models/overworld-models";
import { useRouter } from "vue-router";
import { getCourse } from "@/ts/rest-clients/course-rest-client";

const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
    if (newBoolean) {
      currentElement.value.focus();
    }
  },
  { deep: true }
);

watch(
  () => props.upClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickUp();
    }
  },
  { deep: true }
);

watch(
  () => props.downClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickDown();
    }
  },
  { deep: true }
);

const router = useRouter();
let course: ICourse;
const menu = ref([]);
const inFocus = ref(true);
let currentElement = ref();
let currentElementId = ref();

const sidebarActive = [
  "course",
  "worlds",
  "world-minigames",
  "dungeon-minigames",
  "world-npcs",
  "dungeon-npcs",
  "world-books",
  "dungeon-books",
];

watch(
  () => [router.currentRoute.value.fullPath],
  () => {
    getCourseIdFromRouter().then((id) => {
      if (course == null || course.id != id) {
        update();
      }
    });
  },
  { deep: true }
);

async function loadCourse(id: number) {
  getCourse(id)
    .then(async (response) => {
      const result: ICourse = response.data;
      course = result;
      console.log(course);
      loadMenu();
      await nextTick();
      currentElement.value = document
        .getElementsByClassName("vsm--link")
        .item(0);
      currentElementId.value = 0;
      currentElement.value.focus();
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
    href: "/",
    title: "Back to course overview",
    icon: "bi-card-heading",
  });
  menu.value.push({
    href: "/courses/" + course.id,
    title: "Course: " + course.courseName,
    icon: "bi-book-half",
  });

  course.worlds.sort((world1, world2) => world1.index - world2.index);

  const worlds: IWorld[] = course.worlds;

  worlds.forEach((world: IWorld) => {
    world.dungeons.sort(
      (dungeon1, dungeon2) => dungeon1.index - dungeon2.index
    );

    const dungeons: IDungeon[] = world.dungeons;
    const dungeonChild = dungeons.map((dungeon) => {
      return {
        title: "Dungeon " + dungeon.index,
        icon: "bi-tablet-landscape",
        child: [
          {
            href:
              "/courses/" +
              course.id +
              "/worlds/" +
              world.index +
              "/dungeons/" +
              dungeon.index +
              "/minigames",
            title: "Minigames",
            icon: "bi-puzzle-fill",
          },
          {
            href:
              "/courses/" +
              course.id +
              "/worlds/" +
              world.index +
              "/dungeons/" +
              dungeon.index +
              "/npcs",
            title: "NPC",
            icon: "bi-person-fill",
          },
          {
            href:
              "/courses/" +
              course.id +
              "/worlds/" +
              world.index +
              "/dungeons/" +
              dungeon.index +
              "/books",
            title: "Book",
            icon: "bi-book-fill",
          },
        ],
      };
    });

    const taskChild = [
      {
        href: "/courses/" + course.id + "/worlds/" + world.index + "/minigames",
        title: "Minigames",
        icon: "bi-puzzle-fill",
      },
      {
        href: "/courses/" + course.id + "/worlds/" + world.index + "/npcs",
        title: "NPC",
        icon: "bi-person-fill",
      },
      {
        href: "/courses/" + course.id + "/worlds/" + world.index + "/books",
        title: "Book",
        icon: "bi-book-fill",
      },
    ];

    menu.value.push({
      href: "/courses/" + course.id + "/worlds/" + world.index,
      title: world.staticName,
      icon: "bi-map-fill",
      child: [...taskChild, ...dungeonChild],
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

function clickUp() {
  //NOSONAR
  if (showSideBarComputed.value && inFocus.value) {
    let elements = document.getElementsByClassName("vsm--link");
    let previousElement = elements.item(elements.length - 1);
    let foundElement = false;
    if (currentElement.value == null) {
      currentElement.value = previousElement;
      currentElement.value.focus();
      currentElementId.value = elements.length - 1;
      foundElement = true;
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (currentElement.value == elements.item(i)) {
          currentElement.value = previousElement;
          if (i - 1 >= 0) {
            currentElementId.value = i - 1;
          } else {
            currentElementId.value = elements.length - 1;
          }
          currentElement.value.focus();
          foundElement = true;
          break;
        } else {
          previousElement = elements.item(i);
        }
      }
    }
    if (!foundElement) {
      currentElement.value = elements.item(currentElementId.value);
      currentElement.value.focus();
    }
  }
}

function clickDown() {
  //NOSONAR
  if (showSideBarComputed.value && inFocus.value) {
    let elements = document.getElementsByClassName("vsm--link");
    let firstElement = elements.item(0);
    let foundElement = false;
    if (currentElement.value == null) {
      currentElement.value = firstElement;
      currentElement.value.focus();
      foundElement = true;
      currentElementId.value = 0;
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (currentElement.value == elements.item(i)) {
          if (i + 1 < elements.length) {
            currentElement.value = elements.item(i + 1);
            currentElementId.value = i + 1;
          } else {
            currentElement.value = firstElement;
            currentElementId.value = 0;
          }
          currentElement.value.focus();
          break;
        }
      }
    }
    if (!foundElement) {
      currentElement.value = elements.item(currentElementId.value);
      currentElement.value.focus();
    }
  }
}
update();
</script>

<template>
  <sidebar-menu
    :menu="menu"
    :relative="true"
    :showOneChild="true"
    :id="`sidebar`"
    v-if="showSideBarComputed"
  >
  </sidebar-menu>
</template>

<style>
.app-wrapper {
  height: 100vh;
  display: flex;
}

.v-sidebar-menu {
  height: 100%;
}

.v-sidebar-menu .vsm--link:focus {
  box-shadow: 0px 0px 0px 2px #ffffff;
  border-radius: 2px;
}

.router-view-wrapper {
  width: 100%;
  overflow: scroll;
}
.v-sidebar-menu .vsm--dropdown {
  padding-left: 30px;
}
</style>
