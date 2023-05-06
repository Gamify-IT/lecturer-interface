import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { RegexGameConfiguration } from "@/ts/models/regexgame-models";

export async function postRegexGameConfig(
  regexgameConfig: RegexGameConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.regexgameApiUrl}/configurations`,
    regexgameConfig
  );
}

export async function getRegexGameConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.regexgameApiUrl}/configurations/${id}`);
}
