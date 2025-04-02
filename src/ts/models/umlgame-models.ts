// TODO: implement, currently placeholders
export interface IUmlgameConfiguration {
  id?: string;
  graph: {};
}

export class UmlgameConfiguration implements IUmlgameConfiguration {
  id?: string;
  graph: {};
  public constructor(graph: {}) {
    this.graph = graph;
  }
}