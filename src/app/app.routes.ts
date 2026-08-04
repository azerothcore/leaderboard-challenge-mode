import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./leaderboard/leaderboard').then((m) => m.LeaderboardComponent),
  },
  { path: '**', redirectTo: '' },
];
