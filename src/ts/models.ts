export interface ICourse {
  id: number;
  courseName: string;
  description: string;

  active: boolean;
  worlds: IWorld[];
}

export interface IArea {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  minigameTasks: ITask[];
  npcs: INPC[];
}

export interface IWorld extends IArea {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  dungeons: IDungeon[];
  minigameTasks: ITask[];
  npcs: INPC[];
}

export interface IDungeon extends IArea {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  minigameTasks: ITask[];
  npcs: INPC[];
}

export interface ITask {
  id: string;
  index: number;
  game: Minigame;
  congifurationId: string;
}

export interface INPC {
  id: string;
  index: number;
  text: string;
}

export interface courseInitialData {
  courseName: string;
  description: string;
  semester: string;
}

export enum Minigame {
  NONE = "NONE",
  MOORHUHN = "MOORHUHN",
  BUGFINDER = "BUGFINDER",
  REGEX_GAME = "REGEX-GAME",
  CROSSWORDPUZZLE = "CROSSWORDPUZZLE",
  GIT_CARD_GAME = "GIT-CARD-GAME",
  UML_GAME = "UML-GAME",
}

export class Course implements ICourse {
  id: number;
  courseName: string;
  description: string;
  active: boolean;
  worlds: IWorld[];

  public constructor(
    id: number,
    courseName: string,
    description: string,
    active: boolean,
    worlds: IWorld[]
  ) {
    this.id = id;
    this.courseName = courseName;
    this.description = description;
    this.active = active;
    this.worlds = worlds;
  }
}

export class World implements IWorld {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  dungeons: IDungeon[];
  minigameTasks: ITask[];
  npcs: INPC[];

  public constructor(
    id: string,
    index: number,
    staticName: string,
    topicName: string,
    active: boolean,
    dungeons: IDungeon[],
    minigameTasks: ITask[],
    npcs: INPC[]
  ) {
    this.id = id;
    this.index = index;
    this.staticName = staticName;
    this.topicName = topicName;
    this.active = active;
    this.dungeons = dungeons;
    this.minigameTasks = minigameTasks;
    this.npcs = npcs;
  }
}

export class Dungeon implements IDungeon {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  minigameTasks: ITask[];
  npcs: INPC[];

  public constructor(
    id: string,
    index: number,
    staticName: string,
    topicName: string,
    active: boolean,
    minigameTasks: ITask[],
    npcs: INPC[]
  ) {
    this.id = id;
    this.index = index;
    this.staticName = staticName;
    this.topicName = topicName;
    this.active = active;
    this.minigameTasks = minigameTasks;
    this.npcs = npcs;
  }
}

export class Task implements ITask {
  id: string;
  index: number;
  game: Minigame;
  congifurationId: string;

  public constructor(
    id: string,
    index: number,
    game: Minigame,
    configurationId: string
  ) {
    this.id = id;
    this.index = index;
    this.game = game;
    this.congifurationId = configurationId;
  }
}

export class NPC implements INPC {
  id: string;
  index: number;
  text: string;

  public constructor(id: string, index: number, text: string) {
    this.id = id;
    this.index = index;
    this.text = text;
  }
}

export function isWorld(area: any) {
  return area.dungeons;
}

export function exampleWorlds(): IWorld[] {
  return [];
  /*return [
    new World(
      1,
      "World 1",
      "Kapitel 1",
      true,
      [
        new Dungeon(1, "Dungeon 1", "Absatz 1", true, [
          new Task("1", "Super finder", Minigame.BUGFINDER, "w1-d1-t1"),
        ]),
      ],
      [new Task(2, "Moorhuhn nicht vernichter", Minigame.REGEX_GAME, "w1-t1")]
    ),
    new World(
      2,
      "World 2",
      "Kapitel 2",
      true,
      [
        new Dungeon(1, "Dungeon 1", "Absatz 1", false, [
          new Task(3, "Super finder v2", Minigame.BUGFINDER, "w2-d1-t1"),
        ]),
        new Dungeon(2, "Dungeon 2", "Absatz 2", true, [
          new Task(
            4,
            "Super crosswordpuzzle",
            Minigame.CROSSWORDPUZZLE,
            "w2-d2-t1"
          ),
          new Task(5, "Super regex game", Minigame.REGEX_GAME, "w2-d2-t2"),
        ]),
      ],
      [new Task(6, "Git-Card-Game lol", Minigame.GIT_CARD_GAME, "w2-t1")]
    ),
  ];*/
}
