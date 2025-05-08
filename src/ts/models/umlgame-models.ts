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
  id?: string;
  taskNumber: string;
  graph: string;
  text: string;
  taskType: TaskType;

  public constructor(
    taskNumber: string,
    graph: string,
    text: string,
    taskType: TaskType
  ) {
    this.taskNumber = taskNumber;
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
