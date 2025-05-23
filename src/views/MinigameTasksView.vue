<script setup lang="ts">
import { ITask, MapType, Minigame } from "@/ts/models/overworld-models";
import {
  getMinigames,
  putMinigame,
} from "@/ts/rest-clients/minigame-rest-client";
import { defineEmits, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";
import EditMinigameConfigurationModal from "@/components/EditMinigameModals/EditMinigameConfigurationModal.vue";
import EditChickenshockConfigurationModal from "@/components/EditMinigameModals/EditChickenshockConfigurationModal.vue";
import EditFinitequizConfigurationModal from "@/components/EditMinigameModals/EditFinitequizConfigurationModal.vue";
import EditTowercrushConfigurationModal from "@/components/EditMinigameModals/EditTowercrushConfigurationModal.vue";
import EditCrosswordpuzzleModal from "@/components/EditMinigameModals/EditCrosswordpuzzleModal.vue";
import EditMemoryConfigurationModal from "@/components/EditMinigameModals/EditMemoryConfigurationModal.vue";
import EditRegexGameModal from "@/components/EditMinigameModals/EditRegexGameModal.vue";
import EditTowerDefenseConfigurationModal from "@/components/EditMinigameModals/EditTowerDefenseConfigurationModal.vue";
import MapImageModal from "@/components/MapImageModal.vue";
import EditBugfinderConifgurationModal from "@/components/EditMinigameModals/EditBugfinderConfigurationModal.vue";
import router from "@/router";
import { getCourse } from "@/ts/rest-clients/course-rest-client";

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
const showTowercrushModal = ref(false);
const showCrosswordpuzzleModal = ref(false);
const showBugfinderModal = ref(false);
const showMemoryModal = ref(false);
const showRegexGameModal = ref(false);
const showTowerDefenseModal = ref(false);
const courseName = ref<string>("");

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

      result.sort((task1, task2) => task1.index - task2.index);

      minigames.value = result;
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => (loading.value = false));
}

loadMinigames(courseId.value, worldIndex.value, dungeonIndex.value);

/**
 * Fetches the course name based on the provided course ID.
 * Sets the `courseName` variable to the fetched name, or to "Unknown Course" in case of an error.
 *
 * @param courseId - The ID of the course to fetch the name for.
 */
async function fetchCourseName(courseId: number) {
  try {
    const response = await getCourse(courseId);
    courseName.value = response.data.courseName;
  } catch (error) {
    console.error("Failed to fetch course name:", error);
    courseName.value = "Unknown Course";
  }
}

/**
 * Handles changes to the minigame configuration for a specific task.
 * Updates the task's `game` and `configurationId` properties and sends the update to the backend.
 * Also fetches the course name and provides user feedback via a toast notification.
 *
 * @param task - The task object whose minigame settings need to be updated.
 */
function changedMinigame(task: ITask) {
  if (task.game == null) {
    task.game = Minigame.NONE;
  }
  if (task.game == Minigame.NONE) {
    task.configurationId = null;
  }

  fetchCourseName(parseInt(courseId.value));

  putMinigame(
    parseInt(courseId.value),
    parseInt(worldIndex.value),
    parseInt(dungeonIndex.value),
    task
  ).then((response) => {
    task = response.data;
    toast.success(
      `Minigame in ${courseName.value} was updated to ${task.game}! )`
    );
    console.log(
      "Changed minigame to " + task.game + " in course " + courseName.value
    );
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
    case Minigame.TOWERCRUSH:
      showTowercrushModal.value = true;
      break;
    case Minigame.BUGFINDER:
      showBugfinderModal.value = true;
      break;
    case Minigame.MEMORY:
      showMemoryModal.value = true;
      break;
    case Minigame.REGEXGAME:
      showRegexGameModal.value = true;
      break;
    case Minigame.TOWERDEFENSE:
      showTowerDefenseModal.value = true;
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
    toast.success(`Description in task was updated!`);
  });
}

function cancelEditDescription() {
  toast.warning(`Description in task was not updated!`);
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
  showTowercrushModal.value = false;
  showCrosswordpuzzleModal.value = false;
  showBugfinderModal.value = false;
  showMemoryModal.value = false;
  showRegexGameModal.value = false;
  showTowerDefenseModal.value = false;
}

function redirectToStatisticView(task: ITask) {
  if (route.name?.toString().includes("world")) {
    router.push({
      name: "world-minigame-statistics",
      params: {
        courseId: courseId.value,
        worldIndex: worldIndex.value,
        minigameIndex: task.index,
      },
    });
  } else {
    router.push({
      name: "dungeon-minigame-statistics",
      params: {
        courseId: courseId.value,
        worldIndex: worldIndex.value,
        dungeonIndex: dungeonIndex.value,
        minigameIndex: task.index,
      },
    });
  }
}

function openMinigame(task: ITask) {
  const iframe = document.createElement("iframe");
  iframe.src =
    location.origin +
    "/minigames/" +
    task.game.toLowerCase() +
    "/" +
    task.configurationId;
  iframe.style.position = "fixed";
  iframe.style.top = "0";
  iframe.style.left = "0";
  iframe.style.width = "100%";
  iframe.style.height = "100%";
  iframe.style.zIndex = "9999";
  iframe.style.border = "none";
  document.body.appendChild(iframe);
  window.addEventListener("message", (event) => {
    if (event.data === "CLOSE ME") {
      iframe.remove();
    }
  });
}
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <h1 v-if="dungeonIndex === undefined">
        Minigames from World {{ worldIndex }}
      </h1>
      <h1 v-else>
        Minigames from World {{ worldIndex }}, Dungeon {{ dungeonIndex }}
      </h1>
      <b-alert show dismissible>
        Here, you can see all minigames present in this area.<br />
        In these minigame tasks, you can (for example) check your players
        knowledge.<br />
        Select any minigame of your choice and click 'Edit' to configure the
        minigame.<br />
        To find out where which minigame is, click on 'Show map'.</b-alert
      >
      <b-button @click="showMapModal = true">Show map</b-button>

      <b-card v-for="task in minigames" :key="task.id" class="mt-1">
        <b-row>
          <b-col sm="1">{{ task.index }}</b-col>
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
          <b-col sm="3" class="d-flex gap-4 align-items-center">
            <b-button
              variant="info"
              size="small"
              @click="editMinigameConfiguration(task)"
              :id="`editMinigameButton` + task.index"
            >
              <em class="bi bi-pencil-square"></em>
              Edit
            </b-button>
            <b-button
              variant="warning"
              size="small"
              @click="redirectToStatisticView(task)"
              :id="`redirectToStatistics` + task.index"
            >
              <em class="bi bi-graph-up"></em>
            </b-button>
            <b-button
              variant="success"
              size="small"
              @click="openMinigame(task)"
              :id="`redirectToStatistics` + task.index"
            >
              <em class="bi bi-play"></em>
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
  <EditTowercrushConfigurationModal
    :showModal="showTowercrushModal"
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
  <EditBugfinderConifgurationModal
    :showModal="showBugfinderModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditMemoryConfigurationModal
    :showModal="showMemoryModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditRegexGameModal
    :showModal="showRegexGameModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
  <EditTowerDefenseConfigurationModal
    :showModal="showTowerDefenseModal"
    :minigame="editedMinigame"
    @updateMinigameConfiguration="updateMinigameConfiguration"
    @closedModal="closedEditModal"
  />
</template>
