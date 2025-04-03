import axios, { AxiosResponse } from "axios";

import config from "@/config";

import { IFinitequizConfiguration } from "@/ts/models/finitequiz-models";

/**
 * Sends a POST request to create a new finite quiz configuration.
 * @param finitequizConfig - The configuration object for the quiz.
 * @returns A promise with the Axios response.
 */
export async function postFinitequizConfig(
  finitequizConfig: IFinitequizConfiguration
): Promise<AxiosResponse> {
  return axios.post(
    `${config.finitequizApiUrl}/configurations`,
    finitequizConfig
  );
}

/**
 * Sends a PUT request to update an existing finite quiz configuration.
 * @param id - The ID of the configuration to update.
 * @param finitequizConfig - The new configuration object for the quiz.
 * @returns A promise with the Axios response.
 */
export async function putFinitequizConfig(
  id: string,
  finitequizConfig: IFinitequizConfiguration
): Promise<AxiosResponse> {
  return axios.put(
    `${config.finitequizApiUrl}/configurations/${id}`,
    finitequizConfig
  );
}

/**
 * Sends a GET request to retrieve a finite quiz configuration by its ID.
 * @param id - The ID of the configuration to retrieve.
 * @returns A promise with the Axios response.
 */
export async function getFinitequizConfig(id: string): Promise<AxiosResponse> {
  return axios.get(`${config.finitequizApiUrl}/configurations/${id}`);
}
