import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { IFinitequizConfiguration } from "@/ts/models";

export async function postFinitequizConfig(
  finitequizConfig: IFinitequizConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.apiFinitequizUrl}/configurations`,
    finitequizConfig
  );
}

export async function getFinitequizConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.apiFinitequizUrl}/configurations/${id}`);
}
