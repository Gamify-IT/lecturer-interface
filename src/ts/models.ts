export interface IArea {
  id: number;
  name: string;
  lectureName: string;

  active: boolean;
  tasks: ITask[];
}

export interface IWorld extends IArea {
  id: number;
  name: string;
  lectureName: string;

  active: boolean;
  dungeons: IDungeon[];
  tasks: ITask[];
}

export interface IDungeon extends IArea {
  id: number;
  name: string;
  lectureName: string;

  active: boolean;
  tasks: ITask[];
}

export interface ITask {
  id: number;
  lectureName: string;
  game: Minigame;
  congifurationId: string | number;
}

export enum Minigame {
  NONE = "NONE",
  CHICKENSHOCK = "CHICKENSHOCK",
  BUGFINDER = "BUGFINDER",
  REGEX_GAME = "REGEX-GAME",
  CROSSWORDPUZZLE = "CROSSWORDPUZZLE",
  GIT_CARD_GAME = "GIT-CARD-GAME",
  UML_GAME = "UML-GAME",
}

export class World implements IWorld {
  id: number;
  name: string;
  lectureName: string;
  active: boolean;
  dungeons: IDungeon[];
  tasks: ITask[];

  public constructor(
    id: number,
    name: string,
    lectureName: string,
    active: boolean,
    dungeons: IDungeon[],
    tasks: ITask[]
  ) {
    this.id = id;
    this.name = name;
    this.lectureName = lectureName;
    this.active = active;
    this.dungeons = dungeons;
    this.tasks = tasks;
  }
}

export class Dungeon implements IDungeon {
  id: number;
  name: string;
  lectureName: string;
  active: boolean;
  tasks: ITask[];

  public constructor(
    id: number,
    name: string,
    lectureName: string,
    active: boolean,
    tasks: ITask[]
  ) {
    this.id = id;
    this.name = name;
    this.lectureName = lectureName;
    this.active = active;
    this.tasks = tasks;
  }
}

export class Task implements ITask {
  id: number;
  lectureName: string;
  game: Minigame;
  congifurationId: number | string;

  public constructor(
    id: number,
    lectureName: string,
    game: Minigame,
    configurationId: number | string
  ) {
    this.id = id;
    this.lectureName = lectureName;
    this.game = game;
    this.congifurationId = configurationId;
  }
}

export function exampleWorlds(): IWorld[] {
  return [
    new World(
      1,
      "World 1",
      "Kapitel 1",
      true,
      [
        new Dungeon(1, "Dungeon 1", "Absatz 1", true, [
          new Task(1, "Super finder", Minigame.BUGFINDER, "w1-d1-t1"),
        ]),
      ],
      [new Task(2, "Chickenshock nicht vernichter", Minigame.REGEX_GAME, "w1-t1")]
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
  ];
}
