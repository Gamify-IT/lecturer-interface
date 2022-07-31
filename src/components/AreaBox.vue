<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { IArea, ITask, Minigame } from "@/ts/models";
import { useToast } from "vue-toastification";

const props = defineProps<{
  area: IArea;
  availableMinigames: Minigame[];
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
  toast.success(
    `Name of lecture ${editedArea.staticName} was updated to ${editedArea.topicName}!`
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
  if (toggledArea.active) {
    toast.success(`Area ${toggledArea.staticName} was activated!`);
  } else {
    toast.error(`Area ${toggledArea.staticName} was deactivated!`);
  }
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
  <b-row>
    <b-col id="collapse-tasks-column">
      <b-button
        variant="secondary"
        size="small"
        @click="collapse[area.id] = !collapse[area.id]"
      >
        <em v-if="!collapse[area.id]" class="bi bi-box-arrow-in-down"></em>
        <em v-else class="bi bi-box-arrow-in-up"></em>
        Collapse
      </b-button>
    </b-col>
    <b-col id="area-name-column">
      <div v-if="editingAreaLecturerName == null">
        <h4>
          {{ area.lectureName }}
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
        <b-row>
          <b-col>
            <b-form-input v-model="editingAreaLecturerName"></b-form-input>
          </b-col>
          <b-col>
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
          </b-col>
        </b-row>
      </div>
      {{ area.name }}
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
    <b-collapse id="collapse-tasks" v-model="collapse[area.id]">
      <b-card v-for="task in area.tasks" :key="task.id" class="mt-1">
        <b-row>
          <b-col>{{ task.lectureName }}</b-col>
          <b-col>
            <b-form-select
              v-model="task.game"
              :options="availableMinigames"
              @input="changedMinigame(task)"
            ></b-form-select>
          </b-col>
          <b-col>
            <b-button
              variant="info"
              size="small"
              @click="startEditMinigame(task)"
            >
              <em class="bi bi-pencil-square"></em>
              Edit
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </b-collapse>
  </b-row>
</template>
