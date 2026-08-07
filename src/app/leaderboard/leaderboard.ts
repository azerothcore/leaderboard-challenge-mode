import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { SERVER_NAME, WEBSITE_URL } from 'config';
import { ChallengeModesService } from '../services/challenge-modes.service';
import {
  ChallengeModeCharacter,
  ChallengeStatus,
  DEFAULT_SORT_DIRECTION,
  LeaderboardSort,
  Paginated,
  SortDirection,
} from '../types/challenge-modes.types';
import { BRACKETS, CLASSES } from '../utils/wow';
import { LeaderboardTableComponent } from '../leaderboard-table/leaderboard-table';
import { PaginationComponent } from '../pagination/pagination';
import { SummaryStatsComponent } from '../summary-stats/summary-stats';

const PAGE_SIZE = 20;
const LAST_BRACKET_KEY = 'cm-last-bracket';

@Component({
  selector: 'app-leaderboard',
  imports: [
    DecimalPipe,
    FormsModule,
    LeaderboardTableComponent,
    PaginationComponent,
    SummaryStatsComponent,
  ],
  templateUrl: './leaderboard.html',
  styleUrl: './leaderboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaderboardComponent {
  private readonly service = inject(ChallengeModesService);

  protected readonly brackets = BRACKETS;
  protected readonly statuses = Object.values(ChallengeStatus);
  protected readonly classes = Object.entries(CLASSES).map(([id, name]) => ({
    id: Number(id),
    name,
  }));
  protected readonly serverName = SERVER_NAME;
  protected readonly challengeModesUrl = `${WEBSITE_URL}/en/challenge-modes/`;
  protected readonly pageSize = PAGE_SIZE;

  protected readonly challenge = signal(readLastBracket());
  protected readonly status = signal(ChallengeStatus.All);
  protected readonly classFilter = signal<number | null>(null);
  protected readonly nameFilter = signal('');
  protected readonly sort = signal(LeaderboardSort.Rank);
  protected readonly direction = signal(DEFAULT_SORT_DIRECTION[LeaderboardSort.Rank]);
  protected readonly page = signal(1);

  protected readonly loading = signal(true);
  protected readonly error = signal(false);

  private readonly requests = new Subject<void>();

  protected readonly stats = toSignal(this.service.getStats().pipe(catchError(() => of([]))), {
    initialValue: [],
  });

  protected readonly result = toSignal(
    this.requests.pipe(
      debounceTime(250),
      switchMap(() => {
        this.loading.set(true);
        this.error.set(false);

        return this.service
          .getLeaderboard({
            challenge: this.challenge(),
            status: this.status(),
            class: this.classFilter() ?? undefined,
            name: this.nameFilter().trim() || undefined,
            sort: this.sort(),
            direction: this.direction(),
            page: this.page(),
            limit: PAGE_SIZE,
          })
          .pipe(
            catchError(() => {
              this.error.set(true);
              return of({ data: [], total: 0 });
            }),
          );
      }),
      tap(() => this.loading.set(false)),
    ),
    { initialValue: { data: [], total: 0 } as Paginated<ChallengeModeCharacter> },
  );

  protected readonly characters = computed(() => this.result().data);
  protected readonly total = computed(() => this.result().total);
  protected readonly bracketLabel = computed(
    () => this.brackets.find((bracket) => bracket.value === this.challenge())?.label ?? '',
  );

  constructor() {
    effect(() => {
      // Touch every filter so any change re-triggers the request stream.
      this.challenge();
      this.status();
      this.classFilter();
      this.nameFilter();
      this.sort();
      this.direction();
      this.page();

      this.requests.next();
    });
  }

  protected selectBracket(value: number): void {
    if (value === this.challenge()) {
      return;
    }

    this.challenge.set(value);
    this.page.set(1);
    localStorage.setItem(LAST_BRACKET_KEY, String(value));
  }

  protected onStatusChange(value: string): void {
    this.status.set(value as ChallengeStatus);
    this.page.set(1);
  }

  protected onClassChange(value: string): void {
    this.classFilter.set(value ? Number(value) : null);
    this.page.set(1);
  }

  protected onNameChange(value: string): void {
    this.nameFilter.set(value);
    this.page.set(1);
  }

  protected onSortChange(sort: LeaderboardSort): void {
    if (sort === this.sort()) {
      this.direction.update((current) =>
        current === SortDirection.Asc ? SortDirection.Desc : SortDirection.Asc,
      );
    } else {
      this.sort.set(sort);
      this.direction.set(DEFAULT_SORT_DIRECTION[sort]);
    }

    this.page.set(1);
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected statusLabel(status: ChallengeStatus): string {
    return {
      [ChallengeStatus.All]: 'All runs',
      [ChallengeStatus.Active]: 'In progress',
      [ChallengeStatus.Completed]: 'Completed',
      [ChallengeStatus.Dead]: 'Fallen',
    }[status];
  }
}

function readLastBracket(): number {
  const stored = Number(localStorage.getItem(LAST_BRACKET_KEY));

  return BRACKETS.some((bracket) => bracket.value === stored) ? stored : BRACKETS[0].value;
}
