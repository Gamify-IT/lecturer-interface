import {
  getProblematicQuestionsStatistic,
  getTimeSpentDistributionStatistic,
} from "@/ts/rest-clients/finitequiz-minigame-statistics-rest-client";

const greenColor = "#00FF00";
const redColor = "#FF0000";

/**
 * Loads the time spent distribution of a minigame task into the present range bar chart.
 *
 * @param configurationId the id of the configuration
 * @param rangeBar the range bar to update with highscore distribution
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadTimeSpentDistributionInRangeBar(
  configurationId: string,
  rangeBar: any
): Promise<any> {
  return getTimeSpentDistributionStatistic(configurationId).then(
    async (response) => {
      const result: Array<any> = response.data;
      const data = [] as Array<{ x: string; y: Array<number> }>;
      const series = [{ data: data }] as Array<{
        data: Array<{ x: string; y: Array<number> }>;
      }>;
      for (const timeSpentDistribution of result) {
        const fromPercentage: number = timeSpentDistribution.fromPercentage;
        const toPercentage: number = timeSpentDistribution.toPercentage;
        const fromTime: number = timeSpentDistribution.fromTime;
        const toTime: number = timeSpentDistribution.toTime;
        data.push({
          x: `${fromPercentage}% to ${toPercentage}% of game runs`,
          y: [fromTime, toTime],
        });
      }

      rangeBar.enoughDataToShow = false;
      // at least one bar has a range > 0 that in the statistic at least one bar shows up
      data.forEach((dataPoint) => {
        if (dataPoint.y[0] != dataPoint.y[1]) {
          rangeBar.enoughDataToShow = true;
        }
      });

      rangeBar.series = series;
      rangeBar.options = {
        ...rangeBar.options,
        ...{
          yaxis: {
            labels: {
              formatter: (val: any) => {
                return val + " seconds";
              },
            },
            title: {
              text: "Time in seconds",
            },
          },
        },
      };
    }
  );
}

/**
 * Loads the time spent distribution of a minigame task into the present range bar chart.
 *
 * @param configurationId the id of the configuration
 * @param rangeBar the range bar to update with highscore distribution
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadProblematicQuestionsInBarChart(
  configurationId: string,
  barChart: any
): Promise<any> {
  return getProblematicQuestionsStatistic(configurationId).then(
    async (response) => {
      const result: Array<any> = response.data;
      const series = [
        { name: "Correct answers", data: [] },
        { name: "Wrong answers", data: [] },
      ] as Array<{
        name: string;
        data: Array<number>;
      }>;
      const categories = [] as Array<string>;
      for (const problematicQuestion of result) {
        const correctAnswers: number = problematicQuestion.correctAnswers;
        const wrongAnswers: number = problematicQuestion.wrongAnswers;
        const question: { text: string } = problematicQuestion.question;
        categories.push(question.text);
        series[0].data.push(correctAnswers);
        series[1].data.push(wrongAnswers);
      }

      barChart.enoughDataToShow = series.length > 0;

      barChart.series = series;
      barChart.options = {
        ...barChart.options,
        ...{
          xaxis: {
            categories: categories,
            labels: {
              formatter: (val: any) => {
                return val + " tries";
              },
            },
            title: "Tries",
          },
          yaxis: {
            title: {
              text: "Question",
            },
          },
          chart: {
            stacked: true,
          },
          colors: [greenColor, redColor],
          plotOptions: {
            bar: {
              horizontal: true,
              dataLabels: {
                total: {
                  enabled: true,
                  offsetX: 0,
                  style: {
                    fontSize: "13px",
                    fontWeight: 900,
                  },
                },
              },
            },
          },
        },
      };
    }
  );
}
