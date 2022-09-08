export interface IChickenshockConfiguration {
  id?: string;
  questions: IChickenshockQuestion[];
  time: number;
}

export class ChickenshockConfiguration implements IChickenshockConfiguration {
  id?: string;
  questions: IChickenshockQuestion[];
  time: number;
  public constructor(questions: IChickenshockQuestion[], time: number) {
    this.questions = questions;
    this.time = time;
  }
}

export interface IChickenshockQuestion {
  id?: string;
  text: string;
  rightAnswer: string;
  wrongAnswers: string[];
}
