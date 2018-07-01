import { Component, Input, OnChanges } from '@angular/core';
import { Round } from '../../models/round';
import { ScoringService } from '../scoring.service';
import { Game } from '../../models/game';

@Component({
  selector: 'app-progress-detail',
  templateUrl: './progress-detail.component.html',
  styleUrls: ['./progress-detail.component.scss']
})
export class ProgressDetailComponent implements OnChanges {

  @Input() round: Round;
  @Input() game: Game;
  results: string[];

  constructor(
    private scoringService: ScoringService
  ) { }

  ngOnChanges() {
    console.log(`OnChanges for game ${this.game.name}`);
    this.scoringService.getSummary(this.round, this.game)
      .subscribe(results => this.results = results);
  }
}
