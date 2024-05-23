import {
  getActivePlayersStatistic,
  getPlayersJoinedStatistic,
  getCompletedMinigamesStatistic,
  getUnlockedAreasStatistic,
} from "@/ts/rest-clients/course-statistics-rest-client";
import { LineChart } from "../models/statistic-models";

/**
 * Loads the total player statistic in the present line chart with information when players joined the course.
 *
 * @param courseId the id of the course the statistic should be loaded for
 * @param lineChart the line chart to update with the players joined date
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadPlayersJoinedStatistic(
  courseId: number,
  lineChart: LineChart
): Promise<any> {
  return getPlayersJoinedStatistic(courseId).then(async (response) => {
    const result: {
      totalPlayers: number;
      joined: Array<{ date: Date; players: number }>;
    } = response.data;
    let totalPlayers = 0;
    const data = [] as Array<{ x: any; y: number }>;
    result.joined.forEach((element) => {
      totalPlayers += element.players;
      data.push({ x: new Date(element.date).getTime(), y: totalPlayers });
    });
    const series = [{ name: "Players in course", data: data }];

    lineChart.enoughDataToShow =
      result.joined.reduce((a, next) => a + next.players, 0) > 0;

    lineChart.series = series;
    lineChart.options = {
      ...lineChart.options,
      ...{
        xaxis: {
          type: "datetime",
          labels: {
            formatter: function (value) {
              return new Date(value).toLocaleDateString();
            },
          },
          title: {
            text: "Date players joined",
          },
        },
        yaxis: {
          title: {
            text: "Amount of players in course",
          },
        },
      },
    };
  });
}

/**
 * Loads the active player statistic into the present line chart.
 *
 * @param courseId the id of the course the statistic should be loaded for
 * @param lineChart the linechart to update with active player distribution
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadActivePlayerStatistic(
  courseId: number,
  lineChart: LineChart
): Promise<any> {
  return getActivePlayersStatistic(courseId).then(async (response) => {
    const result: Array<{ hour: number; players: number }> = response.data;
    const data = [] as Array<{ x: number; y: number }>;
    result.forEach((element) => {
      data.push({ x: element.hour, y: element.players });
    });
    const series = [{ name: "Players last activity in hours", data: data }];

    const averageTimeInHours =
      data.reduce((a, next) => a + next.x * next.y, 0) /
      data.reduce((a, next) => a + next.y, 0);

    // at least one score has to be hit
    lineChart.enoughDataToShow = data.reduce((a, next) => a + next.y, 0) > 0;

    lineChart.series = series;
    lineChart.options = {
      ...lineChart.options,
      ...{
        xaxis: {
          title: {
            text: "Time since last activity",
          },
          type: "numeric",
          labels: {
            formatter: function (value) {
              const hours = parseInt(value);
              if (hours > 24) {
                return (hours / 24).toFixed(0) + " days";
              }
              return value + (hours == 1 ? " hour" : " hours");
            },
          },
        },
        yaxis: {
          title: {
            text: "Amount of players",
          },
        },
        stroke: {
          curve: "smooth",
        },
        annotations: {
          xaxis: [
            {
              x: averageTimeInHours,
              borderColor: "red",
              strokeDashArray: 0,
              label: {
                borderColor: "#999",
                style: {
                  color: "#fff",
                  background: "red",
                },
                text: "Average",
              },
            },
          ],
        },
      },
    };
  });
}

/**
 * Loads the player unlocked area statistic into the present line chart.
 *
 * @param courseId the id of the course the statistic should be loaded for
 * @param lineChart the linechart to update with player unlocked area statistic
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadPlayerUnlockedAreaStatistic(
  courseId: number,
  lineChart: LineChart
): Promise<any> {
  return getUnlockedAreasStatistic(courseId).then(async (response) => {
    const result: Array<{ level: number; name: string; players: number }> =
      response.data;
    // sort by level
    result.sort((a, b) => a.level - b.level);
    const data = [] as Array<number>;
    const categories = [] as Array<string>;
    result.forEach((element) => {
      data.push(element.players);
      categories.push(element.name);
    });
    const series = [{ name: "Players unlocked area", data: data }];

    // at least one score has to be hit
    lineChart.enoughDataToShow = data.reduce((a, next) => a + next, 0) > 0;

    lineChart.series = series;
    lineChart.options = {
      ...lineChart.options,
      ...{
        xaxis: {
          categories: categories,
          title: {
            text: "Area unlocked",
          },
        },
        yaxis: {
          title: {
            text: "Amount of players",
          },
        },
      },
    };
  });
}

/**
 * Loads the player completed minigames statistic into the present line chart.
 *
 * @param courseId the id of the course the statistic should be loaded for
 * @param lineChart the linechart to update with player completed minigames statistic
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadPlayerCompletedMinigameStatistic(
  courseId: number,
  lineChart: LineChart
): Promise<any> {
  return getCompletedMinigamesStatistic(courseId).then(async (response) => {
    const result: Array<{
      amountOfCompletedMinigames: number;
      players: number;
    }> = response.data;
    const data = [] as Array<{ x: number; y: number }>;
    result.forEach((element) => {
      const playersWithMoreAndEqualThanXMinigames = result
        .filter(
          (e) =>
            e.amountOfCompletedMinigames >= element.amountOfCompletedMinigames
        )
        .reduce((a, next) => a + next.players, 0);
      data.push({
        x: element.amountOfCompletedMinigames,
        y: playersWithMoreAndEqualThanXMinigames,
      });
    });
    const series = [
      { name: "Players completed at least x minigames", data: data },
    ];
    const average =
      result.reduce(
        (current, next) =>
          current + next.amountOfCompletedMinigames * next.players,
        0
      ) / result.reduce((current, next) => current + next.players, 0);

    // at least one score has to be hit
    lineChart.enoughDataToShow = data.reduce((a, next) => a + next.y, 0) > 0;

    lineChart.series = series;
    lineChart.options = {
      ...lineChart.options,
      ...{
        xaxis: {
          title: {
            text: "Amount of at least completed minigames",
          },
        },
        yaxis: {
          title: {
            text: "Amount of players",
          },
        },
        annotations: {
          xaxis: [
            {
              x: average,
              borderColor: "red",
              strokeDashArray: 0,
              label: {
                borderColor: "#999",
                style: {
                  color: "#fff",
                  background: "red",
                },
                text: "Average",
              },
            },
          ],
        },
      },
    };
  });
}
