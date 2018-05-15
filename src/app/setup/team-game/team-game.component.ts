import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Round } from '../../models/round';
import { Game } from '../../models/game';
import { Team } from '../../models/team';
import { Player } from '../../models/player';

@Component({
  selector: 'app-team-game',
  templateUrl: './team-game.component.html',
  styleUrls: ['./team-game.component.scss']
})
export class TeamGameComponent implements OnChanges {

  @Input() round: Round;
  @Input() game: Game;
  @Output() change = new EventEmitter();

  teamNumbers: number[] = [];

  constructor() { }

  teamChange(id: string): void {
    // TOOD: ensure this is a valid selection/change
    this.change.emit(id);
  }

  ngOnChanges(): void {
    this.updateTeamNumbers();
  }

  updateTeamNumbers(): void {
    this.teamNumbers = this.game.teams.map(team => team.teamNumber)
      .filter((value, index, self) => self.indexOf(value) === index);
  }

  // Methods for team games
  assignByGroups(): void {
    this.round.createDefaultTeams(this.game);
    this.updateTeamNumbers();
    this.teamChange('');
  }

  addTeam(): void {
    let teamNumber = 1;
    if (this.teamNumbers.length > 0) {
      teamNumber = Math.max(...this.teamNumbers) + 1;
    }
    const team1 = new Team();
    team1.teamNumber = teamNumber;
    this.game.teams.push(team1);
    const team2 = new Team();
    team2.teamNumber = teamNumber;
    this.game.teams.push(team2);
    this.updateTeamNumbers();
    this.teamChange('');
  }

  removeTeam(teamNumber: number): void {
    // const maxNumber = Math.max(...this.teamNumbers); // spread operator converts to distinct args
    if (teamNumber) {
      for (let i = this.game.teams.length - 1; i >= 0; i--) {
        if (this.game.teams[i].teamNumber === teamNumber) {
          this.game.teams.splice(i, 1);
        }
      }
      this.updateTeamNumbers();
      this.teamChange('');
      this.round.calculateHandicaps(this.game);
    }
  }

  addPlayer(teamNumber: number): void {
    const newTeam = new Team();
    newTeam.teamNumber = teamNumber;
    this.game.teams.push(newTeam);
  }

  removePlayer(team: Team): void {
    const idx = this.game.teams.findIndex(t => t.localId === team.localId);
    this.game.teams.splice(idx, 1);
    this.teamChange('');
    this.round.calculateHandicaps(this.game);
  }
}
