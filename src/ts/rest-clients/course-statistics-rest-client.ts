import axios, { AxiosResponse } from "axios";

import config from "@/config";

export async function getTotalPlayerStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(`${config.overworldApiUrl}/courses/${courseId}`);
}

export async function getActivePlayerStatistic(
  courseId: number
): Promise<AxiosResponse> {
  return axios.get(`${config.overworldApiUrl}/courses/${courseId}`);
}
