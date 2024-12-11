<script setup lang="ts">
// compatible finitequiz versions: v0.0.1
const compatibleVersions = ["v0.0.1"];
import { saveAs } from "file-saver";
import { arrayOf, object, string } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, ref, watch } from "vue";
import { ITask } from "@/ts/models/overworld-models";
import {
  FinitequizConfiguration,
  IFinitequizQuestion,
} from "@/ts/models/finitequiz-models";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { useRoute } from "vue-router";
import {
  getFinitequizConfig,
  postFinitequizConfig,
} from "@/ts/rest-clients/finitequiz-rest-client";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";

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
    label: "Wrong Answers",
  },
  {
    key: "remove",
    label: "Remove",
  },
];

const route = useRoute();
const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);
const toast = useToast();
const minigame = ref(props.minigame);
const form = ref();
const showModal = ref(props.showModal);
let configuration = ref(new FinitequizConfiguration([]));
const question = ref();
const rightAnswer = ref();
const showQuestionModal = ref();
const oldMinigame = ref();
const wrongAnswers = ref(Array<string>());
const wrongAnswer = ref();

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

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0] as string;
    worldIndex.value = newVal[1] as string;
    dungeonIndex.value = newVal[2] as string;
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
    getFinitequizConfig(minigame.value.configurationId)
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
    oldMinigame.value = minigame.value;
  } else {
    configuration.value.id = undefined;
    configuration.value.questions = [];
    oldMinigame.value = minigame.value;
  }
  console.log("Reset Modal");
}

function handleOk() {
  postFinitequizConfig(configuration.value)
    .then((response) => {
      minigame.value.configurationId = response.data.id;
      console.log("Submit Modal");
      console.log("id:" + response.data.id);
      console.log("minigameId" + minigame.value.configurationId);
      oldMinigame.value = minigame.value;
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
      const statusCode = error.response.status;
      const errorMessages = error.response.data.errors;
      if (statusCode == 400) {
        for (let errorMessage of errorMessages) {
          toast.error("Error while saving configuration: " + errorMessage);
        }
      } else {
        toast.error("There was an error saving the configuration!");
      }
    });
}

function handleSubmit() {
  // Exit when the form isn't valid
  if (!checkFormValidity()) {
    return;
  }
  emit("updateMinigameConfiguration", minigame.value);
}

function hiddenModal() {
  if (!showQuestionModal.value) {
    oldMinigame.value = null;
    console.log("Test");
  }
  console.log("Modal hidden");
  emit("closedModal");
}

function loadModal() {
  if (oldMinigame.value != null) {
    if (oldMinigame.value.id != minigame.value.id) {
      resetModal();
    }
  } else {
    resetModal();
  }
}

function removeQuestion(text: string) {
  let filteredQuestions: IFinitequizQuestion[] = [];
  configuration.value.questions.forEach((innerQuestion) => {
    if (innerQuestion.text != text) {
      filteredQuestions.push(innerQuestion);
    }
  });
  console.log(filteredQuestions);
  configuration.value.questions = filteredQuestions;
}

function handleQuestionOk() {
  //removes the need to press add
  if (wrongAnswer.value != "") {
    wrongAnswers.value.push(wrongAnswer.value);
  }
  let contains = false;
  configuration.value.questions.forEach((pQuestion) => {
    if (pQuestion.text == question.value) {
      contains = true;
    }
  });
  if (!contains) {
    configuration.value.questions.push({
      text: question.value,
      rightAnswer: rightAnswer.value,
      wrongAnswers: wrongAnswers.value,
    });
  } else {
    toast.error("Question already exists.");
  }
  showModal.value = true;
}

function handleQuestionAbort() {
  showModal.value = true;
}

function resetQuestionModal() {
  question.value = "";
  rightAnswer.value = "";
  wrongAnswers.value = [];
  wrongAnswer.value = "";
}

function addWrongAnswer() {
  wrongAnswers.value.push(wrongAnswer.value);
  wrongAnswer.value = "";
}
function downloadConfiguration() {
  const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const clonedQuestions = Array<IFinitequizQuestion>();
  for (let question of configuration.value.questions) {
    const { ["id"]: unused, ...clonedQuestion } = question;
    clonedQuestions.push(clonedQuestion);
  }
  clonedConfiguration.questions = clonedQuestions;
  const blob = new Blob([JSON.stringify(clonedConfiguration)], {
    type: "text/json",
  });
  saveAs(blob, "finitequiz-configuration.json");
}
async function importFile(event: any) {
  const file = event.target.files[0];
  const validator = object({
    questions: arrayOf(
      object({
        text: string(),
        rightAnswer: string(),
        wrongAnswers: arrayOf(string()),
      })
    ),
  });
  try {
    const result: FinitequizConfiguration = await importConfiguration(
      file,
      validator,
      toast
    );
    configuration.value = result;
  } catch (e) {
    console.log("Import was not successful");
  }
}
</script>
<template>
  <b-modal
    title="Edit Finitequiz configuration"
    id="edit-modal"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @cancel="resetModal"
    @show="loadModal"
    @abort="resetModal"
  >
    <template v-slot:title>
      Edit Finitequiz configuration
      <b-col style="font-size: 12px">
        Compatible versions: {{ compatibleVersions }}</b-col
      >
    </template>
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame !== undefined"
    >
      <b-form-group>
        <b-button
          variant="success"
          id="add-question-button"
          v-b-modal.add-question-finitequiz
        >
          Add question
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
              <em class="bi bi-trash"></em>
            </b-button>
          </template>
        </b-table>
      </b-form-group>
    </form>
    <ImportExportConfiguration
      @export="downloadConfiguration"
      @importFile="importFile"
    />
  </b-modal>
  <b-modal
    id="add-question-finitequiz"
    title="Add Question to Finitequiz configuration"
    v-model="showQuestionModal"
    @hidden="resetQuestionModal"
    @show="resetQuestionModal"
    @ok="handleQuestionOk"
    @cancel="handleQuestionAbort"
  >
    <b-form-group label="Question" label-for="question-input">
      <b-form-textarea id="question-input" v-model="question" required />
    </b-form-group>
    <b-form-group label="Correct Answer" label-for="correct-answer">
      <b-form-textarea id="correct-answer" v-model="rightAnswer" required />
    </b-form-group>
    <b-form-group label="Wrong Answers">
      <div v-for="answer in wrongAnswers" :key="answer">
        {{ answer }}
      </div>
      <div>
        <b-form-textarea
          @keydown.enter="addWrongAnswer"
          id="wrong-answer"
          v-model="wrongAnswer"
        ></b-form-textarea>
        <b-button
          @click="addWrongAnswer"
          variant="success"
          id="button-wrong-answer"
          >Add</b-button
        >
      </div>
    </b-form-group>
  </b-modal>
</template>
