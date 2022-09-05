import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { IArea } from "../models/overworld-models";

export async function getDungeon(
  courseId: number,
  worldIndex: number,
  dungeonIndex: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`
  );
}

export async function updateDungeon(
  courseId: number,
  worldIndex: number,
  dungeonIndex: number,
  dungeon: IArea
): Promise<AxiosResponse> {
  return axios.put(
    `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`,
    dungeon
  );
}
