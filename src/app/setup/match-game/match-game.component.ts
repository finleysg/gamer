import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Team } from '../../models/team';
import { Player } from '../../models/player';

@Component({
  selector: 'app-match-game',
  templateUrl: './match-game.component.html',
  styleUrls: ['./match-game.component.scss']
})
export class MatchGameComponent {

  @Input() teams: Team[];
  @Input() players: Player[];
  @Output() change = new EventEmitter();

  constructor() { }

  teamChange(id: string): void {
    this.change.emit(id);
  }
}
