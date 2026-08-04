import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ChallengeModeStats } from '../types/challenge-modes.types';

@Component({
  selector: 'app-summary-stats',
  imports: [DecimalPipe],
  templateUrl: './summary-stats.html',
  styleUrl: './summary-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SummaryStatsComponent {
  readonly stats = input.required<ChallengeModeStats[]>();
  readonly challenge = input.required<number>();

  protected readonly current = computed(
    () =>
      this.stats().find((entry) => entry.challenge === this.challenge()) ?? {
        challenge: this.challenge(),
        total: 0,
        active: 0,
        completed: 0,
        dead: 0,
      },
  );

  protected readonly completionRate = computed(() => {
    const { total, completed } = this.current();

    return total === 0 ? 0 : (completed / total) * 100;
  });
}
