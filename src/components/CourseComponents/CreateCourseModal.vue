<script setup lang="ts">
import { defineEmits } from "vue/dist/vue";
import { defineProps, ref, watch } from "vue";
import { postCourse } from "@/ts/rest-clients/course-rest-client";
import { useToast } from "vue-toastification";
import { ICourse } from "@/ts/models/overworld-models";
import { validateSemester } from "@/ts/validation/validate";

const props = defineProps<{
  showModal: boolean;
}>();

let nameInput = ref("");
let descriptionInput = ref("");
let semesterInput = ref("");
let showModal = ref(props.showModal);
let error = ref("");
const toast = useToast();

const emit = defineEmits<{
  (e: "created", course: ICourse): void;
  (e: "closedModal"): void;
}>();

watch(
  () => props.showModal,
  (newBoolean) => {
    console.log("Test");
    showModal.value = newBoolean;
  },
  { deep: true }
);

function handleOk() {
  if (validateSemester(semesterInput.value)) {
    console.log(
      `create course with the name "${nameInput.value}",
  description "${descriptionInput.value}",
  in the semester "${semesterInput.value}"`
    );
    emit("closedModal");
    postCourse({
      courseName: nameInput.value,
      description: descriptionInput.value,
      semester: semesterInput.value,
    })
      .then((response) => {
        emit("created", response.data);
        toast.success(`Course ${response.data.courseName} is created!`);
      })
      .catch((e) => {
        toast.error(`Course ${nameInput.value} could not be created created!`);
        console.log(e);
      });
  } else {
    error.value = "The semester must be in the format (SS/WS)-year(22)";
  }
}
function resetModal() {
  nameInput.value = "";
  descriptionInput.value = "";
  semesterInput.value = "";
}
function handleCancel() {
  emit("closedModal");
}
function handleHidden() {
  error.value = "";
  emit("closedModal");
}
</script>

<template>
  <b-modal
    v-model="showModal"
    title="Create course"
    id="create-course"
    @show="resetModal"
    @hidden="handleHidden"
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
        cancel
      </b-button>
      <b-button type="button" class="btn" variant="primary" @click="handleOk">
        ok
      </b-button>
    </template>
  </b-modal>
</template>
<style>
.warning {
  color: red;
}
</style>
