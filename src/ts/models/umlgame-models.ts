// TODO: implement, currently placeholders
export interface IUmlGameConfiguration {
  id?: string;
  graph: {};
}

export class UmlGameConfiguration implements IUmlGameConfiguration {
  id?: string;
  graph: {};
  public constructor(graph: {}) {
    this.graph = graph;
  }
}