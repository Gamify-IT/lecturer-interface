<script setup lang="ts">
import { INPC, IWorld, MapType } from "@/ts/models/overworld-models";
import { putNPC } from "@/ts/rest-clients/npc-rest-client";
import { defineEmits, Ref, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import EditableStringAttribute from "@/components/EditableStringAttribute.vue";
import NPCEditModal from "@/components/EditNPCModal.vue";
import { getArea } from "@/ts/rest-clients/area-rest-client";
import MapImageModal from "@/components/MapImageModal.vue";

const toast = useToast();
const route = useRoute();
const loading = ref(false);
const courseId = ref(route.params.courseId);
const worldIndex = ref(route.params.worldIndex);
const dungeonIndex = ref(route.params.dungeonIndex);

const showMapModal = ref(false);

const editedNPC = ref() as Ref<INPC>;
const showEditModal = ref(false);
const currentNPCId = ref(1);
const editDescription = ref(false);
const firstFocus = ref(false);
const inFocus = ref(false);

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0];
    worldIndex.value = newVal[1];
    dungeonIndex.value = newVal[2];
    loadNPCs(courseId.value, worldIndex.value, dungeonIndex.value);
  },
  { deep: true }
);

const npcs = ref(Array<INPC>());

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
    } else {
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentNPCId.value - 1)
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
      document.getElementById("editButton" + currentNPCId.value)?.focus();
    } else if (!firstFocus.value) {
      firstFocus.value = true;
      console.log("Eins");
      editDescription.value = true;
      document
        .getElementsByClassName("btn-light")
        .item(currentNPCId.value - 1)
        ?.focus();
    }
  }
}

function clickUp() {
  if (inFocus.value) {
    console.log("up");
    if (currentNPCId.value > 1) {
      currentNPCId.value--;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    } else {
      currentNPCId.value = npcs.value.length;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    }
  }
}

function clickDown() {
  if (inFocus.value) {
    console.log("down");
    if (currentNPCId.value < npcs.value.length) {
      currentNPCId.value++;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    } else {
      currentNPCId.value = 1;
      if (editDescription.value) {
        document
          .getElementsByClassName("btn-light")
          .item(currentNPCId.value - 1)
          ?.focus();
      } else {
        document.getElementById("editButton" + currentNPCId.value)?.focus();
      }
    }
  }
}

async function loadNPCs(courseId: any, worldIndex: any, dungeonIndex: any) {
  loading.value = true;
  console.log("load npcs");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    (dungeonIndex != undefined && isNaN(dungeonIndex))
  ) {
    console.log("one of the ids is NaN");
    loading.value = false;
    return;
  }
  getArea(courseId, worldIndex, dungeonIndex)
    .then((response) => {
      const result: IWorld = response.data;
      result.npcs.sort((npc1, npc2) => npc1.index - npc2.index);
      npcs.value = result.npcs;
      console.log(npcs.value);
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => (loading.value = false));
}

loadNPCs(courseId.value, worldIndex.value, dungeonIndex.value);

function editNPC(npc: INPC) {
  editedNPC.value = npc;
  console.log("Want to edit NPC " + npc.id);
  showEditModal.value = true;
}

function updateNPC(npc: INPC) {
  console.log("Pressed submit button in npc configuration modal");
  putNPC(courseId.value, worldIndex.value, dungeonIndex.value, npc.index, npc)
    .then(() => {
      toast.success(`NPC with index ${npc.index} was updated!`);
    })
    .catch(() => {
      toast.error(`NPC with index ${npc.index} could not be updated!`);
    });
}

function saveDescription(npc: INPC, description: string) {
  npc.description = description;
  putNPC(courseId.value, worldIndex.value, dungeonIndex.value, npc.index, npc)
    .then(() => {
      toast.success(`Description of NPC with index ${npc.index} was updated!`);
    })
    .catch(() => {
      toast.error(
        `Description of NPC with index ${npc.index} could not be updated!`
      );
    });
}

function cancelEditDescription() {
  toast.warning(`Description of NPC was not updated!`);
}

function closedEditModal() {
  console.log("Parent got info that modal was closed");
  showEditModal.value = false;
}
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div class="container mt-4">
      <h1 v-if="dungeonIndex === undefined">
        NPCs from World {{ worldIndex }}
      </h1>
      <h1 v-else>
        NPCs from World {{ worldIndex }}, Dungeon {{ dungeonIndex }}
      </h1>
      <b-alert show dismissible>
        Here, you can see all NPCs present in this area.<br />
        NPCs can give the player hints about the course or some other
        information.<br />
        To give an NPC some text to say, click on 'Edit'.
        <br />
        To find out where which NPC is, click on 'Show map'.</b-alert
      >
      <b-button @click="showMapModal = true">Show map</b-button>
      <b-card v-for="npc in npcs" :key="npc.id" class="mt-1">
        <b-row>
          <b-col sm="2">{{ npc.index }}</b-col>
          <b-col>
            <EditableStringAttribute
              prefix="Description"
              :value="npc.description"
              @submit="(newDescription) => saveDescription(npc, newDescription)"
              @cancel="cancelEditDescription"
            />
          </b-col>
          <b-col sm="2">
            <b-button
              variant="info"
              size="small"
              :id="`editButton` + npc.index"
              @click="editNPC(npc)"
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
    modalTitle="NPC spots"
    :mapType="MapType.NPC"
    @closedModal="showMapModal = false"
  />
  <NPCEditModal
    :showModal="showEditModal"
    :npc="editedNPC"
    @updateNPC="updateNPC"
    @closedModal="closedEditModal"
  />
</template>
