import axios, { AxiosResponse } from "axios";

import config from "@/config";
import { INPC } from "../models/overworld-models";

/**
 * Send a request to update a book.
 *
 * @param courseId the course where the book is part of
 * @param worldIndex the world index where the book is located
 * @param dungoenIndex the dungeon index where the book is located, undefined if it is in a world
 * @param bookIndex the index of the book to update
 * @param book the book object to update
 * @returns a promise of the axios response of the sent request.
 */
export async function putBook(
  courseId: number,
  worldIndex: number,
  dungoenIndex: number | undefined,
  bookIndex: number,
  book: INPC
): Promise<AxiosResponse> {
  if (dungoenIndex != undefined) {
    return axios.put(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/dungeons/${dungoenIndex}/books/${bookIndex}`,
      book
    );
  } else {
    return axios.put(
      `${config.overworldApiUrl}/courses/${courseId}/worlds/${worldIndex}/books/${bookIndex}`,
      book
    );
  }
}
