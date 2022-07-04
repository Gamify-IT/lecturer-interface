<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, onMounted } from "vue";
import { ITask } from "@/ts/worlds";
import { BModal } from "bootstrap-vue-3";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const minigame = ref();
const form = ref();
const showModal = ref(props.showModal);
const editingModal = ref();

onMounted(() => {
  const modal = editingModal.value;
  console.log(modal);
});

watch(
  () => props.minigame,
  (newMinigame) => {
    minigame.value = newMinigame;
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
  (e: "updateMinigameConfiguration", minigame: ITask): void;
  (e: "closedModal"): void;
}>();

function checkFormValidity(): boolean {
  const valid = form.value.checkValidity();
  return valid;
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
  emit("updateMinigameConfiguration", minigame.value);
}
</script>

<template>
  <b-modal
    ref="editingModal"
    id="editingModal"
    title="Edit game configuration"
    v-model="showModal"
    @show="resetModal"
    @hidden="hiddenModal"
    @ok="handleOk"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame != undefined"
    >
      <b-form-group label="Name" label-for="name-input">
        <b-form-input id="name-input" v-model="minigame.lectureName" required />
      </b-form-group>
    </form>
  </b-modal>
</template>
