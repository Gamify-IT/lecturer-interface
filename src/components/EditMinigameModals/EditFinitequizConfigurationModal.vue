<script setup lang="ts">
// compatible finitequiz versions: v0.0.1
import axios from "axios";

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
import config from "@/config";

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
const selectedImageCount = ref<number | null>(null);
const showImageModal = ref(false);
const imageButtons = ref<Array<string>>([]);
const selectedImages = ref<Array<File | null>>([]);
const fileNames = ref<Array<string>>([]);

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

watch(selectedImageCount, (newCount) => {
  if (newCount) {
    imageButtons.value = Array.from(
      { length: newCount },
      (_, i) => `Image ${i + 1}`
    );
  }
});

function triggerFileInput(index: number) {
  const input = document.getElementById(
    `file-input-${index}`
  ) as HTMLInputElement;
  if (input) {
    input.click();
  }
}

function addImage(index: number) {
  const input = document.getElementById(
    `file-input-${index}`
  ) as HTMLInputElement;
  if (input) {
    input.click();
  }
}

function handleFileChange(event: Event, index: number) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedImages.value[index] = file;
    fileNames.value[index] = file.name;
  }
}

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

async function handleOk() {
  try {
    const response = await postFinitequizConfig(configuration.value);
    minigame.value.configurationId = response.data.id;
    console.log(
      "Finitequiz configuration saved with questions:",
      configuration.value.questions
    );

    await putMinigame(
      parseInt(courseId.value),
      parseInt(worldIndex.value),
      parseInt(dungeonIndex.value),
      minigame.value
    );
  } catch (error) {
    toast.error("Error while saving configuration!");
  }
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

async function handleQuestionOk() {
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
    if (selectedImages.value.length > 0) {
      const validImages = selectedImages.value.filter(
        (imageFile) => imageFile !== null
      );

      if (validImages.length > 0) {
        const imageUrls = await Promise.all(
          validImages.map((imageFile) => uploadImage(imageFile as File))
        );

        configuration.value.questions.push({
          text: question.value,
          rightAnswer: rightAnswer.value,
          wrongAnswers: wrongAnswers.value,
          images: imageUrls,
        });
      } else {
        configuration.value.questions.push({
          text: question.value,
          rightAnswer: rightAnswer.value,
          wrongAnswers: wrongAnswers.value,
        });
      }
    } else {
      configuration.value.questions.push({
        text: question.value,
        rightAnswer: rightAnswer.value,
        wrongAnswers: wrongAnswers.value,
      });
    }
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
  selectedImages.value = [];
  fileNames.value = [];
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

function handleImageButtonClick() {
  // eslint-disable-next-line no-undef
  showImageModal.value = true;
}

async function handleImageModalOk() {
  showImageModal.value = false;
  console.log("Selected image count:", selectedImageCount.value);

  if (selectedImages.value.length > 0) {
    const validImages = selectedImages.value.filter(
      (imageFile) => imageFile !== null
    );

    if (validImages.length === 0) {
      console.log("No valid images to upload");
      return;
    }

    const imageUrls = await Promise.all(
      validImages.map((imageFile) => uploadImage(imageFile as File))
    );

    const currentQuestion =
      configuration.value.questions[configuration.value.questions.length - 1];
    currentQuestion.images = imageUrls;
  }
}

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      `${config.finitequizApiUrl}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return "";
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

      <b-form-group label="Question">
        <b-form-input
          v-model="question"
          placeholder="Enter your question"
          required
        />
      </b-form-group>

      <div v-if="fileNames.length > 0">
        <b-row>
          <b-col
            v-for="(fileName, index) in fileNames"
            :key="index"
            cols="4"
            class="mb-2"
          >
            <small>{{ fileName }}</small>
          </b-col>
        </b-row>
      </div>
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
      <b-form-input id="question-input" v-model="question" required />
    </b-form-group>
    <b-button
      variant="secondary"
      id="add-images-button"
      @click="handleImageButtonClick"
    >
      Add Images to Your Question
    </b-button>
    <b-form-group label="Correct Answer" label-for="correct-answer">
      <b-form-input id="correct-answer" v-model="rightAnswer" required />
    </b-form-group>
    <b-form-group label="Wrong Answers">
      <div v-for="answer in wrongAnswers" :key="answer">
        {{ answer }}
      </div>
      <div>
        <b-form-input
          @keydown.enter="addWrongAnswer"
          id="wrong-answer"
          v-model="wrongAnswer"
        ></b-form-input>
        <b-button
          @click="addWrongAnswer"
          variant="success"
          id="button-wrong-answer"
        >
          Add
        </b-button>
      </div>
    </b-form-group>
  </b-modal>

  <b-modal
    id="add-images-modal"
    title="Add Images"
    v-model="showImageModal"
    @ok="handleImageModalOk"
  >
    <b-form-group label="How many images would you like to add?">
      <div v-for="count in [1, 2, 3, 4]" :key="count">
        <b-form-radio
          :value="count"
          v-model="selectedImageCount"
          :id="'image-count-' + count"
        >
          {{ count }}
        </b-form-radio>
      </div>
    </b-form-group>

    <b-container v-if="imageButtons.length > 0">
      <b-row>
        <b-col
          v-for="(buttonLabel, index) in imageButtons"
          :key="'button-' + index"
          cols="6"
          class="mb-2"
        >
          <b-button variant="primary" @click.prevent="triggerFileInput(index)">
            {{ buttonLabel }}
          </b-button>
          <input
            type="file"
            :id="'file-input-' + index"
            class="d-none"
            @change="handleFileChange($event, index)"
          />
          <small v-if="fileNames[index]" class="text-muted">
            {{ fileNames[index] }}
          </small>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>
