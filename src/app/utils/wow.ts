import { ChallengeBracket, ChallengeMode } from '../types/challenge-modes.types';

export const CLASSES: Record<number, string> = {
  1: 'Warrior',
  2: 'Paladin',
  3: 'Hunter',
  4: 'Rogue',
  5: 'Priest',
  6: 'Death Knight',
  7: 'Shaman',
  8: 'Mage',
  9: 'Warlock',
  11: 'Druid',
};

export const RACES: Record<number, string> = {
  1: 'Human',
  2: 'Orc',
  3: 'Dwarf',
  4: 'Night Elf',
  5: 'Undead',
  6: 'Tauren',
  7: 'Gnome',
  8: 'Troll',
  10: 'Blood Elf',
  11: 'Draenei',
};

const HORDE_RACES = new Set([2, 5, 6, 8, 10]);

export function getFaction(race: number): 'alliance' | 'horde' {
  return HORDE_RACES.has(race) ? 'horde' : 'alliance';
}

export function getClassName(classId: number): string {
  return CLASSES[classId] ?? 'Unknown';
}

export function getRaceName(raceId: number): string {
  return RACES[raceId] ?? 'Unknown';
}

const MODE_LABELS: Record<ChallengeMode, string> = {
  [ChallengeMode.Hardcore]: 'Hardcore',
  [ChallengeMode.Ironman]: 'Ironman',
  [ChallengeMode.Bloodthirsty]: 'Bloodthirsty',
};

function modesOf(bitmask: number): ChallengeMode[] {
  return [ChallengeMode.Hardcore, ChallengeMode.Ironman, ChallengeMode.Bloodthirsty].filter(
    (mode) => (bitmask & mode) !== 0,
  );
}

// Every combination is its own competition: the module ranks each bitmask separately,
// and in game a challenger may only party with characters running the same combination.
export const BRACKETS: ChallengeBracket[] = [1, 2, 4, 3, 5, 6, 7].map((value) => {
  const modes = modesOf(value);

  return {
    value,
    modes,
    label: modes.map((mode) => MODE_LABELS[mode]).join(' + '),
    shortLabel: value === 7 ? 'All three' : modes.map((mode) => MODE_LABELS[mode]).join(' + '),
  };
});

export function isHardcore(bitmask: number): boolean {
  return (bitmask & ChallengeMode.Hardcore) !== 0;
}

export function formatPlayedTime(seconds: number | null): string {
  if (seconds === null || seconds === undefined) {
    return '—';
  }

  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}m`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}
