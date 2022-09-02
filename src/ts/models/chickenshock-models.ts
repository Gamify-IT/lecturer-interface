export interface IChickenshockConfiguration {
  id?: string;
  questions: IChickenshockQuestion[];
}

export class ChickenshockConfiguration implements IChickenshockConfiguration {
  id?: string;
  questions: IChickenshockQuestion[];
  public constructor(questions: IChickenshockQuestion[]) {
    this.questions = questions;
  }
}

export interface IChickenshockQuestion {
  id?: string;
  text: string;
  rightAnswer: string;
  wrongAnswers: string[];
}
