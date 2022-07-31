import axios from "axios";

import config from "@/config";
import { ICourse } from "./models";

export async function getCourses() {
  return axios.get(`${config.apiBaseUrl}/courses`);
}

export async function getCourse(id: number) {
  console.log("Request");
  return axios.get(`${config.apiBaseUrl}/courses/${id}`);
}
