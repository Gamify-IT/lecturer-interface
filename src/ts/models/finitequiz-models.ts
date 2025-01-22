export interface IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
}

export interface IWrongAnswer {
  uuid: string;
  text: string;
}

export interface IFinitequizQuestion {
  id?: string;
  text: string;
  rightAnswer: string[];
  wrongAnswers: IWrongAnswer[];
  uuid: string;
}

export class FinitequizConfiguration implements IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
  public constructor(questions: IFinitequizQuestion[]) {
    this.questions = questions;
  }
}
