import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameResultComponent } from './game-result/game-result.component';
import { SkinsResultComponent } from './skins-result/skins-result.component';
import { BestBallResultComponent } from './best-ball-result/best-ball-result.component';
import { GameResultsComponent } from './game-results.component';
import { SharedModule } from '../shared/shared.module';
import { routing } from './results-routing.module';
import { MatTableModule } from '@angular/material';

@NgModule({
  imports: [
    SharedModule,
    routing,
    MatTableModule
  ],
  declarations: [GameResultsComponent, GameResultComponent, SkinsResultComponent, BestBallResultComponent]
})
export class ResultsModule { }
