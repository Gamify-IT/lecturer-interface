<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, nextTick } from "vue";

const props = defineProps<{
  value: string | null;
  prefix: string | null;
}>();

const prefix = ref(props.prefix);
const value = ref(props.value);
const editing = ref(false);
const editingValue = ref();
const inputId = "TestInputId";
const randomNumber = (Math.random() * 100000000000000).toString();

watch(
  () => props.value,
  (newValue) => {
    value.value = newValue;
  },
  { deep: true }
);

watch(
  () => props.prefix,
  (newPrefix) => {
    prefix.value = newPrefix;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "submit", value: string): void;
  (e: "cancel"): void;
}>();

async function startEdit() {
  editingValue.value = value.value;
  editing.value = true;
  console.log("start editing");
  await nextTick();
  console.log(document.getElementById(inputId));
  document.getElementById(inputId)?.focus();
}

async function saveEdit() {
  emit("submit", editingValue.value);
  editing.value = false;
  editingValue.value = value.value;
  await nextTick();
  document.getElementById("editingButton" + randomNumber)?.focus();
}

async function cancelEdit() {
  emit("cancel");
  editing.value = false;
  editingValue.value = value.value;
  await nextTick();
  document.getElementById("editingButton" + randomNumber)?.focus();
}
</script>

<template>
  <h5 v-if="!editing">
    <span v-if="prefix != null">{{ prefix }}: </span>{{ value }}
    <b-button
      variant="light"
      size="small"
      :id="`editingButton` + randomNumber"
      @click="startEdit"
    >
      <em class="bi bi-pencil-square"></em>
    </b-button>
  </h5>
  <b-col sm="6" v-else>
    <b-input-group
      :prepend="prefix"
      @keydown.enter="saveEdit"
      @keydown.esc="cancelEdit"
    >
      <b-form-input :id="inputId" v-model="editingValue"></b-form-input>
      <b-button variant="success" type="submit" size="sm" @click="saveEdit">
        <em class="bi bi-journal-check"></em>
      </b-button>
      <b-button variant="danger" size="sm" type="reset" @click="cancelEdit">
        <em class="bi bi-x-lg"></em>
      </b-button>
    </b-input-group>
  </b-col>
</template>
