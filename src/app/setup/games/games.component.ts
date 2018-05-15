import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RoundService } from '../../services/round.service';
import { Round } from '../../models/round';
import { Game } from '../../models/game';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.css']
})
export class GamesComponent implements OnInit {

  round: Round;

  constructor(
    private roundService: RoundService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: {round: Round}) => {
        this.round = data.round;
      });
  }

  newGame(competitionType: string): void {
    this.roundService.createGame(competitionType).subscribe((game) => {
      this.router.navigate(['game', game.id], { relativeTo: this.route.parent });
    });
  }

  editGame(game: Game): void {
    this.router.navigate(['game', game.id], { relativeTo: this.route.parent });
  }

  onNext(): void {
    this.router.navigate(['/scoring', this.round.code, 'hole', 1, 1]);
  }
}
