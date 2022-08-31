<script setup lang="ts">
import config from "@/config";
import { defineProps, defineEmits, ref, watch } from "vue";
import { MapType } from "@/ts/modals/models";

const props = defineProps<{
  worldIndex: string | number;
  dungeonIndex: string | number | undefined;
  modalTitle: string;
  mapType: MapType;
  showModal: boolean;
}>();

const showModal = ref(props.showModal);
const modalTitle = ref(props.modalTitle);
const mapType = ref(props.mapType);

watch(
  () => props.showModal,
  (newBoolean) => {
    showModal.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => props.mapType,
  (newMap) => {
    mapType.value = newMap;
  },
  { deep: true }
);

watch(
  () => props.modalTitle,
  (newModalTitle) => {
    modalTitle.value = newModalTitle;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "closedModal"): void;
}>();

function hiddenModal() {
  console.log("Modal hidden");
  emit("closedModal");
}

function getFileName(): string {
  switch (mapType.value) {
    case MapType.RAW:
      return "raw.webp";
    case MapType.NPC:
      return "npc.webp";
    case MapType.MINIGAME:
      return "minigames.webp";
    case MapType.DUNGEON:
      return "dungeons.webp";
    default:
      throw new Error(`Non-existent maptype in switch: ${mapType.value}`);
  }
}

function getImage(): string {
  return `https://raw.githubusercontent.com/Gamify-IT/docs/${
    config.mapCommitHash
  }/user-manuals/maps/world${props.worldIndex}${
    props.dungeonIndex ? "-dungeon" + props.dungeonIndex : ""
  }/${getFileName()}`;
}
</script>

<template>
  <b-modal
    :title="props.modalTitle"
    size="xl"
    v-model="showModal"
    @hidden="hiddenModal"
  >
    <b-img :src="getImage()" fluid></b-img>
  </b-modal>
</template>
