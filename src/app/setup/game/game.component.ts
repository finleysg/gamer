import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { Team } from '../../models/team';
import { Round } from '../../models/round';
import { RoundService } from '../../services/round.service';
import { MatSnackBar } from '@angular/material';
import { Payout } from '../../models/payout';
import { clone } from 'lodash';
import { GameType, ScoringType } from '../../models/gameType';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  round: Round;
  game: Game;
  gameTypes: GameType[];
  scoringTypes: ScoringType[] = [];
  availablePlayers: any = {};
  gameHeader: string;

  constructor(
    private roundService: RoundService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: { round: Round }) => {
          this.round = data.round;
          this.route.params.subscribe((p: Params) => {
            this.game = this.round.selectGame(+p['id']);
            this.roundService.getGameTypes().subscribe(games => {
              this.gameTypes = games.filter(g => {
                if (this.game.competitionType === 'team') {
                  return g.isTeam;
                } else if (this.game.competitionType === 'match') {
                  return g.isMatch;
                } else {
                  return g.isIndividual;
                }
              });
              if (this.game.gameType) {
                this.updateGameType(this.game.gameType);
              }
              this.teamChange();
            });
            this.gameHeader = this.game.isMatch ? 'Match Details' : this.game.isTeam ? 'Team Game Details' : 'Individual Game Details';
          });
        }
      );
  }

  updateGameType(id: number): void {
    this.scoringTypes = this.gameTypes.find(t => t.id === id).scoringTypes;
    if (this.scoringTypes.length === 1) {
      this.game.scoringType = this.scoringTypes[0].id;
    }
    this.game.deriveName(this.gameTypes, this.round.players);
  }

  updateScoringType(): void {
    this.game.deriveName(this.gameTypes, this.round.players);
  }

  updateNetVsGross(): void {
    this.game.deriveName(this.gameTypes, this.round.players);
    this.round.calculateHandicaps(this.game);
  }

  delete(): void {
    // TODO: get confirmation
    this.roundService.deleteGame(this.game).subscribe(() => {
      this.location.back();
    });
  }

  save(): void {
    // TODO: remove any non-playing team members
    this.roundService.updateGame(this.game)
      .subscribe(() => {
        this.location.back();
      });
  }

  // in the context of a single team game, a player can only be on one team
  teamChange(): void {
    this.round.calculateHandicaps(this.game);
    this.game.deriveName(this.gameTypes, this.round.players);
  }
}
