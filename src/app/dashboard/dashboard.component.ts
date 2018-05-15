import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { RoundService } from '../services/round.service';
import { Router } from '@angular/router';
import { Round } from '../models/round';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  roundCode: string;
  user: User;

  constructor(
    private roundService: RoundService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.currentUser$.subscribe(user => this.user = user);
  }

  newRound(): void {
    this.router.navigate(['courses/select']);
  }

  findRound(): void {
    if (!this.roundCode || this.roundCode.length < 5) {
      return;
    }
    this.roundService.loadRound(this.roundCode).subscribe(
      (round: Round) => {
        if (round) {
          this.router.navigate(['setup', this.roundCode.toLowerCase(), 'summary']);
        } else {
          this.snackBar.open(`${this.roundCode} does not exist`, '', { duration: 5000 });
        }
      });
  }
}
