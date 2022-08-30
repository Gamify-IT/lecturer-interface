<script setup lang="ts">
import { ITask, Minigame, MapType } from "@/ts/models";
import { getMinigames, putMinigame } from "@/ts/minigame-rest-client";
import { defineEmits, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";
import EditMinigameConfigurationModal from "@/components/EditMinigameConfigurationModal.vue";
import EditChickenshockConfigurationModal from "@/components/EditChickenshockConfigurationModal.vue";
import EditFinitequizConfigurationModal from "@/components/EditFinitequizConfigurationModal.vue";
import EditCrosswordpuzzleModal from "@/components/EditCrosswordpuzzleModal.vue";
import MapImageModal from "@/components/MapImageModal.vue";

const availableMinigames = Object.values(Minigame);

const toast = useToast();
const route = useRoute();
const loading = ref(false);
const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);

const showMapModal = ref(false);

const editedMinigame = ref();
const showEditModal = ref(false);
const showChickenshockModal = ref(false);
const editMinigameTask = ref(false);
const editDescription = ref(false);
const currentMinigameId = ref(1);
const inFocus = ref(false);
const firstFocus = ref(false);
const showFinitequizModal = ref(false);
const showCrosswordpuzzleModal = ref(false);

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
    loadMinigames(courseId.value, worldIndex.value, dungeonIndex.value);
  },
  { deep: true }
);

const emit = defineEmits<{
  (e: "return"): void;
}>();

const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
  leftClicked: Boolean,
  rightClicked: Boolean,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
  },
  { deep: true }
);

watch(
  () => props.upClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickUp();
    }
  },
  { deep: true }
);

watch(
  () => props.downClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickDown();
    }
  },
  { deep: true }
);

watch(
  () => props.leftClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickLeft();
    }
  },
  { deep: true }
);

watch(
  () => props.rightClicked,
  (newBoolean) => {
    if (newBoolean) {
      clickRight();
    }
  },
  { deep: true }
);

function clickLeft() {
  if (inFocus.value) {
    if (editDescription.value) {
      editDescription.value = false;
      firstFocus.value = false;
      emit("return");
      console.log("left");
    } else if (editMinigameTask.value) {
      editMinigameTask.value = false;
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentMinigameId.value - 1)
        ?.focus();
    } else {
      editMinigameTask.value = true;
      document
        .getElementById("minigameSelect" + currentMinigameId.value)
        ?.focus();
    }
  }
}

function clickRight() {
  if (inFocus.value) {
    console.log("right");
    if (editDescription.value) {
      console.log("Zwei");
      editDescription.value = false;
      editMinigameTask.value = true;
      document
        .getElementById("minigameSelect" + currentMinigameId.value)
        ?.focus();
    } else if (editMinigameTask.value) {
      console.log("Drei");
      editMinigameTask.value = false;
      document
        .getElementById("editMinigameButton" + currentMinigameId.value)
        ?.focus();
      console.log("test");
    } else if (!firstFocus.value) {
      firstFocus.value = true;
      console.log("Eins");
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentMinigameId.value - 1)
        ?.focus();
    }
  }
}

function clickUp() {
  if (inFocus.value) {
    console.log("up");
    if (currentMinigameId.value > 1) {
      currentMinigameId.value--;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentMinigameId.value - 1)
          ?.focus();
      } else if (editMinigameTask.value) {
        document
          .getElementById("minigameSelect" + currentMinigameId.value)
          ?.focus();
      } else {
        document
          .getElementById("editMinigameButton" + currentMinigameId.value)
          ?.focus();
      }
    } else {
      currentMinigameId.value = minigames.value.length;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentMinigameId.value - 1)
          ?.focus();
      } else if (editMinigameTask.value) {
        document
          .getElementById("minigameSelect" + currentMinigameId.value)
          ?.focus();
      } else {
        document
          .getElementById("editMinigameButton" + currentMinigameId.value)
          ?.focus();
      }
    }
  }
}

function clickDown() {
  if (inFocus.value) {
    console.log("down");
    if (currentMinigameId.value < minigames.value.length) {
      currentMinigameId.value++;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentMinigameId.value - 1)
          ?.focus();
      } else if (editMinigameTask.value) {
        document
          .getElementById("minigameSelect" + currentMinigameId.value)
          ?.focus();
      } else {
        document
          .getElementById("editMinigameButton" + currentMinigameId.value)
          ?.focus();
      }
    } else {
      currentMinigameId.value = 1;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentMinigameId.value - 1)
          ?.focus();
      } else if (editMinigameTask.value) {
        document
          .getElementById("minigameSelect" + currentMinigameId.value)
          ?.focus();
      } else {
        document
          .getElementById("editMinigameButton" + currentMinigameId.value)
          ?.focus();
      }
    }
  }
}

const minigames = ref(Array<ITask>());

async function loadMinigames(
  courseId: any,
  worldIndex: any,
  dungeonIndex: any
) {
  loading.value = true;
  console.log("load minigames");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    (dungeonIndex != undefined && isNaN(dungeonIndex))
  ) {
    loading.value = false;
    console.log("one of the ids is NaN");
    return;
  }
  getMinigames(courseId, worldIndex, dungeonIndex)
    .then((response) => {
      const result: ITask[] = response.data;
      minigames.value = result.sort(
        (task1, task2) => task1.index - task2.index
      );
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => (loading.value = false));
}

loadMinigames(courseId.value, worldIndex.value, dungeonIndex.value);

function changedMinigame(task: ITask) {
  if (task.game == null) {
    task.game = Minigame.NONE;
  }
  if (task.game == Minigame.NONE) {
    task.configurationId = null;
  }
  putMinigame(
    parseInt(courseId.value),
    parseInt(worldIndex.value),
    parseInt(dungeonIndex.value),
    task
  ).then((response) => {
    task = response.data;
    toast.success(`Minigame in Task was updated to ${task.game}!`);
    console.log("Changed minigame to " + task.game);
  });
}

function editMinigameConfiguration(task: ITask) {
  editedMinigame.value = task;
  console.log("Want to edit minigame " + task.id);
  switch (task.game) {
    case Minigame.NONE:
      showEditModal.value = true;
      break;
    case Minigame.CHICKENSHOCK:
      showChickenshockModal.value = true;
      break;
    case Minigame.CROSSWORDPUZZLE:
      showCrosswordpuzzleModal.value = true;
      break;
    case Minigame.FINITEQUIZ:
      showFinitequizModal.value = true;
      break;
    default:
      console.log(
        "This minigame is currently not supported to be edited here."
      );
      break;
  }
}

function saveDescription(task: ITask, description: string) {
  task.description = description;
  putMinigame(
    parseInt(courseId.value),
    parseInt(worldIndex.value),
    parseInt(dungeonIndex.value),
    task
  ).then((response) => {
    task = response.data;
    toast.success(`Description in Task was updated!`);
  });
}

function cancelEditDescription() {
  toast.warning(`Description in Task was not updated!`);
}

function updateMinigameConfiguration(task: ITask) {
  console.log("Pressed submit button in configuration modal");
  toast.success(`Configuration of minigame ${task.index} was saved!`);
}

function closedEditModal() {
  console.log("Parent got info that modal was closed");
  console.log(editedMinigame.value.id);
  showEditModal.value = false;
  showChickenshockModal.value = false;
  showFinitequizModal.value = false;
  showCrosswordpuzzleModal.value = false;
}
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <h1 v-if="dungeonIndex === undefined">
        Minigames from World {{ worldIndex }}
      </h1>
      <h1 v-else>
        Minigames from World World {{ worldIndex }}, Dungeon {{ dungeonIndex }}
      </h1>
      <b-button @click="showMapModal = true">Show Map</b-button>

      <b-card v-for="task in minigames" :key="task.id" class="mt-1">
        <b-row>
          <b-col sm="2">{{ task.index }}</b-col>
          <b-col sm="5">
            <EditableStringAttribute
              prefix="Description"
              :value="task.description"
              @submit="
                (newDescription) => saveDescription(task, newDescription)
              "
              @cancel="cancelEditDescription"
            />
          </b-col>
          <b-col sm="3">
            <b-form-select
              v-model="task.game"
              :options="availableMinigames"
              @input="changedMinigame(task)"
              :id="`minigameSelect` + task.index"
              @keydown.up.prevent
              @keydown.down.prevent
              @keydown.right.prevent
              @keydown.left.prevent
            ></b-form-select>
          </b-col>
          <b-col sm="2">
            <b-button
              variant="info"
              size="small"
              @click="editMinigameConfiguration(task)"
              :id="`editMinigameButton` + task.index"
            >
              <em class="bi bi-pencil-square"></em>
              Edit
            </b-button>
          </b-col>
        </b-row>
      </b-card>
    </div>
  </b-overlay>
  <MapImageModal
    :worldIndex="worldIndex"
    :dungeonIndex="dungeonIndex"
    :showModal="showMapModal"
    modalTitle="Minigame spots"
    :mapType="MapType.MINIGAME"
    @closedModal="showMapModal = false"
  />
  <EditMinigameConfigurationModal
    :showModal="showEditModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditChickenshockConfigurationModal
    :showModal="showChickenshockModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditFinitequizConfigurationModal
    :showModal="showFinitequizModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditCrosswordpuzzleModal
    :showModal="showCrosswordpuzzleModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
</template>
