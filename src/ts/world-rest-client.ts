import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { IArea, ICourse, IWorld } from "./models";

export async function getWorlds(courseId: number) {
  return axios.get(`${config.apiBaseUrl}/courses/${courseId}/worlds`);
}

export async function getWorld(
  courseId: number,
  worldIndex: number
): Promise<AxiosResponse> {
  return axios.get(
    `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}`
  );
}

export async function updateWorld(
  courseId: number,
  worldIndex: number,
  world: IArea
): Promise<AxiosResponse> {
  return axios.put(
    `${config.apiBaseUrl}/courses/${courseId}/worlds/${worldIndex}`,
    world
  );
}
