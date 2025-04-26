<script setup lang="ts">
import { defineEmits, defineProps, ref, Ref, watch } from "vue";
import { GraphData, TaskType, UmlgameConfiguration, UmlTask } from "@/ts/models/umlgame-models";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { ITask } from "@/ts/models/overworld-models";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";
import { BFormSelect, BTable } from "bootstrap-vue-3";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { getUmlgameConfig, postUmlgameConfig, putUmlgameConfig } from "@/ts/rest-clients/umlgame-rest-client";
import UmlEditorModal from "@/components/EditMinigameModals/UmlModals/UmlEditorModal.vue";

const props = defineProps<{
  minigame: ITask;
  showModal: boolean;
}>();

const fields = [
  {
    key: "task",
    label: "Task",
  },
  {
    key: "selection",
    label: "Tasktype",
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

let configuration = ref(new UmlgameConfiguration([]));
const showCompletionTaskModal = ref(false);
const showErrorhuntTaskModal = ref(false);
const isEditorOpen = ref(false);

const taskList = ref([]) as Ref<UmlTask[]>;
initializeTasks();

// TODO: adapt to available modes
const taskText = ref();
const selected = null;
const editorData = ref() as Ref<GraphData>;
const editObject = ref();

// Here are the parameters you need to adapt when expanding the game
const selectionOptions = [{value: TaskType.COMPLETION, text:'Completion'}, {value: TaskType.ERRORHUNT, text:'Error hunt'},
  {value: TaskType.CODETOUML, text:'Code -> UML'}, {value: TaskType.UMLTOCODE, text:'UML -> Code'}];
const numberOfQuestions = 10;

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

// FERTIG
function checkFormValidity(): boolean {
  return form.value.checkValidity();
}

// FERTIG
function loadConfig() {
  console.log("loadConfig()")
  if (minigame.value.configurationId != undefined) {
    getUmlgameConfig(minigame.value.configurationId)
      .then((response) => {
        taskList.value = response.data.taskList;
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          resetConfig();
        }
      });
  } else {
    resetConfig()
  }
  console.log("Reset Modal");
}

// FERTIG
function resetConfig() {
  console.log("resetConfig()")
  configuration.value.id = ""; // undefined
  configuration.value.taskList = [];
  initializeTasks();
}

function initializeTasks() {
  console.log("initializeTasks()")
  taskList.value = [];
  for(let index = 0; index < numberOfQuestions; index++) {
    taskList.value.push(new UmlTask((index + 1).toString(), "", "", TaskType.COMPLETION))
  }
}

const openedIndex = ref();
function onEditClick(type: TaskType, edit: any) {
  console.log("onEditClick")
  editObject.value = edit;
  editorData.value = new GraphData(editObject.value.graphAsJson, editObject.value.graphDescription);
  openedIndex.value = edit.id;
  switch (type) {
    case TaskType.COMPLETION: {
      showCompletionTaskModal.value = true;
      break;
    }
    case TaskType.ERRORHUNT: {
      showErrorhuntTaskModal.value = true;
      break;
    }
  }
}

// FERTIG
function handleOk() {
  console.log("@ok")
  const updateConfigurationRequest = configuration.value.id
    ? putUmlgameConfig(
      configuration.value.id,
      new UmlgameConfiguration(taskList.value)
    )
    : postUmlgameConfig(new UmlgameConfiguration(taskList.value));
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

// FERTIG
function handleSubmit() {
  // Exit when the form isn't valid
  console.log("handleSubmit")
  if (!checkFormValidity()) {
    return;
  }
  emit("updateMinigameConfiguration", minigame.value);
}

// FERTIG
function hiddenModal() {
  console.log("Modal hidden");
  emit("closedModal");
}

// FERTIG
function loadModal() {
  if (!isEditorOpen.value) {
    loadConfig();
  }
  isEditorOpen.value = false;
  console.log("Modal shown");
}

// TODO analog zu handlePairOk from memory
function handleCompletionTaskOk(data: GraphData) {
  configuration.value.taskList.push(new UmlTask(openedIndex.value, data.graphAsJson, data.graphDescription, TaskType.COMPLETION))
  showCompletionTaskModal.value = false;
  console.log(configuration.value.taskList);
  showModal.value = true;
}

// FERTIG
function handleEditorModalAbort() {
  showModal.value = true;
}

// FERTIG
function resetEditorModal() {
  console.log("Resetting editor modal (@hidden)");
  editObject.value = null;
}

// FERTIG
function setupEditorModal() {
  console.log("setting up editor");
  showModal.value = false;
  isEditorOpen.value = true;
  editorData.value = new GraphData(editObject.value.graphAsJson, editObject.value.graphDescription);
}

// DNF
function downloadConfiguration() {
  /*const { ["id"]: unused, ...clonedConfiguration } = configuration.value;
  const clonedQuestions = Array<ITowerDefenseQuestion>();
  for (let innerQuestion of configuration.value.questions) {
    const { ["id"]: unused, ...clonedQuestion } = innerQuestion;
    clonedQuestions.push(clonedQuestion);
  }
  clonedConfiguration.questions = clonedQuestions;
  const blob = new Blob([JSON.stringify(clonedConfiguration)], {
    type: "text/json",
  });
  saveAs(blob, "towerdefense-configuration.json");*/
}

// DNF
async function importFile(event: any) {
  /*const file = event.target.files[0];
  const validator = object({
    questions: arrayOf(
      object({
        text: string(),
        correctAnswer: string(),
        wrongAnswers: arrayOf(string()),
      })
    ),
    volumeLevel: optional(nullable(int())),
  });
  try {
    const result: TowerDefenseConfiguration = await importConfiguration(
      file,
      validator,
      toast
    );
    configuration.value = result;
  } catch (e) {
    console.log("Import was not successful");
  }*/
}

function testSend() {
  postUmlgameConfig(new UmlgameConfiguration([new UmlTask("1", "", "test", "COMPLETION")]));
}
</script>
<template>
  <b-modal
    title="Edit UML-Game configuration"
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
      <b-button @click="testSend"> TEST </b-button>
      <b-form-group>
        <b-table :fields="fields"  :items="taskList">
          <template #cell(task)="data" >
            Task {{ data.item.id }}:
          </template>

          <template #cell(selection)="">
            <b-form-select v-model="selected" :options="selectionOptions" text="Select an option"  required/>
          </template>

          <template #cell(edit)="data">
            <b-button variant="outline-primary" :key="data.index" @click="onEditClick(selected, data.item)">
              Edit Task
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

  <UmlEditorModal
    :showModal="showCompletionTaskModal"
    modalTitle="Configure the completion task"
    @okModal="handleCompletionTaskOk"
    @cancelModal="handleEditorModalAbort"
    :graphData="editorData"
    @hidden="resetEditorModal"
    @show="setupEditorModal"
  />
</template>
<style scoped>
.questionTable {
  word-wrap: anywhere;
}
</style>
