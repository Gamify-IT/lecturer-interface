export interface ITowercrushConfiguration {
  id?: string;
  questions: ITowercrushQuestion[];
}

export interface ITowercrushQuestion {
  id?: string;
  text: string;
  rightAnswer: string;
  wrongAnswers: string[];
}

export class TowercrushConfiguration implements ITowercrushConfiguration {
  id?: string;
  questions: ITowercrushQuestion[];
  public constructor(questions: ITowercrushQuestion[]) {
    this.questions = questions;
  }
}
