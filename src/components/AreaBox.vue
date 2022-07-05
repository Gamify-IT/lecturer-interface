<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { IArea, ITask } from "@/ts/worlds";
import VueMultiselect from "vue-multiselect";
import { useToast } from "vue-toastification";

const props = defineProps<{
  area: IArea;
  availableMinigames: [];
}>();

const toast = useToast();

const area = ref(props.area);
const collapse = ref(Array<boolean>());

watch(
  () => props.area,
  (newArea) => {
    area.value = newArea;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "editMinigameConfiguration", minigame: ITask): void;
}>();

function startEditMinigame(task: ITask) {
  emit("editMinigameConfiguration", task);
}

function toggledAreaSwitch(area: IArea) {
  console.log("Toggled switch of " + area.name);
  console.log(area.active);
  if (area.active) {
    toast.success("Area " + area.name + " was activated!");
  } else {
    toast.error("Area " + area.name + " was deactivated!");
  }
}
</script>

<template>
  <b-row>
    <b-col>
      <button
        type="button"
        class="btn btn-secondary btn-sm"
        @click="collapse[area.id] = !collapse[area.id]"
      >
        <i v-if="!collapse[area.id]" class="bi bi-box-arrow-in-down"></i>
        <i v-else class="bi bi-box-arrow-in-up"></i>
        Collapse
      </button>
    </b-col>
    <b-col>
      <span>{{ area.name }}</span>
    </b-col>
    <b-col>
      <b-form-checkbox
        v-model="area.active"
        @change="toggledAreaSwitch(area)"
        name="check-button"
        switch
      >
      </b-form-checkbox>
    </b-col>
  </b-row>
  <b-row>
    <b-collapse id="collapse-4" v-model="collapse[area.id]">
      <b-card v-for="task in area.tasks" :key="task.id" class="mt-1">
        <b-row>
          <b-col>{{ task.lectureName }}</b-col>
          <b-col>
            <VueMultiselect
              v-model="task.game"
              :options="availableMinigames"
            ></VueMultiselect>
          </b-col>
          <b-col>
            <button
              type="button"
              class="btn btn-info btn-sm"
              @click="startEditMinigame(task)"
            >
              <i class="bi bi-pencil-square"></i>
              Edit
            </button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-row>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
