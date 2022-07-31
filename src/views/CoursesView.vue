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

function printTest(object: PointerEvent) {
  console.log("Test" + object.clientY);
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
    <b-table
      bordered
      striped
      hover
      responsive
      class="table-cursor"
      :fields="fields"
      :items="courses"
      @click="printTest"
    >
      <b-row @click="printTest()"> test </b-row>
    </b-table>
  </div>
</template>

<style>
.table-cursor {
  cursor: pointer;
}
</style>
