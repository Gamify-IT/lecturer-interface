<script setup lang="ts">
import { defineEmits, nextTick, ref, watch } from "vue";
import { getCourse, putCourse, deleteCourse } from "@/ts/course-rest-client";
import { useRoute, useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";

const route = useRoute();
const router = useRouter();
const id = route.params.id as string;
const course = ref();
const errorText = ref("");
const loading = ref(false);
const inFocus = ref(false);
let currentElement = ref();

const emit = defineEmits<{
  (e: "return"): void;
}>();

const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
  leftClicked: Boolean,
  rightClicked: Boolean,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => props.upClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickUp();
    }
  },
  { deep: true }
);

watch(
  () => props.downClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickDown();
    }
  },
  { deep: true }
);

watch(
  () => props.leftClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickLeft();
    }
  },
  { deep: true }
);

watch(
  () => props.rightClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickRight();
    }
  },
  { deep: true }
);

function clickLeft() {
  if (inFocus.value) {
    emit("return");
    console.log("left");
  }
}

function clickRight() {
  if (inFocus.value) {
    console.log("right");
    if (currentElement.value == null) {
      currentElement.value = document.getElementById("deleteButton");
    }
    currentElement.value.focus();
  }
}

function clickUp() {
  if (inFocus.value) {
    let elements = document.getElementsByClassName("btn-light");
    let firstElement = document.getElementById("deleteButton");
    let previousElement = document.getElementById("active-toggle");
    let focused = false;
    if (currentElement.value == null) {
      currentElement.value = previousElement;
      focused = true;
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (currentElement.value == elements.item(i)) {
          if (i == 0) {
            currentElement.value = firstElement;
            currentElement.value.focus();
            focused = true;
          } else {
            currentElement.value = previousElement;
            currentElement.value.focus();
            focused = true;
          }
          break;
        } else if (currentElement.value == previousElement) {
          currentElement.value = elements.item(elements.length - 1);
          currentElement.value.focus();
          focused = true;
          break;
        } else {
          previousElement = elements.item(i);
        }
      }
    }
    if (!focused) {
      currentElement.value = document.getElementById("active-toggle");
      currentElement.value.focus();
    }
  }
}

function clickDown() {
  if (inFocus.value) {
    let elements = document.getElementsByClassName("btn-light");
    let firstElement = document.getElementById("deleteButton");
    const toggleElement = document.getElementById("active-toggle");
    let focused = false;
    if (currentElement.value == null) {
      currentElement.value = firstElement;
      focused = true;
    } else {
      for (let i = 0; i < elements.length; i++) {
        if (currentElement.value == elements.item(i)) {
          if (i + 1 < elements.length) {
            currentElement.value = elements.item(i + 1);
          } else {
            currentElement.value = toggleElement;
          }
          currentElement.value.focus();
          focused = true;
          break;
        } else if (currentElement.value == toggleElement) {
          currentElement.value = firstElement;
          currentElement.value.focus();
          focused = true;
          break;
        } else if (currentElement.value == firstElement) {
          currentElement.value = elements.item(0);
          currentElement.value.focus();
          focused = true;
        }
      }
    }
    if (!focused) {
      currentElement.value = firstElement;
      currentElement.value.focus();
    }
  }
}

async function loadCourse(stringId: string) {
  loading.value = true;
  console.log("load course");
  console.log(stringId);
  let id = parseInt(stringId);
  if (isNaN(id)) {
    console.log("NAN");
    return;
  }
  getCourse(id)
    .then(async (response) => {
      const result = response.data;
      course.value = result;
      console.log(result);
      await nextTick();
      document.getElementsByClassName("vsm--link").item(0)?.focus();
    })
    .catch((error) => {
      console.log(error);
      errorText.value = "Course with id " + id + " not found!";
    })
    .finally(() => {
      loading.value = false;
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
  toast.warning(`Name of course ${course.value.courseName} was not updated!`);
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
  console.log(currentElement.value);
}

function cancelEditDescription() {
  toast.warning(
    `Description of course ${course.value.courseName} was not updated!`
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

function toggledCourseSwitch() {
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

function toggleCourseSwitch() {
  document.getElementById("active-toggle")?.click();
}

function deleteCurrentCourse() {
  deleteCourse(course.value.id)
    .then(() => {
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
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <div v-if="course != null" class="">
        <b-col>
          <b-button
            variant="danger"
            size="small"
            v-b-modal.delete-confirmation-modal
            id="deleteButton"
          >
            Delete Course
          </b-button>
        </b-col>
        <b-col>
          <EditableStringAttribute
            prefix="Name"
            :value="course.courseName"
            @submit="saveCourseName"
            @cancel="cancelEditCourseName"
            id="course-name"
            sm="6"
          />
        </b-col>
        <b-col>
          <EditableStringAttribute
            prefix="Description"
            :value="course.description"
            @submit="saveDescription"
            @cancel="cancelEditDescription"
            id="course-description"
            sm="6"
          />
        </b-col>
        <b-col>
          <EditableStringAttribute
            prefix="Semester"
            :value="course.semester"
            @submit="saveSemester"
            @cancel="cancelEditSemester"
            id="course-semester"
          />
        </b-col>
        <b-col>
          <h4>active:</h4>
          <b-form-checkbox
            v-model="course.active"
            @change="toggledCourseSwitch"
            name="check-button"
            id="active-toggle"
            @keydown.enter="toggleCourseSwitch"
            switch
          ></b-form-checkbox>
        </b-col>
      </div>
      <div v-if="errorText">
        <div
          class="alert alert-danger alert-dismissible d-flex align-items-center fade show"
        >
          <em class="bi-exclamation-octagon-fill"></em>
          <strong class="mx-2">Error!</strong>
          {{ errorText }}
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="alert"
          ></button>
        </div>
      </div>
    </div>
  </b-overlay>
  <b-modal
    id="delete-confirmation-modal"
    title="Delete Course confirmation"
    header-bg-variant="danger"
    ok-title="Delete"
    ok-variant="danger"
    @ok="deleteCurrentCourse"
    v-if="course != null"
  >
    Are you sure you want to delete course <b>{{ course.courseName }}</b> of
    semester {{ course.semester }}?
  </b-modal>
</template>
