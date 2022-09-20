<script setup lang="ts">
import { IDungeon, MapType } from "@/ts/models/overworld-models";
import { getWorld } from "@/ts/rest-clients/world-rest-client";
import { defineEmits, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AreaBox from "../components/WorldComponents/AreaBox.vue";
import { useToast } from "vue-toastification";
import MapImageModal from "@/components/MapImageModal.vue";

useToast();
const route = useRoute();
const loading = ref(false);
const courseId = ref(parseInt(route.params.courseId as string));
const worldIndex = ref(parseInt(route.params.worldIndex as string));
const world = ref();
const errorText = ref();
const inFocus = ref(false);
const editTopicName = ref(true);
const firstFocus = ref(false);
const currentAreaId = ref(0);

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
    editTopicName.value = true;
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
  if (inFocus.value && editTopicName.value) {
    emit("return");
    console.log("left");
    firstFocus.value = false;
    document
      .getElementsByClassName("b-form-checkbox-area-box")
      .item(currentAreaId.value)
      ?.focus();
  } else {
    editTopicName.value = true;
    document
      .getElementsByClassName("btn-light")
      .item(currentAreaId.value)
      ?.focus();
  }
}

function clickRight() {
  if (inFocus.value) {
    console.log("right");
    if (editTopicName.value && firstFocus.value) {
      editTopicName.value = false;
      document
        .getElementsByClassName("b-form-checkbox-area-box")
        .item(currentAreaId.value)
        ?.focus();
    } else {
      document
        .getElementsByClassName("btn-light")
        .item(currentAreaId.value)
        ?.focus();
    }
    firstFocus.value = true;
  }
}

function clickUp() {
  if (inFocus.value) {
    console.log("up");
    if (editTopicName.value) {
      let elements = document.getElementsByClassName("btn-light");
      if (currentAreaId.value > 0) {
        currentAreaId.value--;
        elements.item(currentAreaId.value)?.focus();
      } else {
        currentAreaId.value = elements.length - 1;
        elements.item(currentAreaId.value)?.focus();
      }
    } else {
      let elements = document.getElementsByClassName(
        "b-form-checkbox-area-box"
      );
      if (currentAreaId.value > 0) {
        currentAreaId.value--;
        elements.item(currentAreaId.value)?.focus();
      } else {
        currentAreaId.value = elements.length - 1;
        elements.item(currentAreaId.value)?.focus();
      }
    }
  }
}

function clickDown() {
  if (inFocus.value) {
    console.log("down");
    if (editTopicName.value) {
      let elements = document.getElementsByClassName("btn-light");
      if (currentAreaId.value < elements.length - 1) {
        currentAreaId.value++;
        elements.item(currentAreaId.value)?.focus();
      } else {
        currentAreaId.value = 0;
        elements.item(currentAreaId.value)?.focus();
      }
    } else {
      let elements = document.getElementsByClassName(
        "b-form-checkbox-area-box"
      );
      if (currentAreaId.value < elements.length - 1) {
        currentAreaId.value++;
        elements.item(currentAreaId.value)?.focus();
      } else {
        currentAreaId.value = 0;
        elements.item(currentAreaId.value)?.focus();
      }
    }
  }
}

const showMapModal = ref(false);

loadSelectedWorld(courseId.value, worldIndex.value);

function loadSelectedWorld(
  selectedCourseId: number,
  selectedWorldIndex: number
) {
  loading.value = true;
  getWorld(selectedCourseId, selectedWorldIndex)
    .then((response) => {
      world.value = response.data;
      world.value.dungeons = world.value.dungeons.sort(
        (dungeon1: IDungeon, dungeon2: IDungeon) =>
          dungeon1.index > dungeon2.index
      );
      console.log("Loaded selected world " + selectedWorldIndex);
    })
    .catch((error) => {
      console.log(error);
      errorText.value =
        "World in course " +
        courseId.value +
        " with index " +
        worldIndex.value +
        " not found;";
    })
    .finally(() => (loading.value = false));
}

watch(
  () => [route.params.courseId, route.params.worldIndex],
  (newVal) => {
    courseId.value = parseInt(newVal[0] as string);
    worldIndex.value = parseInt(newVal[1] as string);
    loadSelectedWorld(courseId.value, worldIndex.value);
  },
  { deep: true }
);
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
    <div v-if="world !== undefined" class="container mt-5">
      <h2>Configure World {{ world.index }}</h2>
      <b-alert show>
        Here, you can see world {{ world.index }} together with all its dungeons.<br />
        The dungeons can be accessed (if enabled) at certain points in the world, see the dungeon spots map.
        You can give the areas a topic name, based on what content you intend to place there.
      </b-alert>
      <h4>{{ world.staticName }}</h4>
      <b-button @click="showMapModal = true">Show Map</b-button>
      <div style="margin-top: 30px">
        <b-table-simple>
          <b-thead head-variant="dark">
            <b-tr>
              <b-th>Static-Name</b-th>
              <b-th>Topic-Name</b-th>
              <b-th>Active</b-th>
            </b-tr>
          </b-thead>
          <b-tbody>
            <b-tr>
              <AreaBox
                :area="world"
                :courseId="courseId"
                :worldIndex="world.index"
                :dungeonIndex="0"
              />
            </b-tr>
            <b-tr v-for="dungeon in world.dungeons" :key="dungeon.id">
              <AreaBox
                :area="dungeon"
                :courseId="courseId"
                :worldIndex="world.index"
                :dungeonIndex="dungeon.index"
              />
            </b-tr>
          </b-tbody>
        </b-table-simple>
      </div>
    </div>
    <div v-if="errorText" class="container mt-5 error">
      <div
        class="alert alert-danger alert-dismissible d-flex align-items-center fade show"
      >
        <em class="bi-exclamation-octagon-fill"></em>
        <strong class="mx-2">Error!</strong>
        {{ errorText }}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
        ></button>
      </div>
    </div>
  </b-overlay>
  <MapImageModal
    :worldIndex="worldIndex"
    :dungeonIndex="undefined"
    :showModal="showMapModal"
    modalTitle="Dungeon spots"
    :mapType="MapType.DUNGEON"
    @closedModal="showMapModal = false"
  />
</template>
