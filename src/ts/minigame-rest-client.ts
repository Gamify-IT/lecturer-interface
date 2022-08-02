import axios from "axios";

import config from "@/config";
import { IArea } from "./models";

export async function getMinigames(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined
): Promise<IArea[]> {
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
