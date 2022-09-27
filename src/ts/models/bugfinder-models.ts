export class BugfinderConfiguration implements BugfinderViewModel {
  codes: CodeViewModel[] = [];
}

export enum ErrorType {
  UNDEFINED = "UNDEFINED",
  STATIC_SEMANTIC = "STATIC_SEMANTIC",
  SYNTAX = "SYNTAX",
  DYNAMIC_SEMANTIC = "DYNAMIC_SEMANTIC",
  LEXICAL = "LEXICAL",
  PRAGMATIC = "PRAGMATIC",
}

export interface BugfinderViewModel {
  codes: CodeViewModel[];
}

export interface CodeViewModel {
  words: WordViewModel[][];
}

export interface WordViewModel {
  correctValue: string;
  displayValue?: string;
  errorType?: ErrorType;
}
