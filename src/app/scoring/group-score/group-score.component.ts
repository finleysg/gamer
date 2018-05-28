import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Round } from '../../models/round';
import { Group } from '../../models/group';
import { Hole } from '../../models/hole';
import { Score } from '../../models/score';
import { RoundService } from '../../services/round.service';
import { MatDialog } from '@angular/material';
import { JumpDialogComponent } from '../jump-dialog/jump-dialog.component';

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
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    console.log('group score init');
    this.route.data.subscribe(
      (data: { round: Round }) => {
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
  }

  updateScore(score: Score, amount: number): void {
    if (this.round.canEdit) {
      score.grossScore += amount;
      score.dirty = true;
    }
  }

  toggleNoScore(score: Score): void {
    if (this.round.canEdit) {
      score.noScore = !score.noScore;
      if (score.noScore) {
        score.grossScore = this.roundService.calculateEsc(score);
      }
      score.dirty = true;
    }
  }

  // getScoreClass(score: Score): string {
  //   let scoreClass = 'par';
  //   if (score.noScore) {
  //     scoreClass = 'no-score';
  //   } else if (score.grossScore === 0) {
  //     scoreClass = 'empty';
  //   } else {
  //     if (score.grossScore + 2 <= this.hole.par) {
  //       scoreClass = 'eagle';
  //     } else if (score.grossScore + 1 === this.hole.par) {
  //       scoreClass = 'birdie';
  //     } else if (score.grossScore === this.hole.par + 1) {
  //       scoreClass = 'bogey';
  //     } else if (score.grossScore > this.hole.par + 1) {
  //       scoreClass = 'big-number';
  //     }
  //   }
  //   return `score-box m-t-15 ${scoreClass}`;
  // }

  nextHole(): void {
    if (this.hole.holeNumber < this.round.course.numberOfHoles) {
      if (this.round.canEdit) {
        this.roundService.saveScores(this.scores.filter(s => s.dirty));
      }
      this.router.navigate(['/scoring', this.round.code, 'hole', this.group.number, this.hole.holeNumber + 1]);
    }
  }

  previousHole(): void {
    if (this.hole.holeNumber > 1) {
      if (this.round.canEdit) {
        this.roundService.saveScores(this.scores.filter(s => s.dirty));
      }
      this.router.navigate(['/scoring', this.round.code, 'hole', this.group.number, this.hole.holeNumber - 1]);
    }
  }

  toLeaderboard(): void {
    if (this.round.canEdit) {
      this.roundService.saveScores(this.scores.filter(s => s.dirty));
    }
    const side = (this.hole.holeNumber < 10) ? 'front' : 'back';
    this.router.navigate(['/scoring', this.round.code, 'leaderboard', side, 0]);
  }

  jumpToHole(): void {
    const dialogRef = this.dialog.open(JumpDialogComponent, {
      width: '240px',
      data: { holes: this.round.course.holes, group: this.group }
    });

    dialogRef.afterClosed().subscribe(hole => {
      if (this.round.canEdit) {
        this.roundService.saveScores(this.scores.filter(s => s.dirty));
      }
      this.router.navigate(['/scoring', this.round.code, 'hole', this.group.number, hole]);
    });
  }

  // TODO: use a deactivate guard to save?
  saveScores(): boolean {
    if (this.round.canEdit) {
      this.roundService.saveScores(this.scores.filter(s => s.dirty));
    }
    return true;
  }
}
