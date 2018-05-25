import { NgModule } from '@angular/core';

import { ScoringRoutingModule } from './scoring-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GroupScoreComponent } from './group-score/group-score.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ScoringComponent } from './scoring.component';
import { JumpDialogComponent } from './jump-dialog/jump-dialog.component';
import { MatGridListModule, MatDialogModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    ScoringRoutingModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [
  ],
  entryComponents: [
    JumpDialogComponent
  ],
  declarations: [
    ScoringComponent,
    GroupScoreComponent,
    LeaderboardComponent,
    JumpDialogComponent
  ]
})
export class ScoringModule { }
