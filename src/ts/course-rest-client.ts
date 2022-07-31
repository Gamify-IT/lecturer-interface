import axios from "axios";

import config from "@/config";
import { ICourse } from "./models";

export async function getCourses(): Promise<ICourse[]> {
  return axios.get(`${config.apiBaseUrl}/courses`);
}

export async function getCourse(id: number): Promise<ICourse> {
  return axios.get(`${config.apiBaseUrl}/courses/${id}`);
}
