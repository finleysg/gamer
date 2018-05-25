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
  version: number;

  constructor(
    private route: ActivatedRoute,
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.version = 1; // i.e. version of the results, which may be refreshed/updated
    this.route.data
    .subscribe(
      (data: {round: Round}) => {
        this.round = data.round;
        this.game = this.round.selectGame(+this.route.snapshot.params['id']);
      }
    );
  }

  nextGame(): void {

  }

  previousGame(): void {

  }
}
