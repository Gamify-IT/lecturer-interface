import { getTimeSpentDistributionStatistic } from "@/ts/rest-clients/finitequiz-minigame-statistics-rest-client";

/**
 * Loads the time spent distribution of a minigame task into the present range bar chart.
 *
 * @param courseId the id of the course the minigame task is part off
 * @param worldIndex the index of the world
 * @param dungeonIndex the index of the dungeon (optional, undefined if the area is a world)
 * @param minigameIndex the index of the minigame the statistic should be
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
        const count: number = timeSpentDistribution.count;
        data.push({
          x: `${fromPercentage}% to ${toPercentage}% has this time`,
          y: [fromTime, toTime],
        });
      }
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
          },
        },
      };
    }
  );
}
