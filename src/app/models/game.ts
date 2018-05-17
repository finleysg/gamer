import { Team } from './team';
import { Payout } from './payout';
import { Player } from './player';
import { GameType } from './gameType';

export class Game {
  id: number;
  name: string;
  isNet: boolean;
  competitionType: string;
  gameType: number;
  scoringType: number;
  numberOfScores: number;
  betValue: number;
  roundId: number;
  teams: Team[] = [];
  payouts: Payout[] = [];

  fromJson(json): Game {
    this.id = json.id;
    this.name = json.name;
    this.isNet = json.is_net;
    this.competitionType = json.competition_type;
    this.gameType = json.game_type;
    this.scoringType = json.scoring_type;
    this.numberOfScores = json.number_of_scores;
    this.betValue = json.bet_value;
    this.roundId = json.round;
    if (json.teams) {
      json.teams.forEach(team => {
        this.teams.push(new Team().fromJson(team));
      });
    }
    if (json.payouts) {
      json.payouts.forEach(payout => {
        this.payouts.push(new Payout().fromJson(payout));
      });
    }
    return this;
  }

  toJson(): any {
    const teams = this.teams.map(t => t.toJson());
    const payouts = this.payouts.map(p => p.toJson());
    return {
      'id': this.id,
      'name': this.name,
      'round': this.roundId,
      'is_net': this.isNet,
      'competition_type': this.competitionType,
      'game_type': this.gameType,
      'scoring_type': this.scoringType,
      'number_of_scores': this.numberOfScores,
      'bet_value': this.betValue,
      'teams': teams,
      'payouts': payouts
    };
  }

  get teamNumbers(): number[] {
    return this.teams.map(team => team.teamNumber)
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((n1: number, n2: number) => n1 - n2);
  }

  get isMatch(): boolean {
    return this.competitionType === 'match';
  }
  get isTeam(): boolean {
    return this.competitionType === 'team';
  }
  get isIndividual(): boolean {
    return this.competitionType === 'individual';
  }

  // TODO: better strategy for determining game type groupings
  get isSkins(): boolean {
    return this.gameType === 4 || this.gameType === 5;
  }

  get isBestBall(): boolean {
    return this.gameType === 2 || this.gameType === 6;
  }

  addPayout(): void {
    if (!this.payouts) {
      this.payouts = [];
    }
    const payout = new Payout();
    payout.place = this.payouts.length + 1;
    this.payouts.push(payout);
  }

  defaultPercentages(): void {
    const places = this.payouts.length;
    switch (places) {
      case 1:
        this.payouts[0].percentage = 100;
        break;
      case 2:
        this.payouts[0].percentage = 70;
        this.payouts[1].percentage = 30;
        break;
      case 3:
        this.payouts[0].percentage = 60;
        this.payouts[1].percentage = 25;
        this.payouts[2].percentage = 15;
        break;
      case 4:
        this.payouts[0].percentage = 50;
        this.payouts[1].percentage = 25;
        this.payouts[2].percentage = 15;
        this.payouts[3].percentage = 10;
        break;
      case 5:
        this.payouts[0].percentage = 40;
        this.payouts[1].percentage = 25;
        this.payouts[2].percentage = 15;
        this.payouts[3].percentage = 12.5;
        this.payouts[4].percentage = 7.5;
        break;
    }
  }

  calculatePayouts(players: number): void {
    const pot = this.betValue * players;
    if (pot > 0) {
      this.payouts.forEach(payout => {
        if (payout.percentage) {
          payout.amount = Math.floor(pot * (payout.percentage / 100));
        }
      });
    }
  }

  removePayout(): void {
    const idx = this.payouts.length - 1;
    this.payouts.splice(idx, 1);
  }

  private getPlayerName(players: Player[], playerId: number): string {
    const player = players.find(p => p.id === playerId);
    if (!player || !player.name) {
      return 'TBD';
    }
    return player.name;
  }

  private getGameName(gameTypes: GameType[]): string {
    const gt = gameTypes.find(t => t.id === this.gameType);
    return gt ? gt.name : 'New Game';
  }

  deriveName(gameTypes: GameType[], players: Player[] = null): void {
    let name = 'New Game';
    if (this.gameType) {
      const gameName = this.getGameName(gameTypes);
      if (this.competitionType.toLowerCase() === 'match') {
        // tslint:disable-next-line:max-line-length
        name = `${this.getPlayerName(players, this.teams[0].playerId)} vs ${this.getPlayerName(players, this.teams[1].playerId)} ${gameName}`;
      } else {
        name = `${this.isNet ? 'Net' : 'Gross'} ${gameName}`;
      }
    }
    this.name = name;
  }
}
