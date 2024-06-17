<script setup lang="ts">
import { defineEmits } from "vue/dist/vue";
import { defineProps, ref, watch } from "vue";
import { useToast } from "vue-toastification";
import { ICloneCourse, ICourse } from "@/ts/models/overworld-models";
import { postCloneCourse } from "@/ts/rest-clients/course-rest-client";
import { validateSemester } from "@/ts/validation/validate";

const props = defineProps<{
  showModal: boolean;
  course: ICourse;
}>();
let showModal = ref(props.showModal);
let course = ref(props.course);
let nameInput = ref("");
let descriptionInput = ref("");
let semesterInput = ref("");
let error = ref("");
const toast = useToast();

const emit = defineEmits<{
  (e: "cloned", emitCourse: ICourse): void;
  (e: "closedModal"): void;
}>();

watch(
  () => props.showModal,
  (newBoolean) => {
    showModal.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => props.course,
  (newCourse) => {
    course.value = newCourse;
    startClone(course.value);
  }
);

function handleOk() {
  if (validateSemester(semesterInput.value)) {
    console.log(`clone course with new name "${nameInput.value}",
  description "${descriptionInput.value}",
  in the semester "${semesterInput.value}"`);
    postCloneCourse(
      {
        courseName: nameInput.value,
        description: descriptionInput.value,
        semester: semesterInput.value,
      },
      course.value.id
    )
      .then((response) => {
        let cloneCourse: ICloneCourse = response.data;
        emit("cloned", cloneCourse);
        if (cloneCourse.errorMessages?.length != 0) {
          toast.error(
            `The following errors occurred:` + cloneCourse.errorMessages
          );
        } else {
          toast.success(`Course ${response.data.courseName} was created!`);
        }
      })
      .catch((e) => {
        toast.error(`Course ${course.value.id} could not be cloned!`);
        console.log(e);
      });
  } else {
    console.log("error");
    error.value = "The semester must be in the format (SS/WS)-year(22)";
  }
}
function startClone(currentCourse: ICourse) {
  nameInput.value = currentCourse.courseName;
  descriptionInput.value = currentCourse.description;
  semesterInput.value = currentCourse.semester;
}
function hiddenModal() {
  error.value = "";
  emit("closedModal");
}
function handleCancel() {
  emit("closedModal");
}
</script>

<template>
  <b-modal
    v-model="showModal"
    title="Create course"
    id="create-course"
    @hidden="hiddenModal"
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
      <div class="warning" v-if="error">{{ error }}</div>
    </form>
    <template v-slot:footer>
      <b-button
        type="button"
        class="btn"
        variant="secondary"
        @click="handleCancel"
      >
        Cancel
      </b-button>
      <b-button type="button" class="btn" variant="primary" @click="handleOk">
        Ok
      </b-button>
    </template>
  </b-modal>
</template>
<style>
.warning {
  color: red;
}
</style>
