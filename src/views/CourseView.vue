<script setup lang="ts">
import { ICourse } from "@/ts/models";
import { getCourse } from "@/ts/course-rest-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const id = route.params.id;
const course = ref();

async function loadCourse(id: any) {
  console.log("load course");
  console.log(id);
  if (isNaN(id)) {
    console.log("NAN");
    return;
  }
  getCourse(id)
    .then((response) => {
      const result = response.data;
      course.value = result;
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

loadCourse(id);

const toast = useToast();
</script>

<template>
  <div class="container mt-4">
    <div v-if="course != null" class="">
      <h1 class="h1">Course name: {{ course.courseName }}</h1>
    </div>
    <div v-else>
      <div
        class="alert alert-danger alert-dismissible d-flex align-items-center fade show"
      >
        <em class="bi-exclamation-octagon-fill"></em>
        <strong class="mx-2">Error!</strong>
        Course with id {{ id }} not found!
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    </div>
  </div>
</template>
