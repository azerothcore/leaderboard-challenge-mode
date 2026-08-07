import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ChallengeModeCharacter,
  LeaderboardSort,
  SortDirection,
} from '../types/challenge-modes.types';
import { PlayerIconsComponent } from '../player-icons/player-icons';
import {
  formatPlayedTime,
  getClassName,
  getFaction,
  getRaceName,
  isHardcore,
} from '../utils/wow';

type RunState = 'completed' | 'dead' | 'active';

@Component({
  selector: 'app-leaderboard-table',
  imports: [DatePipe, PlayerIconsComponent],
  templateUrl: './leaderboard-table.html',
  styleUrl: './leaderboard-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardTableComponent {
  readonly characters = input.required<ChallengeModeCharacter[]>();
  readonly challenge = input.required<number>();
  readonly sort = input.required<LeaderboardSort>();
  readonly direction = input.required<SortDirection>();

  readonly sortChange = output<LeaderboardSort>();

  protected readonly sortOptions = LeaderboardSort;

  protected readonly formatPlayedTime = formatPlayedTime;
  protected readonly getClassName = getClassName;
  protected readonly getFaction = getFaction;
  protected readonly getRaceName = getRaceName;

  protected state(character: ChallengeModeCharacter): RunState {
    if (character.completed) {
      return 'completed';
    }

    return character.dead ? 'dead' : 'active';
  }

  protected stateLabel(character: ChallengeModeCharacter): string {
    return { completed: 'Completed', dead: 'Fallen', active: 'In progress' }[
      this.state(character)
    ];
  }

  // The date the run ended: when it was won for finishers, when the character died
  // otherwise. Completed runs may also carry a last-death date in challenges where
  // dying is not final, but the completion is the one worth showing.
  protected runDate(character: ChallengeModeCharacter): Date | null {
    const timestamp = character.completed ? character.completed_on : character.died_on;

    return timestamp ? new Date(timestamp * 1000) : null;
  }

  // Only Hardcore runs end permanently on death, so the death date is the run's epitaph
  // there; elsewhere it is just the last time the character died.
  protected runDateLabel(character: ChallengeModeCharacter): string {
    if (character.completed) {
      return 'Completed on';
    }

    return isHardcore(character.challenge) ? 'Died on' : 'Last died on';
  }

  protected ariaSort(column: LeaderboardSort): 'ascending' | 'descending' | 'none' {
    if (this.sort() !== column) {
      return 'none';
    }

    return this.direction() === SortDirection.Asc ? 'ascending' : 'descending';
  }

  protected sortIndicator(column: LeaderboardSort): string {
    if (this.sort() !== column) {
      return '';
    }

    return this.direction() === SortDirection.Asc ? '▲' : '▼';
  }
}
