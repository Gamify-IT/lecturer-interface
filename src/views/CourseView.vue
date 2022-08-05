<script setup lang="ts">
import { getCourse, putCourse } from "@/ts/course-rest-client";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const route = useRoute();
const id = route.params.id;
const course = ref();
const editingCourseName = ref();
const editingDescription = ref();
const editingSemester = ref();

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

function startEditCourseName() {
  editingCourseName.value = course.value.courseName;
}

function saveEditCourseName() {
  course.value.courseName = editingCourseName.value;
  putCourse(course.value);
  toast.success(
    `Name of course ${course.value.courseName} was updated successfully}!`
  );
  editingCourseName.value = null;
}

function cancelEditCourseName() {
  toast.warning(`Name of course ${course.value.courseName} was not updated!`);
  editingCourseName.value = null;
}

function startEditDescription() {
  editingDescription.value = course.value.description;
}

function saveEditDescription() {
  course.value.description = editingDescription.value;
  putCourse(course.value);
  toast.success(
    `Description of course ${course.value.description} was updated successfully}!`
  );
  editingDescription.value = null;
}

function cancelEditDescription() {
  toast.warning(
    `Description of course ${course.value.description} was not updated!`
  );
  editingDescription.value = null;
}

function startEditSemester() {
  editingSemester.value = course.value.semester;
}

function saveEditSemester() {
  course.value.semester = editingSemester.value;
  putCourse(course.value);
  toast.success(
    `Semester of course ${course.value.semester} was updated successfully}!`
  );
  editingSemester.value = null;
}

function cancelEditSemester() {
  toast.warning(`Semester of course ${course.value.semester} was not updated!`);
  editingSemester.value = null;
}
function toggleCourseSwitch() {
  putCourse(course.value).then((response) => {
    course.value = response.data;
    if (course.value.active) {
      toast.success(`Course ${course.value.courseName} was activated!`);
      console.log(course.value.active);
    } else {
      toast.error(`Course ${course.value.courseName} was deactivated!`);
      console.log(course.value.active);
    }
  });
}
</script>

<template>
  <div class="container mt-4">
    <div v-if="course != null" class="">
      <b-col>
        <div v-if="editingCourseName == null">
          <h1>
            Course name: {{ course.courseName }}
            <b-button
              id="course-name-edit"
              variant="light"
              size="small"
              @click="startEditCourseName"
            >
              <em class="bi bi-pencil-square"></em>
            </b-button>
          </h1>
        </div>
        <div v-else>
          <b-row>
            <b-col>
              <b-form-input
                id="course-name-input"
                v-model="editingCourseName"
              ></b-form-input>
            </b-col>
            <b-col>
              <b-button-group>
                <b-button
                  variant="success"
                  size="sm"
                  @click="saveEditCourseName"
                >
                  <em class="bi bi-journal-check"></em>
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="cancelEditCourseName"
                >
                  <em class="bi bi-x-lg"></em>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col>
        <div v-if="editingDescription == null">
          <h5>
            description: {{ course.description }}
            <b-button
              id="course-description-edit"
              variant="light"
              size="small"
              @click="startEditDescription"
            >
              <em class="bi bi-pencil-square"></em>
            </b-button>
          </h5>
        </div>
        <div v-else>
          <b-row>
            <b-col>
              <b-form-input
                id="course-description-input"
                v-model="editingDescription"
              ></b-form-input>
            </b-col>
            <b-col>
              <b-button-group>
                <b-button
                  variant="success"
                  size="sm"
                  @click="saveEditDescription"
                >
                  <em class="bi bi-journal-check"></em>
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="cancelEditDescription"
                >
                  <em class="bi bi-x-lg"></em>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col>
        <div v-if="editingSemester == null">
          <h5>
            semester: {{ course.semester }}
            <b-button variant="light" size="small" @click="startEditSemester">
              <em class="bi bi-pencil-square"></em>
            </b-button>
          </h5>
        </div>
        <div v-else>
          <b-row>
            <b-col>
              <b-form-input v-model="editingSemester"></b-form-input>
            </b-col>
            <b-col>
              <b-button-group>
                <b-button variant="success" size="sm" @click="saveEditSemester">
                  <em class="bi bi-journal-check"></em>
                </b-button>
                <b-button
                  variant="danger"
                  size="sm"
                  @click="cancelEditSemester"
                >
                  <em class="bi bi-x-lg"></em>
                </b-button>
              </b-button-group>
            </b-col>
          </b-row>
        </div>
      </b-col>
      <b-col>
        <b-form-checkbox
          v-model="course.active"
          @change="toggleCourseSwitch"
          name="check-button"
          switch
        ></b-form-checkbox>
      </b-col>
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
