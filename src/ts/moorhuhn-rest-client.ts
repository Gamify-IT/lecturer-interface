import axios from "axios";

import config from "@/config";

import { IMoorhuhnConfiguration } from "@/ts/models";

export async function postMoorhuhnConfig(
  moorhuhnConfig: IMoorhuhnConfiguration
) {
  return axios.post(`${config.apiMoorhuhnUrl}/configurations`, moorhuhnConfig);
}

export async function getMoorhuhnConfig(id: string) {
  return axios.get(`${config.apiMoorhuhnUrl}/configurations/${id}`);
}
