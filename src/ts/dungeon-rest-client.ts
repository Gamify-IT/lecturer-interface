import axios from "axios";

import config from "@/config";
import { IArea } from "./models";

export async function getDungeons(
  courseId: number,
  worldIndex: number
): Promise<IArea[]> {
  return axios.get(
    `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons`
  );
}

export async function getDungeon(
  courseId: number,
  worldIndex: number,
  dungeonIndex: number
): Promise<IArea> {
  return axios.get(
    `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`
  );
}

export async function updateDungeon(
  courseId: number,
  worldIndex: number,
  dungeonIndex: number,
  dungeon: IArea
): Promise<IArea> {
  return axios.put(
    `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungeonIndex}`,
    dungeon
  );
}
