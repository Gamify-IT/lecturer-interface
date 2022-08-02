<script setup lang="ts">
import { INPC } from "@/ts/models";
import { getNPCs } from "@/ts/npc-rest-client";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
let courseId = route.params.courseId;
let worldIndex = route.params.worldIndex;
let dungeonIndex = route.params.dungeonIndex;

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId = newVal[0];
    worldIndex = newVal[1];
    dungeonIndex = newVal[2];
    loadNPCs(courseId, worldIndex, dungeonIndex);
  },
  { deep: true }
);

const npcs = ref([]);

async function loadNPCs(courseId: any, worldIndex: any, dungeonIndex: any) {
  console.log("load npcs");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    (dungeonIndex != null && isNaN(dungeonIndex))
  ) {
    console.log("one of the ids is NaN");
    return;
  }
  getNPCs(courseId, worldIndex, dungeonIndex)
    .then((response) => {
      const result: INPC[] = response.data;
      npcs.value = result.sort((npc1, npc2) => npc1.index - npc2.index);
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

loadNPCs(courseId, worldIndex, dungeonIndex);
</script>

<template>
  <div class="container mt-4">
    <h1>NPC</h1>
    <b-card v-for="npc in npcs" :key="npc.id" class="mt-1">
      <b-row>
        <b-col>{{ npc.index }}</b-col>
        <b-col>
          <b-button variant="info" size="small">
            <em class="bi bi-pencil-square"></em>
            Edit
          </b-button>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
