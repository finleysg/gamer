import { Component, OnInit, Input } from '@angular/core';
import { Team } from '../../models/team';
import { Player } from '../../models/player';

@Component({
  selector: 'app-individual-game',
  templateUrl: './individual-game.component.html',
  styleUrls: ['./individual-game.component.scss']
})
export class IndividualGameComponent {

  @Input() teams: Team[];
  @Input() allPlayers: Player[];
  @Input() disabled: boolean;

  constructor() { }

  playerName(playerId: number): string {
    const player = this.allPlayers.find(p => p.id === playerId);
    if (!player || !player.name) {
      return 'TBD';
    }
    return player.name;
  }
}
