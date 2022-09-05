import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { CourseInitialData, ICourse } from "../models/overworld-models";

export async function getCourses(): Promise<AxiosResponse> {
  return axios.get(`${config.overworldApiUrl}/courses`);
}

export async function getCourse(id: number): Promise<AxiosResponse> {
  return axios.get(`${config.overworldApiUrl}/courses/${id}`);
}

export async function postCourse(
  initialData: CourseInitialData
): Promise<AxiosResponse> {
  return axios.post(`${config.overworldApiUrl}/courses/`, initialData);
}

export async function postCloneCourse(
  initialData: CourseInitialData,
  id: number
): Promise<AxiosResponse> {
  return axios.post(
    `${config.overworldApiUrl}/courses/${id}/clone`,
    initialData
  );
}

export async function putCourse(course: ICourse): Promise<AxiosResponse> {
  return axios.put(`${config.overworldApiUrl}/courses/${course.id}`, course);
}

export async function deleteCourse(id: number): Promise<AxiosResponse> {
  return axios.delete(`${config.overworldApiUrl}/courses/${id}`);
}
