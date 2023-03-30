export interface ICourse {
  id: number;
  semester: string;
  courseName: string;
  description: string;

  active: boolean;
  worlds: IWorld[];
}

export interface ICloneCourse {
  id: number;
  semester: string;
  courseName: string;
  description: string;

  active: boolean;
  worlds: IWorld[];
  errorMessages: string[];
}

export interface ICourseItem {
  id: number;
  semester: string;
  courseName: string;
  description: string;

  active: boolean;
  _rowVariant: string;
}

export interface IArea {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  minigameTasks: ITask[];
  npcs: INPC[];
  books: IBook[];
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
  books: IBook[];
}

export interface IDungeon extends IArea {
  id: string;
  index: number;
  staticName: string;
  topicName: string;
  active: boolean;
  minigameTasks: ITask[];
  npcs: INPC[];
  books: IBook[];
}

export interface ITask {
  id: string;
  index: number;
  description: string;
  game: Minigame;
  configurationId?: string;
}

export interface INPC {
  id: string;
  index: number;
  description: string;
  text: string[];
}

export interface IBook {
  id: string;
  index: number;
  description: string;
  text: string;
}

export interface CourseInitialData {
  courseName: string;
  description: string;
  semester: string;
}

export enum MapType {
  NPC,
  BOOK,
  MINIGAME,
  DUNGEON,
  RAW,
}

export enum Minigame {
  NONE = "NONE",
  BUGFINDER = "BUGFINDER",
  CHICKENSHOCK = "CHICKENSHOCK",
  CROSSWORDPUZZLE = "CROSSWORDPUZZLE",
  FINITEQUIZ = "FINITEQUIZ",
  MEMORY = "MEMORY",
  REGEX_GAME = "REGEX-GAME",
  TOWERCRUSH = "TOWERCRUSH",
}

export class Course implements ICourse {
  id: number;
  courseName: string;
  semester: string;
  description: string;
  active: boolean;
  worlds: IWorld[];

  public constructor(
    id: number,
    courseName: string,
    semester: string,
    description: string,
    active: boolean,
    worlds: IWorld[]
  ) {
    this.id = id;
    this.semester = semester;
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
  books: IBook[];

  public constructor(
    id: string,
    index: number,
    staticName: string,
    topicName: string,
    active: boolean,
    dungeons: IDungeon[],
    minigameTasks: ITask[],
    npcs: INPC[],
    books: IBook[]
  ) {
    this.id = id;
    this.index = index;
    this.staticName = staticName;
    this.topicName = topicName;
    this.active = active;
    this.dungeons = dungeons;
    this.minigameTasks = minigameTasks;
    this.npcs = npcs;
    this.books = books;
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
  books: IBook[];

  public constructor(
    id: string,
    index: number,
    staticName: string,
    topicName: string,
    active: boolean,
    minigameTasks: ITask[],
    npcs: INPC[],
    books: IBook[]
  ) {
    this.id = id;
    this.index = index;
    this.staticName = staticName;
    this.topicName = topicName;
    this.active = active;
    this.minigameTasks = minigameTasks;
    this.npcs = npcs;
    this.books = books;
  }
}

export class Task implements ITask {
  id: string;
  index: number;
  description: string;
  game: Minigame;
  configurationId: string;

  public constructor(
    id: string,
    index: number,
    description: string,
    game: Minigame,
    configurationId: string
  ) {
    this.id = id;
    this.index = index;
    this.description = description;
    this.game = game;
    this.configurationId = configurationId;
  }
}

export class NPC implements INPC {
  id: string;
  index: number;
  description: string;
  text: string[];

  public constructor(
    id: string,
    index: number,
    description: string,
    text: string[]
  ) {
    this.id = id;
    this.index = index;
    this.description = description;
    this.text = text;
  }
}

export class Book implements IBook {
  id: string;
  index: number;
  description: string;
  text: string;

  public constructor(
    id: string,
    index: number,
    description: string,
    text: string
  ) {
    this.id = id;
    this.index = index;
    this.description = description;
    this.text = text;
  }
}

export function isWorld(area: any) {
  return area.dungeons;
}
