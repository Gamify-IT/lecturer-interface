<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { INPC } from "@/ts/models";

const props = defineProps<{
  npc: INPC;
  showModal: boolean;
}>();

const npc = ref();
const form = ref();
const showModal = ref(props.showModal);

watch(
  () => props.npc,
  (newNPC) => {
    npc.value = newNPC;
  },
  { deep: true }
);

watch(
  () => props.showModal,
  (newBoolean) => {
    showModal.value = newBoolean;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "updateNPC", npc: INPC): void;
  (e: "closedModal"): void;
}>();

function checkFormValidity(): boolean {
  return form.value.checkValidity();
}

function resetModal() {
  console.log("Reset Modal");
}

function handleOk() {
  console.log("Submit Modal");
  handleSubmit();
}

function hiddenModal() {
  console.log("Modal hidden");
  emit("closedModal");
}

function handleSubmit() {
  // Exit when the form isn't valid
  if (!checkFormValidity()) {
    return;
  }
  emit("updateNPC", npc.value);
}
</script>

<template>
  <b-modal
    title="Edit NPC configuration"
    v-model="showModal"
    @show="resetModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    v-if="npc != undefined"
  >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-group label="Text" label-for="text-input">
        <b-form-input id="text-input" v-model="npc.text" required />
      </b-form-group>
    </form>
  </b-modal>
</template>
