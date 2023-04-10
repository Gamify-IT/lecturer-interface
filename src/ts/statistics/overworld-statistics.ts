import {
  getHighscoreDistributionStatistic,
  getSuccessRateStatistic,
} from "@/ts/rest-clients/minigame-statistics-rest-client";

const greenColor = "#00FF00";
const redColor = "#FF0000";

/**
 * Loads the success rate of a minigame task into the present pie chart.
 *
 * @param courseId the id of the course the minigame task is part off
 * @param worldIndex the index of the world
 * @param dungeonIndex the index of the dungeon (optional, undefined if the area is a world)
 * @param minigameIndex the index of the minigame the statistic should be
 * @param pieChart the pie chart to update with success rate data
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadAverageSuccessInPieChart(
  courseId: string,
  worldIndex: number,
  dungeonIndex: number | undefined,
  minigameIndex: number,
  pieChart: any
): Promise<any> {
  return getSuccessRateStatistic(
    courseId,
    worldIndex,
    dungeonIndex,
    minigameIndex
  ).then(async (response) => {
    const result = response.data;
    const sumSuccessAt = 5;
    let successHigherThanSuccessAt = 0;
    let fails = 0;
    let series = [] as Array<number>;
    let labels = [] as Array<string>;
    let colors = [] as Array<string>;
    for (const key in result.successRateDistribution) {
      if (+key < sumSuccessAt) {
        series = [...series, result.successRateDistribution[key]];
        labels = [...labels, `Beim ${key}. Versuch bestanden`];
        // TODO: make color darker on every iteration
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
    for (const key in result.failureRateDistribution) {
      fails += result.failureRateDistribution[key];
    }
    series = [...series, fails];
    labels = [...labels, `Nicht bestanden`];
    colors = [...colors, redColor];

    pieChart.enoughDataToShow = series.reduce((x, y) => x + y) > 0;

    pieChart.series = series;
    pieChart.options = {
      ...pieChart.options,
      ...{
        labels: labels,
        colors: colors,
      },
    };
  });
}
/**
 * Loads the highscore distribution of a minigame task into the present line chart.
 *
 * @param courseId the id of the course the minigame task is part off
 * @param worldIndex the index of the world
 * @param dungeonIndex the index of the dungeon (optional, undefined if the area is a world)
 * @param minigameIndex the index of the minigame the statistic should be
 * @param lineChart the linechart to update with highscore distribution
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadHighscoreDistributionInLineChart(
  courseId: string,
  worldIndex: number,
  dungeonIndex: number | undefined,
  minigameIndex: number,
  lineChart: any
): Promise<any> {
  return getHighscoreDistributionStatistic(
    courseId,
    worldIndex,
    dungeonIndex,
    minigameIndex
  ).then(async (response) => {
    const result: Array<any> = response.data;
    const data = result.map((scoreHit) => scoreHit.amount) as Array<number>;
    // we already expect here that the array is sorted by score
    const categories = result.map(
      (scoreHit) => scoreHit.score
    ) as Array<number>;
    const series = [{ name: "Highscore distribution", data: data }];

    lineChart.enoughDataToShow = false;
    // at least one score has to be hit
    if (data.reduce((x, y) => x + y) > 0) {
      lineChart.enoughDataToShow = true;
    }
    lineChart.series = series;
    lineChart.options = {
      ...lineChart.options,
      ...{
        xaxis: {
          categories: categories,
        },
        stroke: {
          curve: "smooth",
        },
      },
    };
  });
}
