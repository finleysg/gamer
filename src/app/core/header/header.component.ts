import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../models/user';
import { Round } from '../../models/round';
import { UserService } from '../../services/user.service';
import { RoundService } from '../../services/round.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() toggleNotificationSidenav = new EventEmitter<void>();

  currentUser: User;
  currentRound: Round;

  constructor(
    private userService: UserService,
    private roundService: RoundService,
    private router: Router
  ) {
    this.userService.currentUser$.subscribe(user => {
      console.log(`user change: authenticated = ${user.isAuthenticated}`);
      this.currentUser = user;
    });
    this.roundService.currentRound.subscribe(round => {
      console.log(`round change: round = ${round && round.code}`);
      this.currentRound = round;
    });
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
