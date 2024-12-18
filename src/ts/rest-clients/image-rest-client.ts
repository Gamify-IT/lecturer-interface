import axios, { AxiosResponse } from "axios";
import config from "@/config";

export async function postMemoryImage(
  uuid: string,
  image: Blob
): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append("uuid", uuid);
  formData.append("image", image);

  return axios.post(`${config.memoryApiUrl}/configurations/images`, formData, {
    headers: {
      "Content-Type": "multipart/formdata",
    }});
}

export async function postFinitequizImage(
  uuid: string,
  image: File
): Promise<AxiosResponse> {
  const formData = new FormData();
  formData.append("uuid", uuid);
  formData.append("image", image);

  try {
    console.log(image.name);
    const response = await axios.post(
      `${config.finitequizApiUrl}/configurations/images`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log("Image upload successful", response);
    return response;
  } catch (error) {
    console.error("Error uploading image", error);
    throw error;
  }
}
