<script setup lang="ts">
import { saveAs } from "file-saver";
import { arrayOf, defaultValue, int, object, string } from "checkeasy";
import { importConfiguration } from "@/ts/import-configuration";
import { defineEmits, defineProps, ref, watch } from "vue";
import {
  RegexGameConfiguration,
  RegexStructure,
  defaultRegexStructures,
  regexStructureDescriptions,
} from "@/ts/models/regexgame-models";
import {
  getRegexGameConfig,
  postRegexGameConfig,
} from "@/ts/rest-clients/regexgame-rest-client";
import { useToast } from "vue-toastification";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { useRoute } from "vue-router";
import { ITask } from "@/ts/models/overworld-models";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const route = useRoute();
const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);
const toast = useToast();
const minigame = ref(props.minigame);
const form = ref();
const showModal = ref(props.showModal);
let configuration = ref(
  new RegexGameConfiguration(undefined, defaultRegexStructures)
);
const timeEnable = ref(true);
const oldMinigame = ref();
const structureCheckboxes = ref({});

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
    getRegexGameConfig(minigame.value.configurationId)
      .then((response) => {
        configuration.value = response.data;
        setupModal();
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          minigame.value.configurationId = undefined;
        }
        setupModal();
      });
  } else {
    configuration.value.id = undefined;
    setupModal();
  }
  oldMinigame.value = minigame.value;
  console.log("Reset Modal");
}

function setupModal() {
  console.log("load configuration", configuration.value);
  Object.entries(RegexStructure)
    .filter((s) => typeof s[1] !== "string")
    .forEach(
      (k) =>
        (structureCheckboxes.value[k[0]] =
          configuration.value.allowedRegexStructures.includes(k[0]))
    );
  if (configuration.value.riddleTimeoutSeconds === 0) timeEnable.value = false;
}

function handleOk() {
  if (!timeEnable.value) configuration.value.riddleTimeoutSeconds = 0;
  let allowedRegexStructures = new Set<string>();
  Object.entries(structureCheckboxes.value).forEach((checkbox) => {
    console.log("check checkbox", checkbox[0], checkbox[1]);
    if (checkbox[1])
      allowedRegexStructures.add(
        Object.entries(RegexStructure)
          .filter((s) => typeof s[1] !== "string")
          .find((s) => s[0] === checkbox[0])![0]
      );
  });
  // eslint-disable-next-line
  configuration.value.allowedRegexStructures = Array.from(allowedRegexStructures);
  postRegexGameConfig(configuration.value)
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
  console.log(structureCheckboxes.value);
  emit("closedModal");
}

function loadModal() {
  console.log("load modal");
  if (oldMinigame.value != null && oldMinigame.value.id == minigame.value.id)
    return;
  resetModal();
}

function downloadConfiguration() {
  const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const blob = new Blob([JSON.stringify(clonedConfiguration)], {
    type: "text/json",
  });
  saveAs(blob, "RegexGame-configuration.json");
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
    const result: RegexGameConfiguration = await importConfiguration(
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
    title="Edit RegexGame configuration"
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
      <b-form-group
        label-cols-lg="6"
        label="Riddle Time (in seconds)"
        label-for="time-input"
      >
        <b-form-checkbox id="time-enable" type="checkbox" v-model="timeEnable">
          Enable Countdown
        </b-form-checkbox>
        <b-form-input
          id="time-input"
          type="number"
          v-if="timeEnable"
          v-model="configuration.riddleTimeoutSeconds"
          :state="configuration.riddleTimeoutSeconds >= 1"
        />
      </b-form-group>
      <b-form-group
        label-cols-lg="6"
        label="Amount of answers for each riddle"
        label-for="answers-input"
      >
        <b-form-input
          id="answers-input"
          type="number"
          v-model="configuration.answerCount"
          :state="configuration.answerCount > 0"
        />
      </b-form-group>
      <b-form-group
        label-cols-lg="6"
        label="Necessary rounds for completion"
        label-for="completedRounds-input"
      >
        <b-form-input
          id="completedRounds-input"
          type="number"
          v-model="configuration.minimumCompletedRounds"
          :state="configuration.minimumCompletedRounds > 0"
        />
      </b-form-group>

      <b-form-group
        label-cols-lg="6"
        label="Regex Structures"
        label-for="regexStructures-input"
      >
        <b-form-checkbox
          v-for="structure in Object.entries(RegexStructure).filter(
            (s) => typeof s[1] !== 'string'
          )"
          v-bind:key="structure"
          v-model="structureCheckboxes[structure[0]]"
        >
          {{ regexStructureDescriptions.get(structure[1] as RegexStructure) }}
        </b-form-checkbox>
      </b-form-group>
    </form>
    <ImportExportConfiguration
      @export="downloadConfiguration"
      @importFile="importFile"
    />
  </b-modal>
</template>
