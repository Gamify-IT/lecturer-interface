<script setup lang="ts">
import { saveAs } from "file-saver";
import { arrayOf, defaultValue, int, object, string } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, onMounted, ref, watch } from "vue";
import {
  getMemoryConfig,
  postMemoryConfig,
} from "@/ts/rest-clients/memory-rest-client";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { useRoute } from "vue-router";
import { ITask } from "@/ts/models/overworld-models";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";
import {
  IMemoryCardPair,
  MemoryCard,
  MemoryCardPair,
  MemoryCardType,
  MemoryConfiguration,
} from "@/ts/models/memory-models";
import { config } from "process";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const fields = [
  {
    key: "card1",
    label: "Card 1",
  },
  {
    key: "card2",
    label: "Card 2",
  },
  {
    key: "edit",
    label: "Edit",
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

let cardPairs: IMemoryCardPair[] = [];
for (let index = 0; index < 6; index++) {
  cardPairs[index] = new MemoryCardPair(
    new MemoryCard("", MemoryCardType.TEXT),
    new MemoryCard("", MemoryCardType.TEXT)
  );
}

const configuration = ref();

console.log("asdf" + JSON.stringify(configuration.value.pairs));
const question = ref();
const rightAnswer = ref();
const showQuestionModal = ref();
const oldMinigame = ref();
const wrongAnswers = ref(Array<string>());
const wrongAnswer = ref();

const card1Type = ref();
const card2Type = ref();

let memoryCardTypeValues = Object.values(MemoryCardType);

const memoryCardTypes = memoryCardTypeValues.map((item) => {
  return item.charAt(0) + item.slice(1).toLowerCase();
});

onMounted(() => {
  const cardPairs: IMemoryCardPair[] = [];
  for (let index = 0; index < 6; index++) {
    cardPairs[index] = new MemoryCardPair(
      new MemoryCard("", MemoryCardType.TEXT),
      new MemoryCard("", MemoryCardType.TEXT)
    );
  }
  configuration.value = new MemoryConfiguration(cardPairs);
});

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
    getMemoryConfig(minigame.value.configurationId)
      .then((response) => {
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          minigame.value.configurationId = undefined;
          configuration.value.pairs = [];
        }
      });
    oldMinigame.value = minigame.value;
  } else {
    configuration.value.id = undefined;
    configuration.value.pairs = [];
    oldMinigame.value = minigame.value;
  }
  console.log("Reset Modal");
}

function handleOk() {
  postMemoryConfig(configuration.value)
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
          toast.error("Error on saving configuration: " + errorMessage);
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

function handleQuestionAbort() {
  showModal.value = true;
}

function resetQuestionModal() {
  question.value = "";
  rightAnswer.value = "";
  wrongAnswers.value = [];
  wrongAnswer.value = "";
}

function downloadConfiguration() {
  const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const clonedCardPairs = Array<IMemoryCardPair>();
  for (let cardPair of configuration.value.pairs) {
    const { ["id"]: unused, ...clonedCardPair } = cardPair;
    clonedCardPairs.push(clonedCardPair);
  }
  clonedConfiguration.pairs = clonedCardPairs;
  const blob = new Blob([JSON.stringify(clonedConfiguration)], {
    type: "text/json",
  });
  saveAs(blob, "memory-configuration.json");
}
async function importFile(event: any) {
  const file = event.target.files[0];
  const validator = object({
    time: defaultValue(60, int()),
    questions: arrayOf(
      object({
        text: string(),
        rightAnswer: string(),
        wrongAnswers: arrayOf(string()),
      })
    ),
  });
  try {
    const result: MemoryConfiguration = await importConfiguration(
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
    title="Edit Memory configuration"
    id="edit-modal"
    v-model="showModal"
    @hidden="hiddenModal"
    @ok="handleOk"
    @cancel="resetModal"
    @show="loadModal"
    @abort="resetModal"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame !== undefined"
    >
      <b-form-group>
        <b-button variant="success" id="add-cards-button" v-b-modal.edit-cards>
          add card pair
        </b-button>
      </b-form-group>
      <b-form-group>
        <!--<b-table :items="configuration.pairs">
          <template #cell(edit)="data">
            <b-button
              variant="info"
              id="edit-cardpair-button"
              v-b-modal.edit-cards
            >
              Edit card pair
              {{ data }}
            </b-button>
          </template>
          <template #cell(card1)="data">
            {{ data.item.card1.content }}
          </template>
          <template #cell(card2)="data">
            {{ data.value.card2.content }}
          </template>
        </b-table>-->
        <div>{{ configuration.pairs.length }}</div>
        <b-card v-for="pair in configuration.id" :key="pair">
          {{ pair }}
        </b-card>
      </b-form-group>
    </form>
    <ImportExportConfiguration
      @export="downloadConfiguration"
      @importFile="importFile"
    />
  </b-modal>
  <b-modal
    id="edit-cards"
    title="Add and edit Cards to Memory configuration"
    v-model="showQuestionModal"
    @hidden="resetQuestionModal"
    @show="resetQuestionModal"
    @cancel="handleQuestionAbort"
  >
    <b-form-group label="Card 1" label-for="card-1">
      <b-form-select
        id="card1CardType"
        v-model="card1Type"
        :options="memoryCardTypes"
        :value="null"
        required
      />
      <b-form-textarea
        id="card-1"
        v-model="öaskdlf"
        v-if="card1Type === 'Text' || card1Type === 'Markdown'"
        placeholder="Enter card text here..."
        rows="5"
        required
      />
      <div v-if="card1Type === 'Image'">
        <label class="form-label" for="customFile">Input your image</label>
        <input type="file" class="form-control" id="customFile" />
      </div>
    </b-form-group>

    <b-form-group label="Card 2" label-for="card-2">
      <b-form-select
        id="card2CardType"
        v-model="card2Type"
        :options="memoryCardTypes"
        :value="null"
        required
      />
      <b-form-textarea
        id="card-2"
        v-model="KAISERSCHMARRN"
        v-if="card2Type === 'Text' || card2Type === 'Markdown'"
        placeholder="Enter card text here..."
        rows="5"
        required
      />
      <div v-if="card2Type === 'Image'">
        <label class="form-label" for="customFile">Input your image</label>
        <input type="file" class="form-control" id="customFile" />
      </div>
    </b-form-group>
  </b-modal>
</template>

<style scoped>
#time-input {
  width: 6vw;
}
</style>
