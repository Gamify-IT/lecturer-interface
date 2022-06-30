<script setup lang="ts">
import { exampleWorlds, IWorld, Minigame } from "@/ts/worlds";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import AreaBox from "../components/AreaBox.vue";

const worlds: IWorld[] = exampleWorlds();
const availableMinigames = Object.values(Minigame);

console.log("Worldview:");
console.log(worlds);

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
    <h1>Configure {{ world.name }}</h1>

    <div>
      <AreaBox :area="world" :availableMinigames="availableMinigames" />
      <div class="mt-5" v-for="dungeon in world.dungeons" :key="dungeon.id">
        <AreaBox :area="dungeon" :availableMinigames="availableMinigames" />
      </div>
    </div>
  </div>
</template>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style scoped></style>
