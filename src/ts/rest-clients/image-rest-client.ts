import axios, { AxiosResponse } from "axios";
import config from "@/config";
import { IMemoryConfiguration } from "@/ts/models/memory-models";

export async function putMemoryImage(
  id: string,
  memoryConfig: IMemoryConfiguration
): Promise<AxiosResponse> {
  return axios.put(`${config.memoryApiUrl}/configurations/${id}`, memoryConfig);
}