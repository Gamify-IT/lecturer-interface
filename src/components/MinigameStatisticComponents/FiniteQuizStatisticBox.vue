<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import {
  loadProblematicQuestionsInBarChart,
  loadTimeSpentDistributionInRangeBar,
} from "@/ts/statistics/finitequiz-statistics";
import { defineProps, ref, watch } from "vue";
import { ChartToShow } from "@/ts/models/statistic-models";

const loadingMinigameSpecificStatistics = ref(false);

const inFocus = ref(false);

watch(
  () => props.configurationId,
  (newValue) => {
    loadMinigameStatistic(newValue);
  },
  { deep: true }
);
const props = defineProps({
  upClicked: Boolean,
  downClicked: Boolean,
  inFocus: Boolean,
  leftClicked: Boolean,
  rightClicked: Boolean,
  configurationId: String,
});

watch(
  () => props.inFocus,
  (newBoolean) => {
    inFocus.value = newBoolean;
  },
  { deep: true }
);

async function loadMinigameStatistic(configurationId: string | undefined) {
  if (!configurationId) {
    statistics.forEach((statistic) => (statistic.enoughDataToShow = false));
    throw new Error(
      "Configuration ID must be present when loading minigame specific statistics"
    );
  }
  loadingMinigameSpecificStatistics.value = true;
  const promisesToWait = [
    loadTimeSpentDistributionInRangeBar(
      configurationId,
      timeSpentDistributionRangeBar
    ),
    loadProblematicQuestionsInBarChart(
      configurationId,
      problematicQuestionsBarChart
    ),
  ];
  await Promise.all(promisesToWait);
  loadingMinigameSpecificStatistics.value = false;
}

const timeSpentDistributionRangeBar: ChartToShow = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "rangeBar" },
    title: { text: "Time spent per minigame run" },
  },
  series: [] as Array<{
    data: Array<{ x: string; y: Array<number> }>;
  }>,
};

const problematicQuestionsBarChart: ChartToShow = {
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "bar" },
    title: { text: "Problematic questions per minigame run" },
  },
  series: [] as Array<{ name: string; data: Array<number> }>,
};

const statistics = [
  timeSpentDistributionRangeBar,
  problematicQuestionsBarChart,
] as Array<ChartToShow>;

loadMinigameStatistic(props.configurationId);
</script>

<template>
  <b-overlay :show="loadingMinigameSpecificStatistics" rounded="sm">
    <b-row id="minigame-specific-statistics" class="container mt-4">
      <h2>Minigame specific statistics</h2>
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
