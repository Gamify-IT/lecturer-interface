export interface IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
}

export interface IFinitequizQuestion {
  id?: string;
  text: string;
  rightAnswer: string;
  wrongAnswers: string[];
  uuid: string;
}

export class FinitequizConfiguration implements IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
  public constructor(questions: IFinitequizQuestion[]) {
    this.questions = questions;
  }
}
