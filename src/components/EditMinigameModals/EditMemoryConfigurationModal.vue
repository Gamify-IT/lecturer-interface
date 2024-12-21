<script setup lang="ts">
import { saveAs } from "file-saver";
import { arrayOf, object, oneOf, string } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, Ref, ref, watch } from "vue";
import {
  getMemoryConfig,
  postMemoryConfig,
  putMemoryConfig,
} from "@/ts/rest-clients/memory-rest-client";
import { postMemoryImage } from "@/ts/rest-clients/image-rest-client";
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
import { v4 as uuidv4 } from "uuid";

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

const numberOfPairs = 6;
const cardPairs = ref([]) as Ref<MemoryCardPair[]>;
initializePairs();

const configuration = ref(new MemoryConfiguration(cardPairs.value));

const showEditModal = ref(false);
const inEditModal = ref(false);

const card1Type = ref();
const card1Content = ref();
const card2Type = ref();
const card2Content = ref();
const editObject = ref();
const card1Image = ref();
const card2Image = ref();

const memoryCardTypeValues = Object.values(MemoryCardType);

const memoryCardTypes = memoryCardTypeValues.map((item) => {
  return { text: item.charAt(0) + item.slice(1).toLowerCase(), value: item };
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

function initializePairs() {
  cardPairs.value = [];
  for (let index = 0; index < numberOfPairs; index++) {
    cardPairs.value.push(
      new MemoryCardPair(
        new MemoryCard("", MemoryCardType.TEXT),
        new MemoryCard("", MemoryCardType.TEXT)
      )
    );
  }
}

function loadConfig() {
  if (minigame.value.configurationId != undefined) {
    getMemoryConfig(minigame.value.configurationId)
      .then((response) => {
        cardPairs.value = response.data.pairs;
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          resetConfig();
        }
      });
  } else {
    resetConfig();
  }
}

function resetConfig() {
  configuration.value.id = undefined;
  configuration.value.pairs = [];
  initializePairs();
}

function handleOk() {
  console.log("@ok");
  // based if configuration id is present or not send post or put request
  const updateConfigurationRequest = configuration.value.id
    ? putMemoryConfig(
        configuration.value.id,
        new MemoryConfiguration(cardPairs.value)
      )
    : postMemoryConfig(new MemoryConfiguration(cardPairs.value));
  updateConfigurationRequest
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
      const statusCode = error.response.status;
      const errorMessages = error.response.data.errors;
      if (statusCode == 400) {
        for (let errorMessage of errorMessages) {
          toast.error("Error while saving configuration: " + errorMessage);
        }
      } else {
        toast.error("There was an error saving the configuration!");
      }
    })
    .finally(() => resetConfig());
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
  if (!inEditModal.value) {
    // coming from main menu
    loadConfig();
  }
  inEditModal.value = false;
  console.log("Modal shown");
}

function handlePairOk() {
  if (
    card1Type.value !== MemoryCardType.IMAGE &&
    card2Type.value !== MemoryCardType.IMAGE
  ) {
    console.log("Saving pair changes (@ok)");
    editObject.value.card1.content = card1Content.value;
    editObject.value.card1.type = card1Type.value;
    editObject.value.card2.content = card2Content.value;
    editObject.value.card2.type = card2Type.value;
  } else if (card1Type.value == MemoryCardType.IMAGE) {
    let image = card1Image.value;
    let uuid: string = uuidv4();
    postMemoryImage(uuid, image);
    editObject.value.card1.content = uuid;
    editObject.value.card1.type = card1Type.value;
    editObject.value.card2.content = card2Content.value;
    editObject.value.card2.type = card2Type.value;
  } else if (card2Type.value == MemoryCardType.IMAGE) {
    let image = card2Image.value;
    let uuid: string = uuidv4();
    postMemoryImage(uuid, image);
    editObject.value.card1.content = card1Content.value;
    editObject.value.card1.type = card1Type.value;
    editObject.value.card2.content = uuid;
    editObject.value.card2.type = card2Type.value;
  } else {
    let image1 = card1Image.value;
    let uuid1: string = uuidv4();
    postMemoryImage(uuid1, image1);
    let image2 = card2Image.value;
    let uuid2: string = uuidv4();
    postMemoryImage(uuid2, image2);
    editObject.value.card1.content = uuid1;
    editObject.value.card1.type = card1Type.value;
    editObject.value.card2.content = uuid2;
    editObject.value.card2.type = card2Type.value;
  }
  console.log("New pairs: " + cardPairs.value);
  showModal.value = true;
}

function handlePairAbort() {
  showModal.value = true;
}

function resetPairModal() {
  console.log("Resetting pair modal (@hidden)");
  editObject.value = null;
}

function setupPairModal() {
  console.log("Setting up pair modal (@show)");
  showModal.value = false;
  inEditModal.value = true;
  card1Content.value = editObject.value.card1.content;
  card1Type.value = editObject.value.card1.type;
  card2Content.value = editObject.value.card2.content;
  card2Type.value = editObject.value.card2.type;
}

function onEditClick(edit: any) {
  editObject.value = edit;
  showEditModal.value = true;
}

function downloadConfiguration() {
  const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const clonedCardPairs = Array<IMemoryCardPair>();
  for (let cardPair of cardPairs.value) {
    const { ["id"]: unused1, ...clonedCard1 } = cardPair.card1;
    const { ["id"]: unused2, ...clonedCard2 } = cardPair.card2;
    clonedCardPairs.push({ card1: clonedCard1, card2: clonedCard2 });
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
    pairs: arrayOf(
      object({
        card1: object({
          content: string(),
          type: oneOf([
            MemoryCardType.TEXT,
            MemoryCardType.MARKDOWN,
            MemoryCardType.IMAGE,
          ] as const),
        }),
        card2: object({
          content: string(),
          type: oneOf([
            MemoryCardType.TEXT,
            MemoryCardType.MARKDOWN,
            MemoryCardType.IMAGE,
          ] as const),
        }),
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
    cardPairs.value = result.pairs;
  } catch (e) {
    console.log("Import was not successful.");
  }
}

function onFileChange(event: Event, index: Number) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    if (index == 1) {
      card1Image.value = input.files[0];
    } else {
      card2Image.value = input.files[0];
    }
  } else {
    console.log("no file");
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
    @show="loadModal"
    @cancel="resetConfig"
  >
    <form
      ref="form"
      @submit.stop.prevent="handleSubmit"
      v-if="minigame !== undefined"
    >
      <b-form-group>
        <b-table :fields="fields" :items="cardPairs">
          <template #cell(card1)="data">
            <div style="color: slategray; font-weight: 600">
              {{ data.item.card1.type }}
            </div>
            <span
              v-if="
                data.item.card1.type == MemoryCardType.TEXT ||
                data.item.card1.type == MemoryCardType.MARKDOWN
              "
            >
              {{ data.item.card1.content.slice(0, 10) }}
            </span>
            <span v-if="data.item.card1.content.length > 10">...</span>
          </template>
          <template #cell(card2)="data">
            <div style="color: slategray; font-weight: 600">
              {{ data.item.card2.type }}
            </div>
            <span
              v-if="
                data.item.card2.type == MemoryCardType.TEXT ||
                data.item.card2.type == MemoryCardType.MARKDOWN
              "
            >
              {{ data.item.card2.content.slice(0, 10) }}
            </span>
            <span v-if="data.item.card2.content.length > 10">...</span>
          </template>
          <template #cell(edit)="data">
            <b-button variant="outline-primary" @click="onEditClick(data.item)"
              >Edit pair</b-button
            >
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
    id="edit-cards"
    title="Add and edit cards to Memory configuration"
    v-model="showEditModal"
    @hidden="resetPairModal"
    @show="setupPairModal"
    @ok="handlePairOk"
    @cancel="handlePairAbort"
  >
    <b-form-group label="Card 1" label-for="card-1">
      <b-form-select
        id="card1CardType"
        v-model="card1Type"
        :options="memoryCardTypes"
        required
      />
      <b-form-textarea
        id="card-1"
        v-model="card1Content"
        v-if="
          card1Type === MemoryCardType.TEXT ||
          card1Type === MemoryCardType.MARKDOWN
        "
        placeholder="Enter card text here..."
        rows="5"
        required
      />
      <div v-if="card1Type === MemoryCardType.IMAGE">
        <br />
        <input
          type="file"
          class="form-control"
          name="file1"
          accept="image/*"
          @change="onFileChange($event, 1)"
        />
      </div>
      <br />
    </b-form-group>

    <b-form-group label="Card 2" label-for="card-2">
      <b-form-select
        id="card2CardType"
        v-model="card2Type"
        :options="memoryCardTypes"
        required
      />
      <b-form-textarea
        id="card-2"
        v-model="card2Content"
        v-if="
          card2Type === MemoryCardType.TEXT ||
          card2Type === MemoryCardType.MARKDOWN
        "
        placeholder="Enter card text here..."
        rows="5"
        required
      />
      <div v-if="card2Type === MemoryCardType.IMAGE">
        <br />
        <input
          type="file"
          class="form-control"
          name="file2"
          accept="image/*"
          @change="onFileChange($event, 2)"
        />
      </div>
    </b-form-group>
  </b-modal>
</template>

<style scoped>
#time-input {
  width: 6vw;
}
</style>
