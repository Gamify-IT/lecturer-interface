// TODO: implement, currently placeholders
export interface IUmlgameConfiguration {
  taskList: UmlTask[];
}

export class UmlgameConfiguration implements IUmlgameConfiguration {
  taskList: UmlTask[];
  public constructor(taskList: UmlTask[]) {
    this.taskList = taskList;
  }
}

export class UmlTask {
  id: string;
  graph: unknown;
  text: string;
  taskType: TaskType;

  public constructor(id: string, graph: unknown, text: string, taskType: TaskType) {
    this.id = id;
    this.graph = graph;
    this.text = text;
    this.taskType = taskType;
  }
}

export enum TaskType {
  COMPLETION, ERRORHUNT, CODETOUML, UMLTOCODE
}

export class GraphData {
  graphAsJson: string;
  graphDescription: string;

  public constructor(json: string, text: string) {
    this.graphAsJson = json;
    this.graphDescription = text;
  }
}