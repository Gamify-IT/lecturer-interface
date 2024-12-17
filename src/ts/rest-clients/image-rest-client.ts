import axios, { AxiosResponse } from "axios";
import config from "@/config";

export async function postMemoryImage(
  uuid: string,
  image: File
): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append("uuid", uuid);
  formData.append("image", image);

  return axios.post(`${config.memoryApiUrl}/configurations/images`, formData, {
    headers: {
      "Content-Type": "multipart/formdata",
    },
  });
}
