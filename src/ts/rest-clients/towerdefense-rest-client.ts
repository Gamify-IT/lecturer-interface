import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { ITowerDefenseConfiguration } from "@/ts/models/towerdefense-models";

export async function postTowerDefenseConfig(
  towerDefenseConfig: ITowerDefenseConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.towerdefenseApiUrl}/configurations`,
    towerDefenseConfig
  );
}

export async function getTowerDefenseConfig(
  id: string
): Promise<AxiosResponse> {
  return axios.get(`${config.towerdefenseApiUrl}/configurations/${id}`);
}
