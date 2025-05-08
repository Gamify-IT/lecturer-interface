import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { IUmlgameConfiguration } from "@/ts/models/umlgame-models";

export async function putUmlgameConfig(
  id: string,
  umlGameConfig: IUmlgameConfiguration
): Promise<AxiosResponse> {
  return axios.put(
    `${config.umlgameApiUrl}/configurations/${id}`,
    umlGameConfig
  );
}

export async function getUmlgameConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.umlgameApiUrl}/configurations/${id}`);
}

export async function postUmlgameConfig(
  umlGameConfig: IUmlgameConfiguration
): Promise<AxiosResponse> {
  return axios.post(`${config.umlgameApiUrl}/configurations`, umlGameConfig);
}
