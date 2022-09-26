<script setup lang="ts">
import { defineProps, defineEmits, ref, watch, Ref } from "vue";
import { IBook } from "@/ts/models/overworld-models";

const props = defineProps<{
  book: IBook;
  showModal: boolean;
}>();

const book = ref() as Ref<IBook>;
const form = ref();
const showModal = ref(props.showModal);

const text = ref("");

watch(
  () => props.book,
  (newBook) => {
    book.value = newBook;
    // We just COPY the content of the list to make sure, the model does not get updated when hitting cancel
    text.value = book.value.text;
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
  (e: "updateBook", book: IBook): void;
  (e: "closedModal"): void;
}>();

function checkFormValidity(): boolean {
  return form.value.checkValidity();
}

function resetModal() {
  text.value = book.value.text;
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
  book.value.text = text.value;
  emit("updateBook", book.value);
}
</script>

<template>
  <b-modal
    title="Edit Book configuration"
    size="xl"
    v-model="showModal"
    @show="resetModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    v-if="book !== undefined"
  >
    <b-alert show dismissible>
      Enter your text to display in the book. If the text is empty a standard
      sentence will be displayed in the book.</b-alert
    >
    <form ref="form" @submit.stop.prevent="handleSubmit">
      <b-form-textarea
        id="textarea"
        v-model="text"
        placeholder="Enter something..."
        rows="3"
        max-rows="10"
      ></b-form-textarea>
    </form>
  </b-modal>
</template>
