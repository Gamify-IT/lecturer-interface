import axios, { AxiosResponse } from "axios";

import config from "@/config";

export async function getTimeSpentDistributionStatistic(
  configurationId: string
): Promise<AxiosResponse> {
  return axios.get(
    `${config.finitequizApiUrl}/statistics/${configurationId}/time-spent`
  );
}

export async function getProblematicQuestionsStatistic(
  configurationId: string
): Promise<AxiosResponse> {
  return axios.get(
    `${config.finitequizApiUrl}/statistics/${configurationId}/problematic-questions`
  );
}
