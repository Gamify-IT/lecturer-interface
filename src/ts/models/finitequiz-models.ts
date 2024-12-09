export interface IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
}

export interface IFinitequizQuestion {
  id?: string;
  text: string;
  rightAnswer: string;
  wrongAnswers: string[];
  images?: string[];
}

export class FinitequizConfiguration implements IFinitequizConfiguration {
  id?: string;
  questions: IFinitequizQuestion[];
  public constructor(questions: IFinitequizQuestion[]) {
    this.questions = questions;
  }
}
