import { Component, OnChanges, Input } from '@angular/core';
import { BestBallResult } from '../../models/results';
import { Game } from '../../models/game';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-best-ball-result',
  templateUrl: './best-ball-result.component.html',
  styleUrls: ['./best-ball-result.component.scss']
})
export class BestBallResultComponent implements OnChanges {

  @Input() game: Game;
  results: BestBallResult[];

  constructor(
    private roundService: RoundService
  ) { }

  ngOnChanges() {
    this.roundService.getBestBallResults(this.game).subscribe(results => {
      this.results = results;
    });
  }

  refreshResults(): void {
    this.roundService.scoreGame(this.game).subscribe(results => {
      this.results = results as BestBallResult[];
    });
  }
}
