import axios from "axios";

import config from "@/config";
import { IArea } from "./models";
import { updateWorld } from "./world-rest-client";
import { updateDungeon } from "./dungeon-rest-client";

export async function updateArea(
  courseId: number,
  worldIndex: number,
  dungeonIndex: number,
  area: IArea
): Promise<IArea> {
  if (dungeonIndex == 0) {
    return updateWorld(courseId, worldIndex, area);
  } else {
    return updateDungeon(courseId, worldIndex, dungeonIndex, area);
  }
}
