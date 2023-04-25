import {
  getTotalPlayerStatistic,
  getActivePlayerStatistic,
} from "@/ts/rest-clients/course-statistics-rest-client";
import { LineChart, PieChart } from "../models/statistic-models";

const greenColor = "#00FF00";

/**
 * Loads the total player statistic in the present line chart with informations when players joined the course.
 *
 * @param courseId the id of the course the statistic should be loaded for
 * @param lineChart the line chart to update with the players joined date
 * @returns a promise that resolves after the chart has been updated
 */
export async function loadTotalPlayerStatistic(
  courseId: number,
  lineChart: LineChart
): Promise<any> {
  return getTotalPlayerStatistic(courseId).then(async (response) => {
    const result: {
      totalPlayers: number;
      joined: Array<{ date: Date; players: number }>;
    } = {
      totalPlayers: 50,
      joined: [
        { date: new Date("2023-04-19"), players: 5 },
        { date: new Date("2023-04-22"), players: 25 },
        { date: new Date("2023-04-23"), players: 10 },
        { date: new Date("2023-04-24"), players: 7 },
        { date: new Date("2023-04-25"), players: 3 },
      ],
    };
    let totalPlayers = 0;
    const data = [] as Array<{ x: any; y: number }>;
    result.joined.forEach((element) => {
      totalPlayers += element.players;
      data.push({ x: element.date.getTime(), y: totalPlayers });
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
            text: "Date",
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
  return getActivePlayerStatistic(courseId).then(async (response) => {
    // example data for multiple hours:
    const result: Array<{ hour: number; players: number }> = [
      { hour: 1, players: 3 },
      { hour: 3, players: 7 },
      { hour: 12, players: 24 },
      { hour: 24, players: 50 },
      { hour: 24 * 3, players: 20 },
      { hour: 24 * 7, players: 10 },
      { hour: 24 * 14, players: 2 },
    ];
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
            text: "Time",
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
  return getActivePlayerStatistic(courseId).then(async (response) => {
    // example data for multiple hours:
    const result: Array<{ level: number; name: string; players: number }> = [
      { level: 1, name: "World 1", players: 50 },
      { level: 2, name: "World 1 - Dungeon 1", players: 39 },
      { level: 3, name: "World 1 - Dungeon 2", players: 30 },
      { level: 4, name: "World 2", players: 20 },
      { level: 5, name: "World 2 - Dungeon 1", players: 10 },
      { level: 6, name: "World 2 - Dungeon 2", players: 5 },
      { level: 7, name: "World 3", players: 2 },
      { level: 8, name: "World 3 - Dungeon 1", players: 0 },
      { level: 9, name: "World 3 - Dungeon 2", players: 0 },
    ];
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
            text: "Area",
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
  return getActivePlayerStatistic(courseId).then(async (response) => {
    // example data for multiple hours:
    const result: Array<{
      amountOfCompletedMinigames: number;
      players: number;
    }> = [
      { amountOfCompletedMinigames: 0, players: 5 },
      { amountOfCompletedMinigames: 1, players: 2 },
      { amountOfCompletedMinigames: 2, players: 4 },
      { amountOfCompletedMinigames: 3, players: 5 },
      { amountOfCompletedMinigames: 4, players: 5 },
      { amountOfCompletedMinigames: 5, players: 9 },
      { amountOfCompletedMinigames: 6, players: 14 },
      { amountOfCompletedMinigames: 7, players: 17 },
      { amountOfCompletedMinigames: 8, players: 20 },
      { amountOfCompletedMinigames: 9, players: 8 },
      { amountOfCompletedMinigames: 10, players: 3 },
    ];
    const data = [] as Array<{ x: number; y: number }>;
    result.forEach((element) => {
      const playersWithMoreThanXMinigames = result
        .filter(
          (e) =>
            e.amountOfCompletedMinigames <= element.amountOfCompletedMinigames
        )
        .reduce((a, next) => a + next.players, 0);
      data.push({
        x: element.amountOfCompletedMinigames,
        y: playersWithMoreThanXMinigames,
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
