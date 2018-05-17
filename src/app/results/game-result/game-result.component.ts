import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoundService } from '../../services/round.service';
import { Round } from '../../models/round';
import { Game } from '../../models/game';
import { GameResult } from '../../models/results';

@Component({
  selector: 'app-game-result',
  templateUrl: './game-result.component.html',
  styleUrls: ['./game-result.component.scss']
})
export class GameResultComponent implements OnInit {

  round: Round;
  game: Game;
  results: GameResult[];

  constructor(
    private route: ActivatedRoute,
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.route.data
    .subscribe(
      (data: {round: Round}) => {
        this.round = data.round;
        this.game = this.round.selectGame(+this.route.snapshot.params['id']);
        this.roundService.getGameResult(this.game).subscribe(results => {
          this.results = results;
        });
      }
    );
  }

  refreshResults(): void {
    this.roundService.scoreGame(this.game).subscribe(results => {
      this.results = results;
    });
  }

  nextGame(): void {

  }

  previousGame(): void {

  }
}
