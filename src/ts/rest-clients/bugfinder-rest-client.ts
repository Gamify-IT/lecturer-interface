import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { BugfinderViewModel } from "@/ts/models/bugfinder-models";

export async function postBugfinderConfig(
  bugfinderConfig: BugfinderViewModel
): Promise<AxiosResponse> {
  return axios.post(
    `${config.bugfinderApiUrl}/configurations/build`,
    bugfinderConfig
  );
}

export async function getBugfinderConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.bugfinderApiUrl}/configurations/${id}`);
}
