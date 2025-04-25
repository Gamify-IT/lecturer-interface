<script setup lang="ts">
import { defineEmits, defineProps, ref, watch, Ref } from "vue";
import { TaskType, UmlgameConfiguration, UmlTask, GraphData } from "@/ts/models/umlgame-models";
import { useToast } from "vue-toastification";
import { useRoute } from "vue-router";
import { ITask } from "@/ts/models/overworld-models";
import ImportExportConfiguration from "@/components/ImportExportConfiguration.vue";
import { BFormSelect, BTable } from "bootstrap-vue-3";
import { putMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { putUmlgameConfig } from "@/ts/rest-clients/umlgame-rest-client";
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
const oldMinigame = ref();
// TODO: adapt to available modes
const taskText = ref();
const selected = null;
const editorData = ref() as Ref<GraphData>;
// Here are the parameters you need to adapt when expanding the game
const selectionOptions = [{value: TaskType.COMPLETION, text:'Completion'}, {value: TaskType.ERRORHUNT, text:'Error hunt'},
  {value: TaskType.CODETOUML, text:'Code -> UML'}, {value: TaskType.UMLTOCODE, text:'UML -> Code'}];
const numberOfQuestions = 42;

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
  //TODO
  if (minigame.value.configurationId != undefined) {
    /*getTowerDefenseConfig(minigame.value.configurationId)
      .then((response) => {
        configuration.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status == 404) {
          minigame.value.configurationId = undefined;
          configuration.value.questions = [];
        }
      });*/
    oldMinigame.value = minigame.value;
  } else {
    oldMinigame.value = minigame.value;
  }
  console.log("Reset Modal");
}
const openedIndex = ref();
function onEditClick(type: TaskType, index: number) {
  // TODO: editObject.value = edit;
  openedIndex.value = index;
  switch (type) {
    case TaskType.COMPLETION: showCompletionTaskModal.value = true; break;
    case TaskType.ERRORHUNT: showErrorhuntTaskModal.value = true; break;
  }
}

function handleOk() {
  //TODO
  console.log("putting")
  putUmlgameConfig(configuration.value)
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
  if (!showCompletionTaskModal.value) {
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

function handleCompletionTaskOk(data: GraphData) {
  //TODO id
  //console.log(editorData) // TODO no data
  configuration.value.taskList.push(new UmlTask(openedIndex.value, data.graphAsJson, data.graphDescription, TaskType.COMPLETION))
  //toast.info(.value.graphDescription);
  showCompletionTaskModal.value = false;
  console.log(configuration.value.taskList);
  showModal.value = true;
}

function handleErrorhuntTaskOk() {
  //TODO
  configuration.value.taskList.push(new UmlTask(openedIndex.value, null, taskText.value, TaskType.COMPLETION))
  toast.warning(taskText.value);
  showModal.value = true;
}

function handleTaskModalAbort() {
  showModal.value = true;
}

function resetTaskModal() {
  // TODO
  //configuration.value.taskList = [];
  taskText.value = "";
}

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
        <b-table :fields="fields"  :items="['1', '2', '3', '4', '5', '6', '7', '8']">
          <template #cell(task)="data" >
            Task {{ data.item }}:
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
    @cancelModal="handleTaskModalAbort"
    :graphData="editorData"
  />

  <UmlEditorModal
    :showModal="showErrorhuntTaskModal"
    modalTitle="Configure the error-hunt task"
    @okModal="showErrorhuntTaskModal = false"
  />

</template>
<style scoped>
.questionTable {
  word-wrap: anywhere;
}
</style>
