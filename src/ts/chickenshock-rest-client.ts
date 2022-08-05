import axios from "axios";

import config from "@/config";

import { IChickenshockConfiguration } from "@/ts/models";

export async function postChickenshockConfig(
  chickenshockConfig: IChickenshockConfiguration
) {
  return axios.post(
    `${config.apiChickenshockUrl}/configurations`,
    chickenshockConfig
  );
}

export async function getChickenshockConfig(id: string) {
  return axios.get(`${config.apiChickenshockUrl}/configurations/${id}`);
}
