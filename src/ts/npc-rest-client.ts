import axios, { AxiosResponse } from "axios";

import config from "@/config";

export async function getNPCs(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined
): Promise<AxiosResponse> {
  if (dungoenIndex != undefined) {
    return axios.get(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungoenIndex}/minigame-tasks`
    );
  } else {
    return axios.get(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/minigame-tasks`
    );
  }
}
