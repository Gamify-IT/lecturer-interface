<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { IArea, ITask } from "@/ts/worlds";
import VueMultiselect from "vue-multiselect";

defineProps<{
  area: IArea;
  availableMinigames: [];
}>();

const emit = defineEmits<{
  (e: "editMinigameConfiguration", minigame: ITask): void;
}>();

function startEditMinigame(task: ITask) {
  emit("editMinigameConfiguration", task);
}
</script>

<template>
  <b-td><input type="checkbox" checked data-toggle="toggle" /></b-td>
  <b-td>
    <span>{{ area.name }}</span>
  </b-td>
  <b-td>
    <div v-for="task in area.tasks" :key="task.id">
      <div class="row">
        <div class="col-sm-4">{{ task.lectureName }}</div>
        <div class="col-sm-4">
          <VueMultiselect
            v-model="task.game"
            :options="availableMinigames"
          ></VueMultiselect>
        </div>
        <div class="col-sm-4">
          <button
            type="button"
            class="btn btn-info btn-sm"
            @click="startEditMinigame(task)"
            v-b-modal.edit-minigameconfiguration
          >
            <i class="bi bi-pencil-square"></i>
            Edit
          </button>
        </div>
      </div>
    </div>
  </b-td>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
