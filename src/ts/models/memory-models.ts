export interface IMemoryConfiguration {
  id?: string;
  pairs: IMemoryCardPair[];
}

export interface IMemoryCardPair {
  id?: string;
  card1: IMemoryCard;
  card2: IMemoryCard;
}
export interface IMemoryCard {
  id?: string;
  content: string;
  type: MemoryCardType;
}

export interface MemoryCard {
  id?: string;
  content: string;
  type: MemoryCardType;
}

export class MemoryConfiguration implements IMemoryConfiguration {
  id?: string;
  pairs: IMemoryCardPair[];
  public constructor(pairs: IMemoryCardPair[]) {
    this.pairs = pairs;
  }
}

export class MemoryCardPair implements IMemoryCardPair {
  id?: string;
  public card1: IMemoryCard;
  public card2: IMemoryCard;
  public constructor(card1: IMemoryCard, card2: IMemoryCard) {
    this.card1 = card1;
    this.card2 = card2;
  }
}

export class MemoryCard implements IMemoryCard {
  id?: string;
  content: string;
  type: MemoryCardType;
  public constructor(content: string, type: MemoryCardType) {
    this.content = content;
    this.type = type;
  }
}

export enum MemoryCardType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  MARKDOWN = "MARKDOWN",
}
