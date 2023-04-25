<script setup lang="ts">
import {
  loadTotalPlayerStatistic,
  loadActivePlayerStatistic,
  loadPlayerUnlockedAreaStatistic,
  loadPlayerCompletedMinigameStatistic,
} from "@/ts/statistics/course-statistics";
import { LineChart, ChartToShow } from "@/ts/models/statistic-models";
import { defineProps, ref, watch } from "vue";

const loadingStatistics = ref(false);

const inFocus = ref(false);

watch(
  () => props.courseId,
  () => {
    loadCourseStatistics();
  },
  { deep: true }
);
const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
  leftClicked: Boolean,
  rightClicked: Boolean,
  courseId: Number,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
  },
  { deep: true }
);

async function loadCourseStatistics() {
  if (!props.courseId) {
    statistics.forEach((statistic) => (statistic.enoughDataToShow = false));
    throw new Error("Course ID must be present when loading course statistics");
  }
  loadingStatistics.value = true;
  const promisesToWait = [
    loadTotalPlayerStatistic(props.courseId, totalPlayerLineChart),
    loadActivePlayerStatistic(props.courseId, activePlayerLineChart),
    loadPlayerUnlockedAreaStatistic(
      props.courseId,
      playerUnlockedAreaLineChart
    ),
    loadPlayerCompletedMinigameStatistic(
      props.courseId,
      playerCompletedMinigamesLineChart
    ),
  ];
  await Promise.all(promisesToWait);
  loadingStatistics.value = false;
}

const totalPlayerLineChart: LineChart = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "line" },
    title: { text: "Total players" },
  },
  series: [] as Array<number>,
};

const activePlayerLineChart: LineChart = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "line" },
    title: { text: "Active players" },
  },
  series: [],
};

const playerUnlockedAreaLineChart: LineChart = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "line" },
    title: { text: "Player unlocked areas" },
  },
  series: [],
};

const playerCompletedMinigamesLineChart: LineChart = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "line" },
    title: { text: "Player completed minigames" },
  },
  series: [],
};

const statistics = [
  totalPlayerLineChart,
  activePlayerLineChart,
  playerUnlockedAreaLineChart,
  playerCompletedMinigamesLineChart,
] as Array<ChartToShow>;

loadCourseStatistics();
</script>

<template>
  <b-overlay :show="loadingStatistics" rounded="sm">
    <b-row id="minigame-specific-statistics" class="container mt-4">
      <h2>Course statistics</h2>
      <b-col v-for="statistic of statistics" :key="statistic.options.title">
        <b-overlay :show="!statistic.enoughDataToShow" rounded="sm">
          <apexchart
            :width="statistic.width"
            :options="statistic.options"
            :series="statistic.series"
          ></apexchart>
          <template #overlay>
            <h6>Statistic has not enough data to show.</h6>
          </template>
        </b-overlay></b-col
      >
    </b-row>
  </b-overlay>
</template>
