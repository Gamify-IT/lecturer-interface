<script setup lang="ts">
import { exampleWorlds, IWorld, Minigame } from "@/ts/worlds";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AreaBox from "../components/AreaBox.vue";

const worlds: IWorld[] = exampleWorlds();
const availableMinigames = Object.values(Minigame);

const route = useRoute();
const id = route.params.id;
const world = ref();

updateSelectedWorld(id);

function updateSelectedWorld(id: number) {
  world.value = worlds.find((world) => world.id == id);
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
            <AreaBox :area="world" :availableMinigames="availableMinigames" />
          </b-tr>
          <b-tr v-for="dungeon in world.dungeons" :key="dungeon.id">
            <AreaBox :area="dungeon" :availableMinigames="availableMinigames" />
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
