import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { ITowercrushConfiguration } from "@/ts/models/towercrush-models";

export async function postTowercrushConfig(
  towercrushConfig: ITowercrushConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.towercrushApiUrl}/configurations`,
    towercrushConfig
  );
}

export async function getTowercrushConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.towercrushApiUrl}/configurations/${id}`);
}
