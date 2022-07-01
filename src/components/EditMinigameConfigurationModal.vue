<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { ITask } from "@/ts/worlds";

const props = defineProps<{
  minigame: ITask;
}>();

const modal = ref();
const minigame = ref(props.minigame);

defineEmits<{
  (e: "updateMinigame", minigame: ITask): void;
}>();
</script>

<template>
  <b-modal
    id="edit-minigameconfiguration"
    ref="modal"
    title="Edit game configuration"
  >
    <form ref="form">
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

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
