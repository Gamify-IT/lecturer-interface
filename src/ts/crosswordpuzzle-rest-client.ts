import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { ICrosswordpuzzleConfiguration } from "@/ts/models";

export async function postCrosswordpuzzleConfig(
  chickenshockConfig: ICrosswordpuzzleConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.apiCrosswordpuzzleUrl}/configurations`,
    chickenshockConfig
  );
}

export async function getCrosswordpuzzleConfig(
  id: string
): Promise<AxiosResponse> {
  return axios.get(`${config.apiCrosswordpuzzleUrl}/configurations/${id}`);
}
