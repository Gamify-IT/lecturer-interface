<script setup lang="ts">
import { defineEmits, defineProps, ref, Ref, watch } from "vue";
import {
  GraphData,
  TaskType,
  UmlgameConfiguration,
  UmlTask,
} from "@/ts/models/umlgame-models";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { ITask } from "@/ts/models/overworld-models";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";
import { BFormSelect, BTable } from "bootstrap-vue-3";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import {
  getUmlgameConfig,
  postUmlgameConfig,
  putUmlgameConfig,
} from "@/ts/rest-clients/umlgame-rest-client";
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
const oldMinigame = ref();
// v models for different task edit modals
const showCompletionTaskModal = ref(false);
const showErrorhuntTaskModal = ref(false);
const isEditorOpen = ref(false);

const taskList = ref([]) as Ref<UmlTask[]>;
initializeTasks();

// TODO: adapt to available modes
const openedIndex = ref();
const editorData = ref() as Ref<GraphData>;
const editObject = ref();

// Here are the parameters you need to adapt when expanding the game
const selectionOptions = [
  { value: TaskType.COMPLETION, text: "Completion" },
  { value: TaskType.ERRORHUNT, text: "Error hunt" },
  { value: TaskType.CODETOUML, text: "Code -> UML" },
  { value: TaskType.UMLTOCODE, text: "UML -> Code" },
];
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

function checkFormValidity(): boolean {
  return form.value.checkValidity();
}

function resetModal() {
  if (minigame.value.configurationId != undefined) {
    /*getUmlgameConfig(minigame.value.configurationId)
      .then((response) => {
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          minigame.value.configurationId = undefined;
          configuration.value.taskList = [];
          initializeTasks();
        }
      });*/
    console.log("GETTING UML CONFIG:" + minigame.value.configurationId);
    oldMinigame.value = minigame.value;
  } else {
    configuration.value.id = undefined;
    configuration.value.taskList = [];
    oldMinigame.value = minigame.value;
    initializeTasks();
  }
  console.log("Reset Modal");
}

function handleOk() {
  console.log("@ok");
  const updateConfigurationRequest = configuration.value.id
    ? /*putUmlgameConfig(configuration.value.id, new UmlgameConfiguration(taskList.value))*/ console.log(
        "PUTTING UML CONFIG: " +
          configuration.value.id +
          " Config: " +
          new UmlgameConfiguration(taskList.value)
      )
    : /*postUmlgameConfig(new UmlgameConfiguration(taskList.value))*/ console.log(
        "POSTING UML CONFIG: " + new UmlgameConfiguration(taskList.value)
      );
  /*updateConfigurationRequest.then((response) => {
      minigame.value.configurationId = response.data.id;
      console.log("Submit Modal");
      console.log("id:" + response.data.id);
      console.log("minigameId" + minigame.value.configurationId);
      oldMinigame.value = minigame.value;
      handleSubmit();
    }).then(() => {
      putMinigame(
        parseInt(courseId.value),
        parseInt(worldIndex.value),
        parseInt(dungeonIndex.value),
        minigame.value
      );}).catch((error) => {
      const statusCode = error.response.status;
      const errorMessages = error.response.data.errors;
      if (statusCode == 400) {
        for (let errorMessage of errorMessages) {
          toast.error("Error while saving configuration: " + errorMessage);
        }
      } else {
        toast.error("There was an error saving the configuration!");
      }
    }).finally(() => {
    initializeTasks();
    });*/
}

function handleSubmit() {
  // Exit when the form isn't valid
  console.log("handleSubmit");
  if (!checkFormValidity()) {
    return;
  }
  emit("updateMinigameConfiguration", minigame.value);
}

function hiddenModal() {
  if (!isEditorOpen.value) {
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

function initializeTasks() {
  console.log("initializeTasks()");
  taskList.value = [];
  for (let index = 0; index < numberOfQuestions; index++) {
    if (index == 0) {
      taskList.value.push(
        new UmlTask((index + 1).toString(), "", "blabla", TaskType.COMPLETION)
      );
    } else {
      taskList.value.push(
        new UmlTask((index + 1).toString(), "", "", TaskType.COMPLETION)
      );
    }
  }
  console.log(taskList);
}

function onEditClick(task: UmlTask) {
  console.log("onEditClick");
  let type = task.taskType;
  editObject.value = task;
  openedIndex.value = task.id;
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

function handleCompletionTaskOk(data: GraphData) {
  configuration.value.taskList.push(
    new UmlTask(
      openedIndex.value,
      data.graphAsJson,
      data.graphDescription,
      TaskType.COMPLETION
    )
  );
  showCompletionTaskModal.value = false;
  console.log(configuration.value.taskList);
  showModal.value = true;
}

function handleEditorModalAbort() {
  showModal.value = true;
}

function resetEditorModal() {
  console.log("Resetting editor modal (@hidden)");
  editObject.value = null;
}

function setupEditorModal() {
  console.log("setting up editor");
  showModal.value = false;
  isEditorOpen.value = true;
  editorData.value = new GraphData(
    editObject.value.graph,
    editObject.value.text
  );
}
</script>
<template>
  <b-modal
    title="Edit UML-Game configuration"
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
        <b-table :fields="fields" :items="taskList">
          <template #cell(task)="data"> Task {{ data.item.id }}: </template>

          <template #cell(selection)="data">
            <b-form-select
              v-model="data.item.taskType"
              :options="selectionOptions"
              text="Select an option"
              required
            />
          </template>

          <template #cell(edit)="data">
            <b-button
              variant="outline-primary"
              :key="data.index"
              @click="onEditClick(data.item)"
            >
              Edit Task
            </b-button>
          </template>
        </b-table>
      </b-form-group>
    </form>
  </b-modal>

  <UmlEditorModal
    :showModal="showCompletionTaskModal"
    modalTitle="Configure the completion task"
    @hidden="resetEditorModal"
    @show="setupEditorModal"
    @okModal="handleCompletionTaskOk"
    @cancelModal="handleEditorModalAbort"
    :graphData="editorData"
  />
</template>
<style scoped>
.questionTable {
  word-wrap: anywhere;
}
</style>
