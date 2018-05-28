import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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
  gameIndex: number;
  version: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roundService: RoundService
  ) { }

  ngOnInit() {
    this.version = 1; // i.e. version of the results, which may be refreshed/updated
    this.route.data
    .subscribe(
      (data: {round: Round}) => {
        this.round = data.round;
        this.route.params.subscribe((p: Params) => {
          this.game = this.round.selectGame(+p['id']);
          this.gameIndex = this.round.games.findIndex(g => g.id === this.game.id);
        });
      });
  }

  nextGame(): void {
    if (this.gameIndex < this.round.games.length - 1) {
      this.router.navigate(['game', this.round.games[this.gameIndex + 1].id], {relativeTo: this.route.parent});
    } else {
      this.router.navigate(['game', this.round.games[0].id], {relativeTo: this.route.parent});
    }
  }

  previousGame(): void {
    if (this.gameIndex > 0) {
      this.router.navigate(['game', this.round.games[this.gameIndex - 1].id], {relativeTo: this.route.parent});
    } else {
      this.router.navigate(['game', this.round.games[this.round.games.length - 1].id], {relativeTo: this.route.parent});
    }
  }
}
