<script setup lang="ts">
import { IDungeon, ITask, IWorld, Minigame } from "@/ts/models";
import { getWorld } from "@/ts/world-rest-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AreaBox from "../components/AreaBox.vue";
import EditMinigameConfigurationModal from "@/components/EditMinigameConfigurationModal.vue";
import { useToast } from "vue-toastification";

const availableMinigames = Object.values(Minigame);

const toast = useToast();

const route = useRoute();
const courseId = ref(parseInt(route.params.courseId as string));
const worldIndex = ref(parseInt(route.params.worldIndex as string));
const world = ref();

const editedMinigame = ref();
const showEditModal = ref(false);

loadSelectedWorld(courseId.value, worldIndex.value);

function loadSelectedWorld(
  selectedCourseId: number,
  selectedWorldIndex: number
) {
  getWorld(selectedCourseId, selectedWorldIndex)
    .then((response) => {
      const result = response.data;
      world.value = result;
      world.value.dungeons = world.value.dungeons.sort(
        (dungeon1: IDungeon, dungeon2: IDungeon) =>
          dungeon1.index > dungeon2.index
      );
      console.log("Loaded selected world " + selectedWorldIndex);
    })
    .catch((error) => {
      console.log(error);
    });
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
watch(
  () => [route.params.courseId, route.params.worldIndex],
  (newVal) => {
    courseId.value = parseInt(newVal[0] as string);
    worldIndex.value = parseInt(newVal[1] as string);
    loadSelectedWorld(courseId.value, worldIndex.value);
  },
  { deep: true }
);
</script>

<template>
  <div v-if="world != undefined" class="container mt-5">
    <h2>Configure World {{ world.index }}</h2>
    <h4>{{ world.staticName }}</h4>

    <div style="margin-top: 30px">
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <AreaBox
              :area="world"
              :courseId="courseId"
              :worldIndex="world.index"
              :dungeonIndex="0"
              :availableMinigames="availableMinigames"
              @editMinigameConfiguration="editMinigameConfiguration"
            />
          </b-tr>
          <b-tr v-for="dungeon in world.dungeons" :key="dungeon.id">
            <AreaBox
              :area="dungeon"
              :courseId="courseId"
              :availableMinigames="availableMinigames"
              :worldIndex="world.index"
              :dungeonIndex="dungeon.index"
              @editMinigameConfiguration="editMinigameConfiguration"
            />
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <EditMinigameConfigurationModal
        :showModal="showEditModal"
        :minigame="editedMinigame"
        @updateMinigameConfiguration="updateMinigameConfiguration"
        @closedModal="closedEditModal"
      />
    </div>
  </div>
  <div v-else class="container mt-5 error">
    <div
      class="alert alert-danger alert-dismissible d-flex align-items-center fade show"
    >
      <em class="bi-exclamation-octagon-fill"></em>
      <strong class="mx-2">Error!</strong>
      World in course {{ courseId }} with index {{ worldIndex }} not found;
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  </div>
</template>
