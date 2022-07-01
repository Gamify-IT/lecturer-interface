<script setup lang="ts">
import { exampleWorlds, ITask, IWorld, Minigame } from "@/ts/worlds";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AreaBox from "../components/AreaBox.vue";
import EditMinigameConfigurationModal from "@/components/EditMinigameConfigurationModal.vue";

const worlds: IWorld[] = exampleWorlds();
const availableMinigames = Object.values(Minigame);

const route = useRoute();
const id = route.params.id;
const world = ref();

const editedMinigame = ref();

updateSelectedWorld(id);

function updateSelectedWorld(id: number) {
  world.value = worlds.find((world) => world.id == id);
}

function editMinigameConfiguration(task: ITask) {
  editedMinigame.value = task;
  console.log("Want to edit minigame " + task.lectureName);
}

function updateMinigame(task: ITask) {
  console.log("Pressed submit button in configuration modal");
}

watch(
  () => route.params.id,
  (newId) => {
    updateSelectedWorld(newId);
  },
  { deep: true }
);
</script>

<template>
  <div class="container mt-5">
    <h2>Configure {{ world.name }}</h2>

    <div>
      <b-table-simple>
        <b-tbody>
          <b-tr>
            <AreaBox
              :area="world"
              :availableMinigames="availableMinigames"
              @editMinigameConfiguration="editMinigameConfiguration"
            />
          </b-tr>
          <b-tr v-for="dungeon in world.dungeons" :key="dungeon.id">
            <AreaBox
              :area="dungeon"
              :availableMinigames="availableMinigames"
              @editMinigameConfiguration="editMinigameConfiguration"
            />
          </b-tr>
        </b-tbody>
      </b-table-simple>
      <EditMinigameConfigurationModal
        :minigame="editedMinigame"
        @updateMinigame="updateMinigame"
      />
    </div>
  </div>
</template>

<style scoped></style>
