import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { IUmlGameConfiguration } from "@/ts/models/umlgame-models";

export async function postUmlGameConfig(umlGameConfig: IUmlGameConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.umlGameApiUrl}/configurations`,
    umlGameConfig
  );
}

export async function getUmlGameConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.umlGameApiUrl}/configurations/${id}`);
}
