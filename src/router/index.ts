import WorldView from "@/views/WorldView.vue";
import CoursesView from "@/views/CoursesView.vue";
import CourseView from "@/views/CourseView.vue";

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
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
