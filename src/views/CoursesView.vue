<script setup lang="ts">
import { ICourse } from "@/ts/models";
import { getCourses } from "@/ts/course-rest-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";

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

function directToCourse(id: string) {
  console.log("Course:" + id);
  router.push("/courses/" + id);
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
      class="table-cursor"
      :fields="fields"
      :items="courses"
    >
      <template
        v-for="(field, index) in fields"
        :key="index"
        #[`cell(${field.key})`]="data"
      >
        <b-row class="table-row" @click="directToCourse(data.item.id)">
          {{ data.value }}</b-row
        >
      </template>
    </b-table>
  </div>
</template>

<style>
.table-cursor {
  cursor: pointer;
}
.table-row {
  padding-left: 5px;
}
</style>
