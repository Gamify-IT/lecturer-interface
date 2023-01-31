<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import {
  loadTimeSpentDistributionInRangeBar,
  loadProblematicQuestionsInBarChart,
} from "@/ts/statistics/finitequiz-statistics";
import { ref, watch, Ref, defineProps } from "vue";

const loadingMinigameSpecificStatistics = ref(false);
const isEnoughDataForStatistic = ref(true);

const inFocus = ref(false);

watch(
  () => props.configurationId,
  (newValue) => {
    loadMinigameStatistic(props.configurationId);
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
    statistics.forEach(
      (statistic) => (statistic.value.enoughDataToShow = false)
    );
    throw new Error(
      "Configuration ID must be present when loading minigame specific statistics"
    );
  }
  loadingMinigameSpecificStatistics.value = true;
  const promisesToWait = [
    loadTimeSpentDistributionInRangeBar(
      configurationId,
      timeSpentDistributionRangeBar.value
    ),
    loadProblematicQuestionsInBarChart(
      configurationId,
      problematicQuestionsBarChart.value
    ),
  ];
  await Promise.all(promisesToWait);
  loadingMinigameSpecificStatistics.value = false;
}

const timeSpentDistributionRangeBar = ref({
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "rangeBar" },
    title: { text: "Time spent per minigame run" },
  } as ApexOptions,
  series: [] as Array<{
    data: Array<{ x: string; y: Array<number> }>;
  }>,
});

const problematicQuestionsBarChart = ref({
  enoughDataToShow: true,
  width: 600,
  options: {
    chart: { type: "bar" },
    title: { text: "Problematic questions per minigame run" },
  } as ApexOptions,
  series: [] as Array<{ name: string; data: Array<number> }>,
});

const statistics = [
  timeSpentDistributionRangeBar,
  problematicQuestionsBarChart,
] as Array<
  Ref<{
    enoughDataToShow: boolean;
    width: number;
    options: ApexOptions;
    series: Array<any>;
  }>
>;

loadMinigameStatistic(props.configurationId);
</script>

<template>
  <b-overlay :show="loadingMinigameSpecificStatistics" rounded="sm">
    <b-row id="minigame-specific-statistics" class="container mt-4">
      <h2>Minigame specific statistics</h2>
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
          <template #overlay>
            <h6>Statistic has not enough data to show.</h6>
          </template>
        </b-overlay></b-col
      >
    </b-row>
  </b-overlay>
</template>
