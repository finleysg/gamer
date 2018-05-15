import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Round } from '../../models/round';
import { Group } from '../../models/group';
import { Hole } from '../../models/hole';
import { Score } from '../../models/score';
import { RoundService } from '../../services/round.service';

@Component({
  selector: 'app-group-score',
  templateUrl: './group-score.component.html',
  styleUrls: ['./group-score.component.css']
})
export class GroupScoreComponent implements OnInit {

  round: Round;
  group: Group;
  hole: Hole;
  scores: Score[];

  constructor(
    private roundService: RoundService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    console.log('group score init');
    this.route.data.subscribe(
        (data: {round: Round}) => {
          this.round = data.round;
          this.route.params.subscribe((p: Params) => {
            this.group = this.round.groups.find(g => g.number === +p['group']);
            this.hole = this.round.course.holes.find(h => h.holeNumber === +p['hole']);
            this.roundService.groupScoresByHole(this.group, this.hole)
              .subscribe(scores => {
                this.scores = scores;
              });
          });
      });
    // this.route.params
    //   .subscribe((p: Params) => {
    //     if (this.roundService.hasRound(p['code'])) {
    //       this.roundService.currentRound.subscribe(round => {
    //         this.round = round;
    //         this.group = round.groups.find(g => g.number === +p['group']);
    //         this.hole = round.course.holes.find(h => h.holeNumber === +p['hole']);
    //         this.roundService.groupScoresByHole(this.group, this.hole)
    //           .subscribe(scores => {
    //             this.scores = scores;
    //           });
    //       });
    //     } else {
    //       // TODO: would we support deep links here?
    //     }
    //   });
  }

  updateScore(score: Score, amount: number): void {
    score.grossScore += amount;
    score.dirty = true;
  }

  toggleNoScore(score: Score): void {
    score.noScore = !score.noScore;
    if (score.noScore) {
      score.grossScore = this.roundService.calculateEsc(score);
    }
    score.dirty = true;
  }

  getScoreClass(score: Score): string {
    let scoreClass = 'par';
    if (score.noScore) {
      scoreClass = 'no-score';
    } else if (score.grossScore === 0) {
      scoreClass = 'empty';
    } else {
      if (score.grossScore + 2 <= this.hole.par) {
        scoreClass = 'eagle';
      } else if (score.grossScore + 1 === this.hole.par) {
        scoreClass = 'birdie';
      } else if (score.grossScore === this.hole.par + 1) {
        scoreClass = 'bogey';
      } else if (score.grossScore > this.hole.par + 1) {
        scoreClass = 'big-number';
      }
    }
    return `score-box m-t-15 ${scoreClass}`;
  }

  nextHole(): void {
    if (this.hole.holeNumber < this.round.course.numberOfHoles) {
      this.roundService.saveScores(this.scores.filter(s => s.dirty));
      this.router.navigate(['/scoring', this.round.code, 'hole', this.group.number, this.hole.holeNumber + 1]);
    }
  }

  previousHole(): void {
    if (this.hole.holeNumber > 1) {
      this.roundService.saveScores(this.scores.filter(s => s.dirty));
      this.router.navigate(['/scoring', this.round.code, 'hole', this.group.number, this.hole.holeNumber - 1]);
    }
  }

  toLeaderboard(): void {
    this.roundService.saveScores(this.scores.filter(s => s.dirty));
    this.router.navigate(['leaderboard', this.round.code, 'front', 0]);
  }

  // TODO: use a deactivate guard to save?
  saveScores(): boolean {
    return true;
  }
}
