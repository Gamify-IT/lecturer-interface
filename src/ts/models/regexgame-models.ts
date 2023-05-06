export enum RegexStructure {
  SINGLE_CHARACTER,
  CHARACTER_SEQUENCE,
  ANY_SINGLE_CHARACTER,
  GROUP,
  CHARACTER_CLASS,
  CHARACTER_CLASS_INVERTED,
  DISJUNCTION,
  ANY_AMOUNT_QUANTIFIER,
  AT_LEAST_ONE_QUANTIFIER,
  OPTIONAL_QUANTIFIER,
  ABSOLUTE_NUMERIC_QUANTIFIER,
}

export const regexStructureDescriptions: Map<RegexStructure, string> = new Map([
  [RegexStructure.SINGLE_CHARACTER, "Single Characters"],
  [RegexStructure.CHARACTER_SEQUENCE, "Multiple Characters"],
  [RegexStructure.ANY_SINGLE_CHARACTER, "Any Character"],
  [RegexStructure.GROUP, "Groups"],
  [RegexStructure.CHARACTER_CLASS, "Character classes"],
  [RegexStructure.CHARACTER_CLASS_INVERTED, "Inverted character classes"],
  [RegexStructure.DISJUNCTION, "Disjunctions"],
  [RegexStructure.ANY_AMOUNT_QUANTIFIER, "Any amount quantifier"],
  [RegexStructure.AT_LEAST_ONE_QUANTIFIER, "At least one quantifier"],
  [RegexStructure.OPTIONAL_QUANTIFIER, "Optional quantifier"],
  [RegexStructure.ABSOLUTE_NUMERIC_QUANTIFIER, "Absolute numeric quantifiers"],
]);

export const defaultRegexStructures: Set<RegexStructure> = new Set([
  ...Object.entries(RegexStructure)
    .filter((entry) => typeof entry[1] == "number")
    .map((entry) => entry[1] as RegexStructure),
]);

export class RegexGameConfiguration {
  id?: string;

  allowedRegexStructures: Set<RegexStructure>;

  minimumCompletedRounds = 20;

  /**
   * how many seconds the user has to solve a given riddle
   * the timeout will accumulate over the riddles,
   * so the remaining time will be carried over to the next riddle
   */
  riddleTimeoutSeconds = 10;

  answerCount = 3;

  constructor(
    id: string | undefined,
    allowedRegexStructures: Set<RegexStructure>
  ) {
    this.id = id;
    this.allowedRegexStructures = allowedRegexStructures;
  }
}
