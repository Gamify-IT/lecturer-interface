import axios, { AxiosResponse } from "axios";

import config from "@/config";

/**
 *
 * @param courseId the id of the course
 * @returns the statistic when the players joined the course
 */
export async function getPlayersJoinedStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.overworldApiUrl}/courses/${courseId}/players-joined`
  );
}

/**
 *
 * @param courseId the id of the course
 * @returns the statistic when players was last active in course
 */
export async function getActivePlayersStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.overworldApiUrl}/courses/${courseId}/active-players`
  );
}

/**
 *
 * @param courseId the id of the course
 * @returns the statistic of amount of players that unlocked amount of areas
 */
export async function getUnlockedAreasStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.overworldApiUrl}/courses/${courseId}/unlocked-areas`
  );
}

/**
 *
 * @param courseId the id of the course
 * @returns the statistic of amount of players that completed amount of minigames
 */
export async function getCompletedMinigamesStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.overworldApiUrl}/courses/${courseId}/completed-minigames`
  );
}
