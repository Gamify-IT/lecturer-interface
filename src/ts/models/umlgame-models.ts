export interface IUmlgameConfiguration {
  id?: string;
  taskList: UmlTask[];
}

export class UmlgameConfiguration implements IUmlgameConfiguration {
  id?: string;
  taskList: UmlTask[];
  public constructor(taskList: UmlTask[]) {
    this.taskList = taskList;
  }
}

export class UmlTask {
  id: string;
  graph: string;
  text: string;
  taskType: TaskType;

  public constructor(
    id: string,
    graph: string,
    text: string,
    taskType: TaskType
  ) {
    this.id = id;
    this.graph = graph;
    this.text = text;
    this.taskType = taskType;
  }
}

export enum TaskType {
  COMPLETION,
  ERRORHUNT,
  CODETOUML,
  UMLTOCODE,
}

export class GraphData {
  graphAsJson: string;
  graphDescription: string;

  public constructor(json: string, text: string) {
    this.graphAsJson = json;
    this.graphDescription = text;
  }
}
