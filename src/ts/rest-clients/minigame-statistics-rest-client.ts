import axios, { AxiosResponse } from "axios";

import config from "@/config";

export async function getSuccessRateStatistic(
  courseId: string,
  worldIndex: number,
  dungeonIndex: number | undefined,
  minigameIndex: number
): Promise<AxiosResponse> {
  if (dungeonIndex != undefined) {
    return axios.get(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}/minigame-tasks/${minigameIndex}/statistics/success-rate`
    );
  } else {
    return axios.get(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/minigame-tasks/${minigameIndex}/statistics/success-rate`
    );
  }
}
