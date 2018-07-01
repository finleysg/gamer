import { Component, OnInit } from '@angular/core';
import { Round } from '../../models/round';
import { Leaderboard } from '../../models/leaderboard';
import { RoundService } from '../../services/round.service';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  round: Round;
  leaderboard: Leaderboard;
  side: string;
  net: boolean;

  constructor(
    private roundService: RoundService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('leaderboard init');
    this.route.params
      .subscribe((p: Params) => {
        if (this.roundService.hasRound(p['code'])) {
          this.roundService.currentRound.subscribe(round => {
            this.round = round;
            this.side = p['side'];
            this.roundService.getLeaderboard()
              .subscribe(leaderboard => {
                this.leaderboard = leaderboard;
              });
          });
        }
      });
  }

  changeSide(side: string): void {
    this.router.navigate(['/scoring', this.round.code, 'leaderboard', side, 0]);
  }

  gotoScores(): void {
    if (this.roundService.lastHole && this.roundService.currentGroup) {
      const currentHole = this.roundService.lastHole.holeNumber < this.round.course.numberOfHoles ?
        this.roundService.lastHole.holeNumber + 1 :
        this.roundService.lastHole.holeNumber;
      this.router.navigate(['/scoring', this.round.code, 'hole', this.roundService.currentGroup.number, currentHole]);
    } else if (this.roundService.currentGroup) {
      this.router.navigate(['/scoring', this.round.code, 'hole', this.roundService.currentGroup.number, 1]);
    } else {
      this.router.navigate(['/scoring', this.round.code, 'hole', 1, 1]);
    }
  }

  randomScores(): void {
    this.roundService.randomScores().subscribe(() => {
      this.roundService.getLeaderboard()
        .subscribe(leaderboard => {
          this.leaderboard = leaderboard;
        });
    });
  }

  closeRound(): void {
    // TODO: validate and get confirmation
    if (this.leaderboard.isComplete) {
      const requests = this.round.games.map(game => {
        return this.roundService.scoreGame(game);
      });
      requests.push(this.roundService.closeRound());
      forkJoin(requests).subscribe(() => {
        this.router.navigate(['/results', this.round.code, 'game', this.round.games[0].id]);
      });
    }
  }
}
