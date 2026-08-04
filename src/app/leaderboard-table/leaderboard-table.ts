import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ChallengeModeCharacter } from '../types/challenge-modes.types';
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

  // Only Hardcore runs end permanently on death, so the death date is the run's epitaph
  // there; elsewhere it is just the last time the character died.
  protected deathTooltip(character: ChallengeModeCharacter): string {
    return isHardcore(character.challenge) ? 'Died on' : 'Last died on';
  }

  protected toDate(timestamp: number | null): Date | null {
    return timestamp ? new Date(timestamp * 1000) : null;
  }
}
