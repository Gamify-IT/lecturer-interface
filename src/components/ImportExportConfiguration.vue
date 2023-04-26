<script setup lang="ts">
const emit = defineEmits<{
  (e: "export"): void;
  (e: "importFile", event: any): void;
}>();
</script>

<template>
  <label class="uploadLabel"
    >Import configuration
    <em class="bi bi-upload" />

    <input
      type="file"
      class="uploadButton"
      name="Import"
      @change="(event) => emit('importFile', event)"
    />
  </label>
  <b-button @click="emit('export')"
    >Export configuration <em class="bi bi-download"
  /></b-button>
</template>
<style scoped>
.uploadLabel {
  border: 1px solid #ccc;
  display: inline-block;
  padding: 7px 15px;
  cursor: pointer;
  border-radius: 5px;
}
.uploadButton {
  display: none;
}
</style>
