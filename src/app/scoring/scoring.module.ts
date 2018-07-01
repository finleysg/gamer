import { NgModule } from '@angular/core';

import { ScoringRoutingModule } from './scoring-routing.module';
import { SharedModule } from '../shared/shared.module';
import { GroupScoreComponent } from './group-score/group-score.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';
import { ScoringComponent } from './scoring.component';
import { JumpDialogComponent } from './jump-dialog/jump-dialog.component';
import { MatGridListModule, MatDialogModule } from '@angular/material';
import { ProgressComponent } from './progress/progress.component';
import { ScoringService } from './scoring.service';
import { ProgressDetailComponent } from './progress-detail/progress-detail.component';

@NgModule({
  imports: [
    SharedModule,
    ScoringRoutingModule,
    MatGridListModule,
    MatDialogModule
  ],
  providers: [
    ScoringService
  ],
  entryComponents: [
    JumpDialogComponent
  ],
  declarations: [
    ScoringComponent,
    GroupScoreComponent,
    LeaderboardComponent,
    JumpDialogComponent,
    ProgressComponent,
    ProgressDetailComponent
  ]
})
export class ScoringModule { }
