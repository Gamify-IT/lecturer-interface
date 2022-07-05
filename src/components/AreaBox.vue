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

const editingAreaLecturerName = ref();
const editingAreaLectureNameValue = ref();

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

function startEditAreaLecturerName(area: IArea) {
  editingAreaLecturerName.value = area;
  editingAreaLectureNameValue.value = area.lectureName;
}

function saveEditAreaLecturerName(area: IArea) {
  editingAreaLecturerName.value = null;
  area.lectureName = editingAreaLectureNameValue.value;
  toast.success(
    "Lecturename of " + area.name + " was updated to " + area.lectureName + "!"
  );
  editingAreaLectureNameValue.value = null;
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
      <h6>{{ area.name }}</h6>
      <div v-if="editingAreaLecturerName != area">
        {{ area.lectureName }}
        <button
          type="button"
          class="btn btn-light btn-sm"
          @click="startEditAreaLecturerName(area)"
        >
          <i class="bi bi-pencil-square"></i>
        </button>
      </div>
      <div v-else>
        <b-row>
          <b-col>
            <b-form-input v-model="editingAreaLectureNameValue"></b-form-input>
          </b-col>
          <b-col>
            <button
              type="button"
              class="btn btn-success btn-sm"
              @click="saveEditAreaLecturerName(area)"
            >
              <i class="bi bi-journal-check"></i>
            </button>
          </b-col>
        </b-row>
      </div>
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
