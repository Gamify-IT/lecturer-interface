<script setup lang="ts">
import { IArea, ICourse, ITask, Minigame } from "@/ts/models";
import { getMinigames } from "@/ts/minigame-rest-client";
import { defineProps, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EditMinigameConfigurationModal from "@/components/EditMinigameConfigurationModal.vue";
import { BButtonGroup, BFormCheckbox } from "bootstrap-vue-3";

const availableMinigames = Object.values(Minigame);

const toast = useToast();
const route = useRoute();
const courseId = ref(route.params.courseId);
const worldIndex = ref(route.params.worldIndex);
const dungeonIndex = ref(route.params.dungeonIndex);

const editedMinigame = ref();
const showEditModal = ref(false);

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0];
    worldIndex.value = newVal[1];
    dungeonIndex.value = newVal[2];
    loadMinigames(courseId.value, worldIndex.value, dungeonIndex.value);
  },
  { deep: true }
);

const minigames = ref([]);

async function loadMinigames(
  courseId: any,
  worldIndex: any,
  dungeonIndex: any
) {
  console.log("load minigames");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    (dungeonIndex != undefined && isNaN(dungeonIndex))
  ) {
    console.log("one of the ids is NaN");
    return;
  }
  getMinigames(courseId, worldIndex, dungeonIndex)
    .then((response) => {
      const result: ITask[] = response.data;
      minigames.value = result.sort(
        (task1, task2) => task1.index - task2.index
      );
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

loadMinigames(courseId.value, worldIndex.value, dungeonIndex.value);

function changedMinigame(task: ITask) {
  if (task.game == null) {
    task.game = Minigame.NONE;
  }
  toast.success(`Minigame in Task was updated to ${task.game}!`);
  console.log("Changed minigame to " + task.game);
}

function editMinigameConfiguration(task: ITask) {
  editedMinigame.value = task;
  console.log("Want to edit minigame " + task.id);
  showEditModal.value = true;
}

function updateMinigameConfiguration(task: ITask) {
  console.log("Pressed submit button in configuration modal");
  toast.success(`Configurations of ${task.id} was saved!`);
}

function closedEditModal() {
  console.log("Parent got info that modal was closed");
  showEditModal.value = false;
}
</script>

<template>
  <div class="container mt-4">
    <h1 v-if="dungeonIndex == undefined">
      Minigames from World {{ worldIndex }}
    </h1>
    <h1 v-else>
      Minigames from World World {{ worldIndex }}, Dungeon {{ dungeonIndex }}
    </h1>
    <b-card v-for="task in minigames" :key="task.id" class="mt-1">
      <b-row>
        <b-col>{{ task.index }}</b-col>
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
            @click="editMinigameConfiguration(task)"
          >
            <em class="bi bi-pencil-square"></em>
            Edit
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
  <EditMinigameConfigurationModal
    :showModal="showEditModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
</template>
