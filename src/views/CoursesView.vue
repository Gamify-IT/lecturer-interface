<script setup lang="ts">
import { ICourse } from "@/ts/models";
import { getCourses } from "@/ts/course-rest-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const courses = ref(Array<ICourse>());

async function loadCourses() {
  getCourses()
    .then((response) => {
      const result = response.data;
      courses.value = result;
    })
    .catch((error) => {
      console.log(error);
    });
}
const fields = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "courseName",
    label: "Course Name",
  },
  {
    key: "description",
    label: "Description",
  },
];

loadCourses();

const toast = useToast();

const route = useRoute();
</script>

<template>
  <div class="container mt-4">
    <b-table :fields="fields" :items="courses">
      <template #cell(courseName)="data">
        <!-- `data.value` is the value after formatted by the Formatter -->
        <a :href="`#${data.value.replace(/[^a-z]+/i, '-').toLowerCase()}`">{{
          data.value
        }}</a>
      </template>
    </b-table>
  </div>
</template>
