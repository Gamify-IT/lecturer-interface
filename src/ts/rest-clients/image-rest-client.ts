import axios, { AxiosResponse } from "axios";
import config from "@/config";

export async function postMemoryImage(uuid: string, image: File): Promise<AxiosResponse> {
  return axios.post(`${config.memoryApiUrl}/images`, {uuid, image});
}