<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import { ITask, Minigame, MapType } from "@/ts/models/overworld-models";
import { getMinigame } from "@/ts/rest-clients/minigame-rest-client";
import { getSuccessRateStatistic } from "@/ts/rest-clients/minigame-statistics-rest-client";
import { defineEmits, ref, watch, Ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "vue-toastification";
import router from "@/router";

const toast = useToast();
const route = useRoute();
const loading = ref(false);
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
  loading.value = true;
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
        loadAverageSuccessChart(
          courseId,
          worldIndex,
          dungeonIndex,
          minigameIndex
        ),
      ];
      await Promise.all(promisessToWait);
    })
    .catch((error) => {
      console.log(error);
      toast.error("There was an error loading the statistics!");
    })
    .finally(() => (loading.value = false));
}

async function loadAverageSuccessChart(
  courseId: any,
  worldIndex: any,
  dungeonIndex: any,
  minigameIndex: any
) {
  return getSuccessRateStatistic(
    courseId,
    worldIndex,
    dungeonIndex,
    minigameIndex
  ).then((response) => {
    const result = response.data;
    const sumSuccessAt = 5;
    let successHigherThanSuccessAt = 0;
    let fails = 0;
    let series = [] as Array<number>;
    let labels = [] as Array<string>;
    const greenColor = "#00FF00";
    const redColor = "#FF0000";
    let colors = [] as Array<string>;
    for (let key in result.successRateDistribution) {
      if (key < sumSuccessAt) {
        series = [...series, result.successRateDistribution[key]];
        labels = [...labels, `Beim ${key}. Versuch bestanden`];
        colors = [...colors, greenColor];
      } else {
        successHigherThanSuccessAt += result.successRateDistribution[key];
      }
    }
    if (successHigherThanSuccessAt > 0) {
      series = [...series, successHigherThanSuccessAt];
      labels = [...labels, `Bei ${sumSuccessAt}+. Versuch bestanden`];
      colors = [...colors, greenColor];
    }
    for (let key in result.failureRateDistribution) {
      fails += result.failureRateDistribution[key];
    }
    series = [...series, fails];
    labels = [...labels, `Nicht bestanden`];
    colors = [...colors, redColor];

    successRatePieChart.value.series = series;
    successRatePieChart.value.options = {
      ...successRatePieChart.value.options,
      ...{
        title: { text: "Average Success" },
        labels: labels,
        colors: colors,
      },
    };
  });
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
</script>

<template>
  <b-overlay :show="loading" rounded="sm">
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
      <apexchart
        width="600"
        :options="successRatePieChart.options"
        :series="successRatePieChart.series"
      ></apexchart>
      <b-button @click="goBack">Back</b-button>
    </div>
  </b-overlay>
</template>
