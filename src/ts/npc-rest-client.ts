import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { INPC } from "./models";

export async function getNPCs(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined
): Promise<AxiosResponse> {
  if (dungoenIndex != undefined) {
    return axios.get(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungoenIndex}/npcs`
    );
  } else {
    return axios.get(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/npcs`
    );
  }
}

export async function putNPC(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined,
  npcIndex: number,
  npc: INPC
): Promise<AxiosResponse> {
  if (dungoenIndex != undefined) {
    return axios.put(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungoenIndex}/npcs/${npcIndex}`,
      npc
    );
  } else {
    return axios.put(
      `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}/npcs/${npcIndex}`,
      npc
    );
  }
}