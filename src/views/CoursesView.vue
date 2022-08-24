<script setup lang="ts">
import { ICourse } from "@/ts/models";
import { getCourses } from "@/ts/course-rest-client";
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateCourseModal from "@/components/CreateCourseModal.vue";
import CloneCourseModal from "@/components/CloneCourseModal.vue";

const courses = ref(Array<ICourse>());

const router = useRouter();

let showCreateModal = ref(false);
let showCloneModal = ref(false);
let currentCourse = ref();

async function loadCourses() {
  getCourses()
    .then((response) => {
      courses.value = response.data;
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
  {
    key: "semester",
    label: "Semester",
  },
  {
    key: "clone",
    label: "Clone",
  },
];

loadCourses();

function showCreateModalFun() {
  console.log("CreateModal");
  showCreateModal.value = true;
}
function startClone(row: ICourse) {
  currentCourse.value = row;
  showCloneModal.value = true;
}
function finishCreate(course: ICourse) {
  courses.value.push(course);
  showCreateModal.value = false;
}
function finishClone(course: ICourse) {
  courses.value.push(course);
  showCloneModal.value = false;
}
function closedCloneModal() {
  showCloneModal.value = false;
}
function closedCreateModal() {
  showCreateModal.value = false;
}
</script>

<template>
  <div class="container mt-4">
    <b-table bordered striped hover :fields="fields" :items="courses">
      <template
        v-for="(field, index) in fields"
        :key="index"
        #[`cell(${field.key})`]="data"
      >
        <div v-if="field.key !== 'clone'">
          <b-row
            v-if="data.item.active"
            class="table-row-active table-cursor"
            @click="directToCourse(data.item.id)"
          >
            {{ data.value }}</b-row
          >
          <b-row
            v-else
            class="table-row-inactive table-cursor"
            @click="directToCourse(data.item.id)"
          >
            {{ data.value }}
          </b-row>
        </div>
        <div v-else>
          <b-button @click="startClone(data.item)" size="sm"> clone </b-button>
        </div>
      </template>
    </b-table>
    <b-button variant="success" @click="showCreateModalFun">
      create new course
    </b-button>
    <CreateCourseModal
      :showModal="showCreateModal"
      @created="finishCreate"
      @closedModal="closedCreateModal"
    />
    <CloneCourseModal
      :course="currentCourse"
      :show-modal="showCloneModal"
      @cloned="finishClone"
      @closedModal="closedCloneModal"
    />
  </div>
</template>

<style>
.table-cursor {
  cursor: pointer;
}
.table-row-active {
  padding-left: 5px;
}
.table-row-inactive {
  padding-left: 5px;
  color: grey;
}
</style>
