import { Component, OnInit, Input } from '@angular/core';
import { Game } from '../../models/game';
import { Payout } from '../../models/payout';

@Component({
  selector: 'app-payouts',
  templateUrl: './payouts.component.html',
  styleUrls: ['./payouts.component.scss']
})
export class PayoutsComponent {

  @Input() game: Game;
  @Input() players: number;
  @Input() disabled: boolean;

  constructor() { }

  // Methods for payouts
  addPayout(): void {
    this.game.addPayout();
    this.game.defaultPercentages();
    this.game.calculatePayouts(this.players);
  }

  removePayout(): void {
    this.game.removePayout();
    this.game.defaultPercentages();
    this.game.calculatePayouts(this.players);
  }

  calculatePayouts(): void {
    this.game.calculatePayouts(this.players);
  }

  displayPlace(place: number): string {
    switch (place) {
      case 1:
        return '1st';
      case 2:
        return '2nd';
      case 3:
        return '3rd';
      default:
        return `${place}th`;
    }
  }
}
