import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { GroupScoreComponent } from './group-score/group-score.component';
import { ScoringComponent } from './scoring.component';
import { RoundResolverService } from '../services/round-resolver.service';
import { ProgressComponent } from './progress/progress.component';

const routes: Routes = [
  { path: '', component: ScoringComponent, children: [
    { path: ':code', children: [
      { path: 'leaderboard/:side/:id', resolve: { round: RoundResolverService }, component: LeaderboardComponent },
      { path: 'hole/:group/:hole', resolve: { round: RoundResolverService }, component: GroupScoreComponent },
      { path: 'progress', resolve: { round: RoundResolverService }, component: ProgressComponent }
    ]}
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScoringRoutingModule { }
