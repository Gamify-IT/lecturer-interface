import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { INPC } from "../models/overworld-models";

export async function putNPC(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined,
  npcIndex: number,
  npc: INPC
): Promise<AxiosResponse> {
  if (dungoenIndex != undefined) {
    return axios.put(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungoenIndex}/npcs/${npcIndex}`,
      npc
    );
  } else {
    return axios.put(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/npcs/${npcIndex}`,
      npc
    );
  }
}
