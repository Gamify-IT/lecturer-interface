<script setup lang="ts">
import { getCourse, putCourse, deleteCourse } from "@/ts/course-rest-client";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const course = ref();

async function loadCourse(stringId: string) {
  console.log("load course");
  console.log(stringId);
  let id = parseInt(stringId);
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

function saveCourseName(courseName: string) {
  course.value.courseName = courseName;
  putCourse(course.value)
    .then((response) => {
      course.value = response.data;
      toast.success(
        `Name of course ${course.value.courseName} was updated successfully!`
      );
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        `Name of course ${course.value.courseName} could not be updated!`
      );
    });
}

function cancelEditCourseName() {
  toast.warning(`Name of course ${course.value.description} was not updated!`);
}

function saveDescription(description: string) {
  course.value.description = description;
  putCourse(course.value)
    .then((response) => {
      course.value = response.data;
      toast.success(
        `Description of course ${course.value.courseName} was updated successfully!`
      );
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        `Description of course ${course.value.courseName} could not be updated!`
      );
    });
}

function cancelEditDescription() {
  toast.warning(
    `Description of course ${course.value.description} was not updated!`
  );
}

function saveSemester(semester: string) {
  course.value.semester = semester;
  putCourse(course.value)
    .then((response) => {
      course.value = response.data;
      toast.success(
        `Semester of course ${course.value.courseName} was updated successfully!`
      );
    })
    .catch((error) => {
      console.log(error);
      toast.error(
        `Semester of course ${course.value.courseName} could not be updated!`
      );
      loadCourse(id);
    });
}

function cancelEditSemester() {
  toast.warning(
    `Semester of course ${course.value.courseName} was not updated!`
  );
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

const showDeleteConfirmation = ref(false);

function confirmDeleteCourse() {
  deleteCourse(course.value.id)
    .then((response) => {
      toast.success(
        `Course ${course.value.courseName} was deleted sucessfully!`
      );
      router.push("/");
    })
    .catch((error) => {
      console.log(error);
      toast.error(`Course ${course.value.courseName} could not be deleted!`);
    });
}
</script>

<template>
  <div class="container mt-4">
    <div v-if="course != null" class="">
      <b-button
        variant="danger"
        size="small"
        @click="showDeleteConfirmation = true"
      >
        Delete Course
      </b-button>
      <EditableStringAttribute
        prefix="Name"
        :value="course.courseName"
        @submit="saveCourseName"
        @cancel="cancelEditCourseName"
        id="course-name"
      />
      <EditableStringAttribute
        prefix="Description"
        :value="course.description"
        @submit="saveDescription"
        @cancel="cancelEditDescription"
        id="course-description"
      />
      <EditableStringAttribute
        prefix="Semester"
        :value="course.semester"
        @submit="saveSemester"
        @cancel="cancelEditSemester"
        id="course-semester"
      />
      <h4>active:</h4>
      <b-form-checkbox
        v-model="course.active"
        @change="toggleCourseSwitch"
        name="check-button"
        switch
      ></b-form-checkbox>
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
  <b-modal
    title="Delete Course confirmation"
    v-model="showDeleteConfirmation"
    header-bg-variant="danger"
    v-if="course != null"
  >
    Are you sure you want to delete course <b>{{ course.courseName }}</b> of
    semester {{ course.semester }}?
    <template v-slot:footer>
      <b-button
        variant="outline-secondary"
        @click="showDeleteConfirmation = false"
      >
        Cancel
      </b-button>
      <b-button variant="danger" @click="confirmDeleteCourse">
        Delete
      </b-button>
    </template>
  </b-modal>
</template>
