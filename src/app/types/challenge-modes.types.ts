export enum ChallengeMode {
  Hardcore = 1,
  Ironman = 2,
  Bloodthirsty = 4,
}

export enum ChallengeStatus {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
  Dead = 'dead',
}

export interface ChallengeBracket {
  value: number;
  label: string;
  shortLabel: string;
  modes: ChallengeMode[];
}

export interface ChallengeModeCharacter {
  rank: number;
  guid: number;
  account: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  challenge: number;
  completed: number;
  dead: number;
  died_on: number | null;
  char_deleted: number;
  played_time: number | null;
}

export interface ChallengeModeStats {
  challenge: number;
  total: number;
  active: number;
  completed: number;
  dead: number;
}

export interface Paginated<T> {
  data: T[];
  total: number;
}

export interface LeaderboardQuery {
  challenge: number;
  status: ChallengeStatus;
  class?: number;
  name?: string;
  page: number;
  limit: number;
}
