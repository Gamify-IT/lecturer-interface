<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { ITask } from "@/ts/worlds";

const props = defineProps<{
  minigame: ITask;
}>();

const minigame = ref();
const modal = ref();
const form = ref();

watch(
  () => props.minigame,
  (newMinigame) => {
    minigame.value = newMinigame;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "updateMinigame", minigame: ITask): void;
}>();

function checkFormValidity(): boolean {
  const valid = form.value.checkValidity();
  return valid;
}

function resetModal() {
  console.log("Reset Modal");
}

function handleOk() {
  console.log("Submit Modal");
  handleSubmit();
}

function handleSubmit() {
  // Exit when the form isn't valid
  if (!checkFormValidity()) {
    return;
  }
  emit("updateMinigame", minigame.value);
}
</script>

<template>
  <b-modal
    id="edit-minigameconfiguration"
    ref="modal"
    title="Edit game configuration"
    @show="resetModal"
    @hidden="resetModal"
    @ok="handleOk"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame != undefined"
    >
      <b-form-group label="Name" label-for="name-input">
        <b-form-input
          id="name-input"
          v-model="minigame.lectureName"
          required
        ></b-form-input>
      </b-form-group>
    </form>
  </b-modal>
</template>
