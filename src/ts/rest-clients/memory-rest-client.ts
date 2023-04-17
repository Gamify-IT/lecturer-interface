import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { IMemoryConfiguration } from "@/ts/models/memory-models";

export async function postMemoryConfig(
  memoryConfig: IMemoryConfiguration
): Promise<AxiosResponse> {
  return axios.post(`${config.memoryApiUrl}/configurations`, memoryConfig);
}

export async function putMemoryConfig(
  id: string,
  memoryConfig: IMemoryConfiguration
): Promise<AxiosResponse> {
  return axios.put(`${config.memoryApiUrl}/configurations/${id}`, memoryConfig);
}

export async function getMemoryConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.memoryApiUrl}/configurations/${id}`);
}
