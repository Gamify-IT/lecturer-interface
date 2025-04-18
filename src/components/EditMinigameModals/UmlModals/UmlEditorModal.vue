<template>
  <b-modal
  :title="props.modalTitle"
  size="xl"
  v-model="showModal"
  @hidden="hiddenModal"
  >
    <b-form-group>
      Hier könnte ihre Werbung stehen lol! <br><br>
      <b-form-textarea v-model="taskText" placeholder="Enter UML-diagram description" rows="4"/>
    </b-form-group>
  </b-modal>
</template>
<script setup lang="ts">
import { defineEmits, defineProps, ref, watch } from "vue";
  import { useToast } from "vue-toastification";

  const props = defineProps<{
    modalTitle: string;
    showModal: boolean;
  }>();

  const emit = defineEmits<{
    (e: "closedModal"): void;
  }>();

  const toast = useToast();
  const taskText = ref();
  const showModal = ref(props.showModal);
  const modalTitle = ref(props.modalTitle);

  watch(
    () => props.showModal,
    (newBoolean) => {
      showModal.value = newBoolean;
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

  function hiddenModal() {
    console.log("Editor hidden");
    emit("closedModal");
  }
</script>
<style scoped>

</style>