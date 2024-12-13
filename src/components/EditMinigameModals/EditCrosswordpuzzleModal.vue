<script setup lang="ts">
// compatible crosswordpuzzle versions: v0.0.6
const compatibleVersions = ["v0.0.6"];
import { saveAs } from "file-saver";
import { arrayOf, object, optional, string, int, nullable } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, ref, watch } from "vue";
import { ITask } from "@/ts/models/overworld-models";
import {
  CrosswordpuzzleConfiguration,
  CrosswordpuzzleQuestion,
} from "@/ts/models/crosswordpuzzle-models";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { useRoute } from "vue-router";
import {
  getCrosswordpuzzleConfig,
  postCrosswordpuzzleConfig,
} from "@/ts/rest-clients/crosswordpuzzle-rest-client";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";

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
    label: "Remove",
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
  return true;
}

function resetModal() {
  currentEditingQuestion.value = new CrosswordpuzzleQuestion("", "");
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
    configuration.value.id = undefined;
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
      (filtered) => filtered.questionText == questionText
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

function downloadConfiguration() {
  const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const clonedQuestions = Array<CrosswordpuzzleQuestion>();
  for (let question of configuration.value.questions) {
    const { ["id"]: unused, ...clonedQuestion } = question;
    clonedQuestions.push(clonedQuestion);
  }
  clonedConfiguration.questions = clonedQuestions;
  const blob = new Blob([JSON.stringify(clonedConfiguration)], {
    type: "text/json",
  });
  saveAs(blob, "crosswordpuzzle-configuration.json");
}

async function importFile(event: any) {
  const file = event.target.files[0];
  const validator = object({
    name: optional(string()),
    questions: arrayOf(
      object({
        questionText: string(),
        answer: string(),
      })
    ),
    volumeLevel: optional(nullable(int())),
  });
  try {
    const result: CrosswordpuzzleConfiguration = await importConfiguration(
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
    title="Edit Crosswordpuzzle configuration"
    id="edit-modal"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @cancel="resetModal"
    @show="loadModal"
    @abort="resetModal"
  >
    <template v-slot:title>
      Edit Crosswordpuzzle configuration
      <b-col style="font-size: 12px">
        Compatible versions: {{ compatibleVersions }}</b-col
      >
    </template>
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
      <b-button @click="addQuestion" variant="success">Add question</b-button>
    </b-form-group>
    <ImportExportConfiguration
      @export="downloadConfiguration"
      @importFile="importFile"
    />
  </b-modal>
</template>
