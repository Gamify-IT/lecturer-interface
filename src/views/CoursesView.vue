<script setup lang="ts">
import { ICourse, ICourseItem } from "@/ts/models/overworld-models";
import { getCourses } from "@/ts/rest-clients/course-rest-client";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { BCol } from "bootstrap-vue-3";
import CreateCourseModal from "@/components/CourseComponents/CreateCourseModal.vue";
import CloneCourseModal from "@/components/CourseComponents/CloneCourseModal.vue";

const loading = ref(false);

const courses = ref(Array<ICourse>());

const router = useRouter();

let currentFocus = ref(-1);
let courseItems = ref(Array<ICourseItem>());

const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
});

watch(
  () => props.upClicked,
  (newBoolean) => {
    if (newBoolean) {
      courseUp();
    }
  },
  { deep: true }
);

watch(
  () => props.downClicked,
  (newBoolean) => {
    if (newBoolean) {
      courseDown();
    }
  },
  { deep: true }
);
let showCreateModal = ref(false);
let showCloneModal = ref(false);
let currentCourse = ref();

async function loadCourses() {
  loading.value = true;
  getCourses()
    .then((response) => {
      courses.value = response.data;
      courses.value.forEach((course) => {
        courseItems.value.push({
          id: course.id,
          semester: course.semester,
          courseName: course.courseName,
          description: course.description,
          active: course.active,
          _rowVariant: "",
        });
      });
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      loading.value = false;
      let currentCourseId = getFirstCourse();
      document.getElementById("invisible-button" + currentCourseId)?.focus();
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
  courseItems.value.push({
    id: course.id,
    semester: course.semester,
    courseName: course.courseName,
    description: course.description,
    active: course.active,
    _rowVariant: "",
  });
  showCreateModal.value = false;
}
function finishClone(course: ICourse) {
  courses.value.push(course);
  courseItems.value.push({
    id: course.id,
    semester: course.semester,
    courseName: course.courseName,
    description: course.description,
    active: course.active,
    _rowVariant: "",
  });
  showCloneModal.value = false;
}
function closedCloneModal() {
  showCloneModal.value = false;
}
function closedCreateModal() {
  showCreateModal.value = false;
}

function courseUp() {
  if (currentFocus.value == -1) {
    let currentCourseId = getLastCourse();
    document.getElementById("invisible-button" + currentCourseId)?.focus();
  } else {
    let currentCourseId = "";
    let found = false;
    let last = false;
    courseItems.value.forEach((course) => {
      if (course.id == currentFocus.value) {
        found = true;
        if (currentCourseId == "") {
          last = true;
        }
      }
      if (!found || last) {
        currentCourseId = course.id.toString();
      }
    });
    document.getElementById("invisible-button" + currentCourseId)?.focus();
  }
}

function getLastCourse(): string {
  let currentCourseId = "";
  courseItems.value.forEach((course) => {
    currentCourseId = course.id.toString();
  });
  return currentCourseId;
}

function courseDown() {
  console.log("downClicked");
  if (currentFocus.value == -1) {
    let currentCourseId = getFirstCourse();
    document.getElementById("invisible-button" + currentCourseId)?.focus();
  } else {
    let currentCourseId = "";
    let found = false;
    courseItems.value.forEach((course) => {
      if (found) {
        currentCourseId = course.id.toString();
        found = false;
      }
      if (course.id == currentFocus.value) {
        found = true;
      }
    });
    if (currentCourseId == "") {
      currentCourseId = getFirstCourse();
    }
    document.getElementById("invisible-button" + currentCourseId)?.focus();
  }
}

function getFirstCourse(): string {
  let currentCourseId = "";
  courseItems.value.forEach((course) => {
    if (currentCourseId == "") {
      currentCourseId = course.id.toString();
    }
  });
  return currentCourseId;
}

function startFocus(row: ICourse) {
  for (let courseItem of courseItems.value) {
    if (courseItem.id == row.id) {
      courseItem._rowVariant = "dark";
      break;
    }
  }
  currentFocus.value = row.id;
}

function resetFocus(row: ICourse) {
  for (let courseItem of courseItems.value) {
    if (courseItem.id == row.id) {
      courseItem._rowVariant = "";
      break;
    }
  }
  currentFocus.value = -1;
  console.log(currentFocus.value);
}

function backToLandingPage() {
  window.parent.postMessage("CLOSE ME");
}
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <b-alert show dismissible>
        Here is the course overview. <br />
        You can view your course by clicking on the row or create a new course
        with the button below.
      </b-alert>
      <b-table bordered striped hover :fields="fields" :items="courseItems">
        <template
          v-for="(field, index) in fields"
          :key="index"
          #[`cell(${field.key})`]="data"
        >
          <div v-if="field.key !== 'clone'">
            <b-col
              v-if="data.item.active"
              class="table-cursor"
              @click="directToCourse(data.item.id)"
            >
              {{ data.value }}</b-col
            >
            <b-col
              v-else
              class="table-row-inactive table-cursor"
              @click="directToCourse(data.item.id)"
            >
              {{ data.value }}
            </b-col>
          </div>
          <div v-else>
            <button
              class="invisible-button"
              @focusin="startFocus(data.item)"
              @focusout="resetFocus(data.item)"
              @keydown.enter="directToCourse(data.item.id)"
              :id="'invisible-button' + data.item.id"
            ></button>
            <b-button @click="startClone(data.item)" size="sm">
              Clone
            </b-button>
          </div>
        </template>
      </b-table>
      <b-button variant="success" @click="showCreateModalFun">
        Create new course
      </b-button>
      <b-button
        variant="primary"
        class="float-right"
        @click="backToLandingPage"
      >
        Back to main menu
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
  </b-overlay>
</template>

<style>
.table-cursor {
  cursor: pointer;
}
.table-row-inactive {
  color: grey;
}
.invisible-button {
  background-color: transparent;
  border-color: transparent;
  margin-left: 5px;
}
.invisible-button:focus {
  outline: none;
}
.float-right {
  float: right;
}
</style>
