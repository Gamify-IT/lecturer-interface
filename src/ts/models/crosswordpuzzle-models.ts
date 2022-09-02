export interface ICrosswordpuzzleConfiguration {
  id?: string;
  name: string;
  questions: ICrosswordpuzzleQuestion[];
}

export interface ICrosswordpuzzleQuestion {
  id?: string;
  questionText: string;
  answer: string;
}

export class CrosswordpuzzleConfiguration
  implements ICrosswordpuzzleConfiguration
{
  id?: string;
  name: string;
  questions: ICrosswordpuzzleQuestion[];

  public constructor(name: string, questions: ICrosswordpuzzleQuestion[]) {
    this.name = name;
    this.questions = questions;
  }
}

export class CrosswordpuzzleQuestion implements ICrosswordpuzzleQuestion {
  id?: string;
  questionText: string;
  answer: string;

  public constructor(questionText: string, answer: string) {
    this.questionText = questionText;
    this.answer = answer;
  }
}
