import WorldView from "@/views/WorldView.vue";
import CoursesView from "@/views/CoursesView.vue";
import CourseView from "@/views/CourseView.vue";
import MinigameTasksView from "@/views/MinigameTasksView.vue";

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "courses",
    component: CoursesView,
  },
  {
    path: "/courses/:id",
    name: "course",
    component: CourseView,
  },
  {
    path: "/courses/:courseId/worlds/:worldIndex",
    name: "worlds",
    component: WorldView,
  },
  {
    path: "/courses/:courseId/worlds/:worldIndex/minigames",
    name: "world-minigames",
    component: MinigameTasksView,
  },
  {
    path: "/courses/:courseId/worlds/:worldIndex/dungeons/:dungeonIndex/minigames",
    name: "dungeon-minigames",
    component: MinigameTasksView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
