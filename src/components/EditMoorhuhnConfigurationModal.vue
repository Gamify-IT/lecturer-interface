<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import {
  IMoorhuhnConfiguration,
  IMoorhuhnQuestion,
  ITask,
  MoorhuhnConfiguration,
} from "@/ts/models";
import {
  getMoorhuhnConfig,
  postMoorhuhnConfig,
} from "@/ts/moorhuhn-rest-client";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const fields = [
  {
    key: "text",
    label: "Question",
  },
  {
    key: "rightAnswer",
    label: "Correct Answer",
  },
  {
    key: "wrongAnswers",
    label: "wrong Answers",
  },
  {
    key: "remove",
    label: "remove",
  },
];

const minigame = ref();
const form = ref();
const showModal = ref(props.showModal);
const text = ref();
let configuration = ref(new MoorhuhnConfiguration([]));
const question = ref();
const rightAnswer = ref();
const showQuestionModal = ref();
const oldMinigame = ref();

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
  return form.value.checkValidity();
}

function resetModal() {
  if (minigame.value.configurationId != undefined) {
    getMoorhuhnConfig(minigame.value.configurationId).then((response) => {
      configuration.value = response.data;
      console.log("getConfig");
    });
  }
  console.log("Reset Modal");
}

function handleOk() {
  postMoorhuhnConfig(configuration.value).then((response) => {
    minigame.value.configurationId = response.data.id;
    console.log(minigame.value.id);
    console.log("Submit Modal");
    oldMinigame.value = minigame.value;
    handleSubmit();
  });
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
  resetModal();
  emit("updateMinigameConfiguration", minigame.value);
}

function handleQuestionOk() {
  configuration.value.questions.push({
    text: question.value,
    rightAnswer: rightAnswer.value,
    wrongAnswers: ["test", "test2"],
  });
  showModal.value = true;
  console.log(configuration.value);
}

function handleQuestionAbort() {
  showModal.value = true;
}

function loadModal() {
  if (oldMinigame.value != null) {
    if (oldMinigame.value.id != minigame.value.id) {
      if (minigame.value.configurationId != undefined) {
        getMoorhuhnConfig(minigame.value.configurationId).then((response) => {
          configuration.value = response.data;
        });
        oldMinigame.value = minigame.value;
      } else {
        configuration.value.questions = [];
        oldMinigame.value = minigame.value;
      }
    }
  } else {
    if (minigame.value.configurationId != undefined) {
      getMoorhuhnConfig(minigame.value.configurationId).then((response) => {
        configuration.value = response.data;
        oldMinigame.value = minigame.value;
        console.log("getConfig");
      });
    } else {
      if (minigame.value.configurationId != null) {
        configuration.value.questions = [];
        oldMinigame.value = minigame.value;
        console.log("emptyQuestions");
        console.log(configuration.value);
        console.log(minigame.value);
      }
    }
  }
}

function removeQuestion(text: string) {
  let filteredQuestions: IMoorhuhnQuestion[] = [];
  configuration.value.questions.forEach((question) => {
    if (question.text != text) {
      filteredQuestions.push(question);
    }
  });
  console.log(filteredQuestions);
  configuration.value.questions = filteredQuestions;
}
</script>
<template>
  <b-modal
    title="Edit Moorhuhn configuration"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @show="loadModal"
    @abort="resetModal"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame != undefined"
    >
      <b-form-group>
        <b-button variant="success" v-b-modal.add-question>
          add question
        </b-button>
      </b-form-group>
      <b-form-group>
        <b-table :fields="fields" :items="configuration.questions">
          <template #cell(wrongAnswers)="data">
            <div v-for="answer in data.value" :key="answer">
              <span>{{ answer }}</span>
            </div>
          </template>
          <template #cell(remove)="row">
            <b-button
              size="sm"
              variant="danger"
              @click="removeQuestion(row.item.text)"
            >
              <i class="bi bi-trash"></i>
            </b-button>
          </template>
        </b-table>
      </b-form-group>
    </form>
  </b-modal>
  <b-modal
    id="add-question"
    title="Add Question to Moorhuhn configuration"
    v-model="showQuestionModal"
    @show="resetQuestionModal"
    @ok="handleQuestionOk"
    @cancel="handleQuestionAbort"
  >
    <b-form-group label="Question" label-for="question-input">
      <b-form-input id="question-input" v-model="question" required />
    </b-form-group>
    <b-form-group label="Correct Answer" label-for="correct-answer">
      <b-form-input id="correct-answer" v-model="rightAnswer" required />
    </b-form-group>
  </b-modal>
</template>
