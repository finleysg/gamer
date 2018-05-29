import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../services/round.service';
import { Round } from '../../models/round';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-rounds',
  templateUrl: './my-rounds.component.html',
  styleUrls: ['./my-rounds.component.scss']
})
export class MyRoundsComponent implements OnInit {

  rounds: Round[];

  constructor(
    private roundService: RoundService,
    private router: Router
  ) { }

  ngOnInit() {
    this.roundService.myRounds().subscribe(rounds => {
      this.rounds = rounds.sort(function (a, b) {
        if (a.created.isBefore(b.created)) {
          return 1;
        }
        if (a.created.isAfter(b.created)) {
          return -1;
        }
        return 0;
      });
    });
  }

  openRound(round: Round): void {
    this.router.navigate(['/setup', round.code, 'summary']);
  }
}
