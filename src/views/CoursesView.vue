<script setup lang="ts">
import { ICourse, ICourseItem } from "@/ts/models";
import {
  getCourses,
  postCloneCourse,
  postCourse,
} from "@/ts/course-rest-client";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import { BCol, BFormInput } from "bootstrap-vue-3";

const loading = ref(false);

const courses = ref(Array<ICourse>());

const router = useRouter();

const toast = useToast();

let nameInput = ref();
let descriptionInput = ref();
let semesterInput = ref();
let showCloneCourse = ref(false);
let cloneNameInput = ref();
let cloneDescriptionInput = ref();
let cloneSemesterInput = ref();
let cloneCourseId = ref();

let showCloneCourse = ref(false);
let cloneNameInput = ref();
let cloneDescriptionInput = ref();
let cloneSemesterInput = ref();
let cloneCourseId = ref();
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

function handleOk() {
  console.log(
    "create Course name: " +
      nameInput.value +
      ", description: " +
      descriptionInput.value +
      ", in the semester" +
      semesterInput.value
  );
  postCourse({
    courseName: nameInput.value,
    description: descriptionInput.value,
    semester: semesterInput.value,
  })
    .then((response) => {
      courses.value.push(response.data);
      courseItems.value.push({
        id: response.data.id,
        semester: response.data.semester,
        courseName: response.data.courseName,
        description: response.data.description,
        active: response.data.active,
        _rowVariant: "",
      });
      toast.success(`Course ${response.data.courseName} is created!`);
    })
    .catch((error) => {
      toast.error(`Course ${nameInput.value} could not be created created!`);
      console.log(error);
    });
}

function handleCloneOk() {
  console.log(
    "create Course name: " +
      cloneNameInput.value +
      ", description: " +
      cloneDescriptionInput.value +
      ", in the semester" +
      cloneSemesterInput.value
  );
  postCloneCourse(
    {
      courseName: cloneNameInput.value,
      description: cloneDescriptionInput.value,
      semester: cloneSemesterInput.value,
    },
    cloneCourseId.value
  )
    .then((response) => {
      courses.value.push(response.data);
      courseItems.value.push({
        id: response.data.id,
        semester: response.data.semester,
        courseName: response.data.courseName,
        description: response.data.description,
        active: response.data.active,
        _rowVariant: "",
      });
      toast.success(`Course ${response.data.courseName} is created!`);
    })
    .catch((error) => {
      toast.error(`Course ${nameInput.value} could not be created created!`);
      console.log(error);
    });
}

function handleCloneOk() {
  console.log(
    "create Course name: " +
      cloneNameInput.value +
      ", description: " +
      cloneDescriptionInput.value +
      ", in the semester" +
      cloneSemesterInput.value
  );
  postCloneCourse(
    {
      courseName: cloneNameInput.value,
      description: cloneDescriptionInput.value,
      semester: cloneSemesterInput.value,
    },
    cloneCourseId.value
  )
    .then((response) => {
      courses.value.push(response.data);
      toast.success(`Course ${response.data.courseName} is created!`);
    })
    .catch((error) => {
      toast.error(`Course ${nameInput.value} could not be created created!`);
      console.log(error);
    });
}

function resetModal() {
  nameInput.value = "";
  descriptionInput.value = "";
  semesterInput.value = "";
}

function startClone(row: ICourse) {
  console.log(row);
  cloneNameInput.value = row.courseName;
  cloneDescriptionInput.value = row.description;
  cloneSemesterInput.value = row.semester;
  cloneCourseId.value = row.id;
  showCloneCourse.value = true;
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
  courseItems.value.forEach((courseItem) => {
    if (courseItem.id == row.id) {
      courseItem._rowVariant = "dark";
    }
  });
  currentFocus.value = row.id;
  console.log(currentFocus.value);
  courses.value.forEach((value) => {
    if (value.id == row.id) {
      value.id = row.id;
    }
  });
}

function resetFocus(row: ICourse) {
  courseItems.value.forEach((courseItem) => {
    if (courseItem.id == row.id) {
      courseItem._rowVariant = "";
    }
  });
  currentFocus.value = -1;
  console.log(currentFocus.value);
}
</script>

<template>
  <div class="container mt-4">
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
          <b-button @click="startClone(data.item)" size="sm"> clone </b-button>
        </div>
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
      <form ref="form" @submit.stop.prevent="">
        <b-form-group label="Name" label-for="name">
          <b-form-input id="name" v-model="nameInput"></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="description">
          <b-form-input
            id="description"
            v-model="descriptionInput"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Semester in the format (WS/SS)-year(22)"
          label-for="semester"
        >
          <b-form-input id="semester" v-model="semesterInput"></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
    <b-modal
      title="Clone course"
      id="clone-course"
      v-model="showCloneCourse"
      @ok="handleCloneOk"
    >
      <form ref="form" @submit.stop.prevent="">
        <b-form-group label="Name" label-for="name">
          <b-form-input id="name" v-model="cloneNameInput"></b-form-input>
        </b-form-group>

        <b-form-group label="Description" label-for="description">
          <b-form-input
            id="description"
            v-model="cloneDescriptionInput"
          ></b-form-input>
        </b-form-group>
        <b-form-group
          label="Semester in the format (WS/SS)-year(22)"
          label-for="semester"
        >
          <b-form-input
            id="semester"
            v-model="cloneSemesterInput"
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
.table-row-inactive {
  color: grey;
}
.invisible-button {
  background-color: transparent;
  border-color: transparent;
  outline-width: 0px;
  margin-left: 5px;
}
</style>
