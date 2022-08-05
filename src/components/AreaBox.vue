<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { updateArea } from "@/ts/area-rest-client";

import { IArea, ITask, Minigame } from "@/ts/models";
import { useToast } from "vue-toastification";

const props = defineProps<{
  area: IArea;
  courseId: number;
  worldIndex: number;
  dungeonIndex: number;
}>();

const toast = useToast();

const area = ref(props.area);
const collapse = ref(Array<boolean>());

const editingAreaLecturerName = ref();

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

function startEditAreaLecturerName(editingArea: IArea) {
  editingAreaLecturerName.value = editingArea.topicName;
}

function saveEditAreaLecturerName(editedArea: IArea) {
  editedArea.topicName = editingAreaLecturerName.value;
  updateArea(props.courseId, props.worldIndex, props.dungeonIndex, editedArea)
    .then((response) => {
      const result: IArea = response.data;
      editedArea = result;
    })
    .catch((error) => {
      console.log(error);
    });
  editedArea.topicName = editingAreaLecturerName.value;
  toast.success(
    `Topic name of lecture ${editedArea.staticName} was updated to ${editedArea.topicName}!`
  );

  editingAreaLecturerName.value = null;
}

function cancelEditAreaLecturerName(editedArea: IArea) {
  toast.warning(`Name of lecture ${editedArea.staticName} was not updated!`);
  editingAreaLecturerName.value = null;
}

function toggledAreaSwitch(toggledArea: IArea) {
  console.log("Toggled switch of " + toggledArea.staticName);
  console.log(toggledArea.active);
  updateArea(props.courseId, props.worldIndex, props.dungeonIndex, toggledArea)
    .then((response) => {
      const result: IArea = response.data;
      if (result.active) {
        toast.success(`Area ${toggledArea.staticName} was activated!`);
      } else {
        toast.error(`Area ${toggledArea.staticName} was deactivated!`);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function changedMinigame(task: ITask) {
  if (task.game == null) {
    task.game = Minigame.NONE;
  }
  toast.success(`Minigame in Task was updated to ${task.game}!`);
  console.log("Changed minigame to " + task.game);
}
</script>

<template>
  <b-td>
    <h5>{{ area.staticName }}</h5>
  </b-td>
  <b-td id="area-name-column">
    <div v-if="editingAreaLecturerName == null">
      <h4>
        {{ area.topicName }}
        <b-button
          variant="light"
          size="small"
          @click="startEditAreaLecturerName(area)"
        >
          <em class="bi bi-pencil-square"></em>
        </b-button>
      </h4>
    </div>
    <div v-else>
      <b-input-group>
        <b-col sm="8">
          <b-form-input v-model="editingAreaLecturerName"></b-form-input>
        </b-col>
        <b-button-group>
          <b-button
            variant="success"
            size="sm"
            @click="saveEditAreaLecturerName(area)"
          >
            <em class="bi bi-journal-check"></em>
          </b-button>
          <b-button
            variant="danger"
            size="sm"
            @click="cancelEditAreaLecturerName(area)"
          >
            <em class="bi bi-x-lg"></em>
          </b-button>
        </b-button-group>
      </b-input-group>
    </div>
  </b-td>
  <b-td>
    <b-form-checkbox
      v-model="area.active"
      @change="toggledAreaSwitch(area)"
      name="check-button"
      switch
    >
    </b-form-checkbox>
  </b-td>
</template>
