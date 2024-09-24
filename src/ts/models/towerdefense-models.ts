export interface ITowerDefenseConfiguration {
  id?: string;
  questions: ITowerDefenseQuestion[];
}

export class TowerDefenseConfiguration implements ITowerDefenseConfiguration {
  id?: string;
  questions: ITowerDefenseQuestion[];
  public constructor(questions: ITowerDefenseQuestion[]) {
    this.questions = questions;
  }
}

export interface ITowerDefenseQuestion {
  id?: string;
  text: string;
  correctAnswer: string;
  wrongAnswers: string[];
}
