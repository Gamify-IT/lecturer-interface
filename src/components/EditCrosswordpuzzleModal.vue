<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import {
  ITask,
  CrosswordpuzzleConfiguration,
  IChickenshockQuestion,
  CrosswordpuzzleQuestion,
} from "@/ts/models";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/minigame-rest-client";
import { useRoute } from "vue-router";
import {
  getCrosswordpuzzleConfig,
  postCrosswordpuzzleConfig,
} from "@/ts/crosswordpuzzle-rest-client";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const fields = [
  {
    key: "questionText",
    label: "Question",
  },
  {
    key: "answer",
    label: "Answer",
  },
  {
    key: "remove",
    label: "remove",
  },
];

const route = useRoute();
const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);
const toast = useToast();
const minigame = ref(props.minigame);
const showModal = ref(props.showModal);
const configuration = ref(new CrosswordpuzzleConfiguration("", []));
const currentEditingQuestion = ref(new CrosswordpuzzleQuestion("", ""));

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
    console.log("new value for showing modal " + newBoolean);
    showModal.value = newBoolean;
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "updateMinigameConfiguration", minigame: ITask): void;
  (e: "closedModal"): void;
}>();

function checkFormValidity(): boolean {
  return true;
}

function resetModal() {
  if (minigame.value.configurationId != undefined) {
    getCrosswordpuzzleConfig(minigame.value.configurationId)
      .then((response) => {
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          minigame.value.configurationId = undefined;
          configuration.value.questions = [];
        }
      });
  } else {
    configuration.value.questions = [];
  }
  console.log("Reset Modal");
}

function handleOk() {
  postCrosswordpuzzleConfig(configuration.value)
    .then((response) => {
      minigame.value.configurationId = response.data.id;
      console.log("Submit Modal");
      console.log("id:" + response.data.id);
      console.log("minigameId" + minigame.value.configurationId);
      handleSubmit();
    })
    .then(() => {
      putMinigame(
        parseInt(courseId.value),
        parseInt(worldIndex.value),
        parseInt(dungeonIndex.value),
        minigame.value
      );
    })
    .catch((error) => {
      toast.error("There was an error updating the minigame configuration.");
      console.log(error);
    });
}

function handleSubmit() {
  // Exit when the form isn't valid
  if (!checkFormValidity()) {
    return;
  }
  resetModal();
  emit("updateMinigameConfiguration", minigame.value);
}

function hiddenModal() {
  console.log("Modal hidden");
  emit("closedModal");
}

function loadModal() {
  resetModal();
}

function containsQuestion(questionText: string): boolean {
  return (
    configuration.value.questions.find(
      (filtered) =>
        filtered.questionText == currentEditingQuestion.value.questionText
    ) != null
  );
}

function addQuestion() {
  if (containsQuestion(currentEditingQuestion.value.questionText)) {
    console.log("Question could not be added");
    return;
  }
  configuration.value.questions.push(currentEditingQuestion.value);
  currentEditingQuestion.value = new CrosswordpuzzleQuestion("", "");
}

function removeQuestion(questionText: string) {
  console.log("remove question " + questionText);
  configuration.value.questions = configuration.value.questions.filter(
    (filtered) => filtered.questionText != questionText
  );
}
</script>
<template>
  <b-modal
    title="Edit Crosswordpuzzle configuration"
    id="edit-modal"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @cancel="resetModal"
    @show="loadModal"
    @abort="resetModal"
  >
    <b-form-group>
      <b-table :fields="fields" :items="configuration.questions">
        <template #cell(remove)="data">
          <b-button
            size="sm"
            variant="danger"
            @click="removeQuestion(data.item.questionText)"
          >
            <em class="bi bi-trash"></em>
          </b-button>
        </template>
        <template #cell(questionText)="data">
          {{ data.value }}
        </template>
      </b-table>
    </b-form-group>
    <h6>Add Question</h6>
    <b-form-group>
      <label for="current-question">Question:</label>
      <b-form-input
        id="current-question"
        label="Question"
        v-model="currentEditingQuestion.questionText"
        :state="!containsQuestion(currentEditingQuestion.questionText)"
        aria-describedby="current-question-feedback"
        placeholder="Enter a question"
      ></b-form-input>
      <b-form-invalid-feedback id="current-question-feedback">
        The Question already exists.
      </b-form-invalid-feedback>
      <label for="current-question-answer">Answer:</label>
      <b-form-input
        id="current-question-answer"
        v-model="currentEditingQuestion.answer"
        placeholder="Enter the answer"
      ></b-form-input>
      <b-button @click="addQuestion" variant="success">Add Question</b-button>
    </b-form-group>
  </b-modal>
</template>
