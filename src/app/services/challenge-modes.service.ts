import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';
import { API_URL } from 'config';
import {
  ChallengeModeCharacter,
  ChallengeModeStats,
  ChallengeStatus,
  LeaderboardQuery,
  Paginated,
} from '../types/challenge-modes.types';

@Injectable({ providedIn: 'root' })
export class ChallengeModesService {
  private readonly http = inject(HttpClient);

  private readonly stats$ = this.http
    .get<ChallengeModeStats[]>(`${API_URL}/characters/challenge_modes/stats`)
    .pipe(shareReplay(1));

  getStats(): Observable<ChallengeModeStats[]> {
    return this.stats$;
  }

  getLeaderboard(query: LeaderboardQuery): Observable<Paginated<ChallengeModeCharacter>> {
    let params = new HttpParams()
      .set('challenge', query.challenge)
      .set('page', query.page)
      .set('limit', query.limit);

    if (query.status !== ChallengeStatus.All) {
      params = params.set('status', query.status);
    }

    if (query.class) {
      params = params.set('class', query.class);
    }

    if (query.name) {
      params = params.set('name', query.name);
    }

    return this.http.get<Paginated<ChallengeModeCharacter>>(
      `${API_URL}/characters/challenge_modes/leaderboard`,
      { params },
    );
  }
}
