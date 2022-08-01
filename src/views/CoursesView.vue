<script setup lang="ts">
import { ICourse } from "@/ts/models";
import { getCourses } from "@/ts/course-rest-client";
import { postCourse } from "@/ts/course-rest-client";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { BFormInput } from "bootstrap-vue-3";

const courses = ref(Array<ICourse>());

const router = useRouter();

let nameInput = ref();
let descriptionInput = ref();

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

function handleOk() {
  console.log(
    "create Course name: " +
      nameInput.value +
      ", description: " +
      descriptionInput.value
  );
  postCourse({
    courseName: nameInput.value,
    description: descriptionInput.value,
  }).then((response) => {
    courses.value.push(response.data);
  });
}

function resetModal() {
  nameInput.value = "";
  descriptionInput.value = "";
}
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
    <b-button variant="success" v-b-modal.create-course>
      create new course
    </b-button>
    <b-modal
      title="Create course"
      id="create-course"
      @show="resetModal"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="submitBug(editBug)">
        <b-form-group label="Name" label-for="name">
          <b-form-input id="name" v-model="nameInput"></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="description">
          <b-form-input
            id="description"
            v-model="descriptionInput"
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
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
