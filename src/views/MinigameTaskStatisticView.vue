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

import FiniteQuizStatisticBox from "@/components/MinigameStatisticComponents/FiniteQuizStatisticBox.vue";

const toast = useToast();
const route = useRoute();
const loading = ref(false);
const loadingGeneralStatistics = ref(false);
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
      const promisesToWait = [
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
      await Promise.all(promisesToWait);
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

const successRatePieChart = ref({
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "pie" },
    title: { text: "Average Success" },
  } as ApexOptions,
  series: [] as Array<number>,
});
const highscoreDistributionRangeBar = ref({
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "rangeBar" },
    title: { text: "Highscore Distribution" },
  } as ApexOptions,
  series: [] as Array<{
    data: Array<{ x: string; y: Array<number> }>;
  }>,
});

const statistics = [
  successRatePieChart,
  highscoreDistributionRangeBar,
] as Array<
  Ref<{
    enoughDataToShow: boolean;
    width: number;
    options: ApexOptions;
    series: Array<any>;
  }>
>;

loadMinigameStatistic(
  courseId.value,
  worldIndex.value,
  dungeonIndex.value,
  minigameIndex.value
);
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
      <b-button @click="goBack">Back</b-button>
      <b-overlay :show="loadingGeneralStatistics" rounded="sm">
        <b-row id="general-statistics" class="container mt-4">
          <h2>General minigame statistics</h2>
          <b-col
            v-for="statistic of statistics"
            :key="statistic.value.options.title"
          >
            <b-overlay :show="!statistic.value.enoughDataToShow" rounded="sm">
              <apexchart
                :width="statistic.value.width"
                :options="statistic.value.options"
                :series="statistic.value.series"
              ></apexchart>
              <template #overlay v-if="!loadingGeneralStatistics">
                <h6>Statistic has not enough data to show.</h6>
              </template>
            </b-overlay>
          </b-col>
        </b-row>
      </b-overlay>
      <FiniteQuizStatisticBox
        v-if="minigame?.game == Minigame.FINITEQUIZ"
        :configuration-id="minigame.configurationId"
      />
      <b-alert v-else variant="warning" show dismissible>
        Minigame specific statistics not included yet for this
        minigame.</b-alert
      >
    </div>
  </b-overlay>
</template>
