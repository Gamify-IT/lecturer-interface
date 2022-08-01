import axios from "axios";

import config from "@/config";
import { courseInitialData, ICourse } from "./models";

export async function getCourses(): Promise<ICourse[]> {
  return axios.get(`${config.apiBaseUrl}/courses`);
}

export async function getCourse(id: number): Promise<ICourse> {
  return axios.get(`${config.apiBaseUrl}/courses/${id}`);
}

export async function postCourse(initialData: courseInitialData) {
  return axios.post(`${config.apiBaseUrl}/courses/`, initialData);
}
