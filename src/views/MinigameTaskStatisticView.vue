<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import { ITask, Minigame } from "@/ts/models/overworld-models";
import { getMinigame } from "@/ts/rest-clients/minigame-rest-client";
import {
  loadAverageSuccessInPieChart,
  loadHighscoreDistributionInRangeBar,
} from "@/ts/statistics/overworld-statistics";
import { ref, watch, Ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";

const toast = useToast();
const route = useRoute();
const loading = ref(false);
const loadingGeneralStatistics = ref(false);
const loadingMinigameSpecificStatistics = ref(false);
const isEnoughDataForStatistic = ref(true);

const courseId = ref(route.params.courseId as string);
const worldIndex = ref(route.params.worldIndex as string);
const dungeonIndex = ref(route.params.dungeonIndex as string);
const minigameIndex = ref(route.params.minigameIndex as string);

const inFocus = ref(false);

watch(
  () => [
    route.params.courseId,
    route.params.worldIndex,
    route.params.dungeonIndex,
    route.params.minigameIndex,
  ],
  (newVal) => {
    courseId.value = newVal[0] as string;
    worldIndex.value = newVal[1] as string;
    dungeonIndex.value = newVal[2] as string;
    minigameIndex.value = newVal[3] as string;

    loadMinigameStatistic(
      courseId.value,
      worldIndex.value,
      dungeonIndex.value,
      minigameIndex.value
    );
  },
  { deep: true }
);
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

const minigame = ref() as Ref<ITask>;

async function loadMinigameStatistic(
  courseId: any,
  worldIndex: any,
  dungeonIndex: any,
  minigameIndex: any
) {
  loadingGeneralStatistics.value = true;
  console.log("load minigame");
  if (
    isNaN(courseId) ||
    isNaN(worldIndex) ||
    isNaN(minigameIndex) ||
    (dungeonIndex != undefined && isNaN(dungeonIndex))
  ) {
    loading.value = false;
    console.log("one of the ids is NaN");
    return;
  }
  getMinigame(courseId, worldIndex, dungeonIndex, minigameIndex)
    .then(async (response) => {
      const result: ITask = response.data;
      minigame.value = result;
      const promisessToWait = [
        loadAverageSuccessInPieChart(
          courseId,
          worldIndex,
          dungeonIndex,
          minigameIndex,
          successRatePieChart.value
        ),
        loadHighscoreDistributionInRangeBar(
          courseId,
          worldIndex,
          dungeonIndex,
          minigameIndex,
          highscoreDistributionRangeBar.value
        ),
      ];
      await Promise.all(promisessToWait);
    })
    .catch((error) => {
      console.log(error);
      toast.error("There was an error loading the statistics!");
    })
    .finally(() => (loadingGeneralStatistics.value = false));
}

function goBack() {
  router.go(-1);
}

loadMinigameStatistic(
  courseId.value,
  worldIndex.value,
  dungeonIndex.value,
  minigameIndex.value
);

const successRatePieChart = ref({
  options: {
    chart: { type: "pie" },
    title: { text: "Average Success" },
  } as ApexOptions,
  series: [] as Array<number>,
});
const highscoreDistributionRangeBar = ref({
  options: {
    chart: { type: "rangeBar" },
    title: { text: "Highscore Distribution" },
  } as ApexOptions,
  series: [] as Array<{
    data: Array<{ x: string; y: Array<number> }>;
  }>,
});
</script>

<template>
  <b-overlay rounded="sm">
    <div class="container mt-4">
      <h1 v-if="dungeonIndex === undefined">
        Minigame Statistic from Minigame {{ minigameIndex }} in World
        {{ worldIndex }}
      </h1>
      <h1 v-else>
        Minigame Statistic from Minigame {{ minigameIndex }} in World
        {{ worldIndex }}, Dungeon {{ dungeonIndex }}
      </h1>
      <b-alert show dismissible>
        Here, you can see the statistic if the current miningame.</b-alert
      >
      <b-overlay :show="loadingGeneralStatistics" rounded="sm">
        <b-row id="general-statistics" class="container mt-4">
          <h2>General minigame statistics</h2>
          <b-col>
            <apexchart
              width="600"
              :options="successRatePieChart.options"
              :series="successRatePieChart.series"
            ></apexchart
          ></b-col>
          <b-col>
            <apexchart
              width="600"
              :options="highscoreDistributionRangeBar.options"
              :series="highscoreDistributionRangeBar.series"
            ></apexchart>
          </b-col>
        </b-row>
      </b-overlay>
      <b-overlay :show="loadingMinigameSpecificStatistics" rounded="sm">
        <div id="minigame-specific-statistics" class="container mt-4">
          <h2>Minigame specific statistics</h2>
          <b-alert show dismissible>
            Just the same statistic till we display minigame specific
            statistics...</b-alert
          >
          <apexchart
            width="600"
            :options="successRatePieChart.options"
            :series="successRatePieChart.series"
          ></apexchart>
        </div>
      </b-overlay>
      <b-button @click="goBack">Back</b-button>
    </div>
  </b-overlay>
</template>
