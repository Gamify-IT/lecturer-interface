import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { IUmlgameConfiguration } from "@/ts/models/umlgame-models";

export async function putUmlgameConfig(umlGameConfig: IUmlgameConfiguration
): Promise<AxiosResponse> {
  return axios.put(
    `${config.umlgameApiUrl}/configurations`,
    umlGameConfig
  );
}

export async function getUmlgameConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.umlgameApiUrl}/configurations/${id}`);
}
