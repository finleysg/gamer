import { Component, OnInit } from '@angular/core';
import { RoundService } from '../../services/round.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Round } from '../../models/round';
import { DialogService } from '../../shared/dialog.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {

  round: Round;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roundService: RoundService,
    private dialogService: DialogService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: { round: Round }) => {
          this.round = data.round;
        });
  }

  goToResults(): void {
    if (this.round.hasGames) {
      const firstGame = this.round.games[0];
      this.router.navigate(['/results', this.round.code, 'game', firstGame.id]);
    }
  }

  closeRound(): void {
    if (this.round.hasGames && !this.round.completed) {
    this.dialogService
      .confirm('This round is over and the scores are correct?',
        'Close Round',
        'Yes', 'Cancel').subscribe(confirmation => {
          if (confirmation) {
            this.roundService.closeRound().subscribe(() => {
              this.snackbar.open('The round is closed', null, {duration: 3000});
            });
          }
        });
      }
    }
}
