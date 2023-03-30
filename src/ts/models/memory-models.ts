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
  public constructor(public card1: IMemoryCard, public card2: IMemoryCard) {}
}

export class MemoryCard implements IMemoryCard {
  id?: string;
  public constructor(public content: string, public type: MemoryCardType) {}
}

export enum MemoryCardType {
  IMAGE = "IMAGE",
  TEXT = "TEXT",
  MARKDOWN = "MARKDOWN",
}
