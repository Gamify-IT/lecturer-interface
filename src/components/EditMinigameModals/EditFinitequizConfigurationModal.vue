<script setup lang="ts">
// compatible finitequiz versions: v0.0.1
const compatibleVersions = ["v0.0.1"];
import { saveAs } from "file-saver";
import { arrayOf, object, string, optional, int, nullable } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, ref, watch } from "vue";
import { ITask } from "@/ts/models/overworld-models";
import {
  FinitequizConfiguration,
  IFinitequizQuestion,
  IWrongAnswer,
} from "@/ts/models/finitequiz-models";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { useRoute } from "vue-router";
import {
  getFinitequizConfig,
  postFinitequizConfig,
  putFinitequizConfig,
} from "@/ts/rest-clients/finitequiz-rest-client";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";
import { v4 as uuidv4 } from "uuid";
import { postFinitequizImage } from "@/ts/rest-clients/image-rest-client";
import { computed } from "vue";

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
const wrongAnswers = ref<IWrongAnswer[]>([]);
const wrongAnswer = ref();

const selectedImageCount = ref<number | null>(null);
const showImageModal = ref(false);
const imageButtons = ref<Array<string>>([]);
const selectedImages = ref<Array<File | null>>([]);
const fileNames = ref<Array<string>>([]);
const correctAnswerImages = ref<Array<File | null>>([]);
const correctAnswerFileNames = ref<Array<string>>([]);
const wrongAnswerImages = ref<Array<File | null>>([]);
let noInputCounter = 0;
const imageDescription = ref("");
const imageUUIDsWithDescriptions = ref<Array<{ description: string }>>([]);
const imageDescriptions = ref<string[]>([]);
const questionLength = computed(() => question.value.length);

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
    imageDescriptions.value = Array(newCount).fill("");
  }
});

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
  console.log("@ok");
  const updateConfigurationRequest = configuration.value.id
    ? putFinitequizConfig(configuration.value.id, configuration.value)
    : postFinitequizConfig(configuration.value);

  updateConfigurationRequest
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
      if (statusCode === 400) {
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

async function handleQuestionOk() {
  if (question.value.trim().length > 300) {
    toast.error("The question must not exceed 300 characters.");
    return;
  }

  if (rightAnswer.value.trim().length > 100) {
    toast.error("The correct answer must not exceed 100 characters.");
    return;
  }

  if (wrongAnswers.value.some((answer) => answer.text.length > 100)) {
    toast.error("One of the wrong answers exceeds 100 characters.");
    return;
  }

  imageUUIDsWithDescriptions.value = imageDescriptions.value.map((desc) => ({
    description: desc.trim(),
  }));

  const questionUUID = String(uuidv4());
  const correctAnswerUUID = uuidv4();

  const correctAnswerText: string =
    rightAnswer.value.trim() === "" ? "no input" : rightAnswer.value;

  if (wrongAnswer.value != "") {
    wrongAnswers.value.push(wrongAnswer.value);
  }

  let contains = false;
  configuration.value.questions.some(
    (pQuestion) => pQuestion.text.trim() === question.value.trim()
  );

  if (!contains) {
    configuration.value.questions.push({
      text: question.value,
      rightAnswer: [correctAnswerUUID, correctAnswerText],
      wrongAnswers: wrongAnswers.value,
      uuid: questionUUID,
    });

    if (correctAnswerImages.value.length > 0) {
      const validCorrectAnswerImages = correctAnswerImages.value.filter(
        (imageFile) => imageFile !== null
      );

      if (validCorrectAnswerImages.length > 0) {
        for (let image of validCorrectAnswerImages) {
          if (image) {
            await postFinitequizImage(correctAnswerUUID, image, " ");
          }
        }
      }
    }
  }

  if (selectedImages.value.length > 0) {
    const validImages = selectedImages.value.filter(
      (imageFile) => imageFile !== null
    );

    if (validImages.length > 0) {
      for (let index = 0; index < validImages.length; index++) {
        const image = validImages[index];
        if (image) {
          const description =
            imageUUIDsWithDescriptions.value[index]?.description || "";
          await postFinitequizImage(questionUUID, image, description);
        }
      }
    }
  }

  imageUUIDsWithDescriptions.value = [];
  showQuestionModal.value = false;
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
  correctAnswerImages.value = [];
  correctAnswerFileNames.value = [];
  wrongAnswerImages.value = [];
}

function addWrongAnswer() {
  if (wrongAnswer.value.trim().length > 100) {
    toast.error("The wrong answer exceeds the 100 character limit.");
    return;
  }

  const newWrongAnswer: IWrongAnswer = {
    uuid: uuidv4(),
    text:
      wrongAnswer.value.trim() === ""
        ? `no input ${noInputCounter++}`
        : wrongAnswer.value.trim(),
  };

  wrongAnswers.value.push(newWrongAnswer);
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
    volumeLevel: optional(nullable(int())),
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

function handleImageChange(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > 1048576) {
      toast.error(
        `The image "${file.name}" is too large! Please select an image under 1MB.`
      );
      return;
    }

    selectedImages.value[index] = file;
    fileNames.value[index] = file.name;
    console.log("Selected image at index", index, ":", file);

    const description = imageDescriptions.value[index].trim();
    if (description) {
      if (imageUUIDsWithDescriptions.value[index]) {
        imageUUIDsWithDescriptions.value[index].description = description;
      } else {
        imageUUIDsWithDescriptions.value.push({ description });
      }
    }
  }
}

function addSingleImage(event: Event, isCorrectAnswer = false) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > 1048576) {
      toast.error(
        `The image "${file.name}" is too large! Please select an image under 1MB.`
      );
      return;
    }

    if (isCorrectAnswer) {
      correctAnswerImages.value = [file];
      correctAnswerFileNames.value = [file.name];
    }
    console.log("Selected image:", file);
  }
}

function addImageToWrongAnswer(index: number) {
  const input = document.getElementById(
    `file-input-wrong-${index}`
  ) as HTMLInputElement;
  if (input) {
    input.click();
  }
}

async function handleWrongAnswerImageChange(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];

    if (file.size > 1048576) {
      toast.error(
        `The image "${file.name}" is too large! Please select an image under 1MB.`
      );
      return;
    }

    wrongAnswerImages.value[index] = file;
    const wrongAnswerUUID = wrongAnswers.value[index].uuid;

    console.log("Selected image for wrong answer:", file);
    await postFinitequizImage(wrongAnswerUUID, file, "");
    console.log("Sent image for wrong answer with UUID:", wrongAnswerUUID);
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
            <div v-for="(answer, index) in data.value" :key="answer.uuid">
              <span>{{ answer.text }}</span>
              <input
                type="file"
                :id="'file-input-wrong-' + index"
                accept="image/*"
                style="display: none"
                @change="handleWrongAnswerImageChange(index, $event)"
              />
              <div v-if="wrongAnswerImages[index]">
                <small>{{ wrongAnswerImages[index]?.name }}</small>
              </div>
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
    <b-form-text class="red-italic-text">
      Note: Image size must not exceed 1MB.
    </b-form-text>
    <b-form-group label="Question" label-for="question-input">
      <b-form-input id="question-input" v-model="question" required />
      <small class="text-muted"> {{ question.length }}/300 characters </small>
      <small v-if="question.length > 300" class="text-danger">
        You have exceeded the 300 character limit for the question!
      </small>
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
      <small class="text-muted">
        {{ rightAnswer.length }}/100 characters
      </small>
      <small v-if="rightAnswer.length > 100" class="text-danger">
        You have exceeded the 300 character limit for the right answer!
      </small>
    </b-form-group>
    <b-button
      variant="secondary"
      id="add-single-image-button"
      @click="($refs.correctAnswerInput as HTMLInputElement).click()"
    >
      Add Image to Correct Answer
    </b-button>
    <input
      type="file"
      ref="correctAnswerInput"
      accept="image/*"
      style="display: none"
      @change="addSingleImage($event, true)"
    />
    <div v-if="correctAnswerFileNames[0]">
      <small>{{ correctAnswerFileNames[0] }}</small>
    </div>

    <b-form-group label="Wrong Answers">
      <div
        v-for="(answer, index) in wrongAnswers"
        :key="answer.uuid"
        class="d-flex justify-content-between align-items-center"
      >
        <span>{{ answer.text }}</span>
        <b-button
          variant="outline-secondary"
          @click="addImageToWrongAnswer(index)"
        >
          Add Image to Wrong Answer
        </b-button>
        <input
          type="file"
          :id="'file-input-wrong-' + index"
          accept="image/*"
          style="display: none"
          @change="handleWrongAnswerImageChange(index, $event)"
        />
        <div v-if="wrongAnswerImages[index]">
          <small>{{ wrongAnswerImages[index]?.name }}</small>
        </div>
      </div>
      <div class="d-flex flex-column gap-2">
        <b-form-input
          @keydown.enter="addWrongAnswer"
          id="wrong-answer"
          v-model="wrongAnswer"
        ></b-form-input>
        <small class="text-muted"
          >{{ wrongAnswer.length }}/100 characters</small
        >
        <small v-if="wrongAnswer.length > 100" class="text-danger">
          You have exceeded the 100 character limit for this wrong answer!
        </small>
        <div class="d-flex justify-content-start mt-2">
          <b-button
            @click="addWrongAnswer"
            variant="success"
            size="sm"
            id="button-wrong-answer"
          >
            Add Wrong Answer
          </b-button>
        </div>
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
          class="mb-3"
        >
          <b-button variant="primary" @click="addImage(index)">
            variant="primary" @click="addImage(index)" style="font-size: 0.9rem;
            padding: 5px 10px;"
            {{ buttonLabel }}
          </b-button>

          <input
            type="file"
            :id="'file-input-' + index"
            accept="image/*"
            style="display: none"
            @change="handleImageChange(index, $event)"
          />
          <div v-if="fileNames[index]">
            <small>{{ fileNames[index] }}</small>
          </div>
          <b-form-group
            label="Image Description"
            v-if="selectedImages.length > 0"
          >
            <b-form-input
              v-model="imageDescriptions[index]"
              placeholder="Optional image description"
            ></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<style scoped>
.red-italic-text {
  color: red !important;
  font-size: 12px;
  margin-top: 10px;
  font-style: italic;
}
</style>
