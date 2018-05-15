import { Hole } from './hole';
import { Player } from './player';

export class Score {
  id: number;
  roundId: number;
  playerId: number;
  holeId: number;
  grossScore: number;
  netScore: number;
  teamNumber: number;
  player: Player;
  hole: Hole;
  noScore: boolean;
  proxy: boolean;
  dirty: boolean;

  fromJson(json: any): Score {
    this.id = json.id;
    this.roundId = json.round;
    this.playerId = json.player;
    this.holeId = json.hole;
    this.grossScore = json.gross_score;
    this.teamNumber = json.team_number;
    this.noScore = json.no_score;
    this.proxy = json.proxy;
    return this;
  }

  toJson(): any {
    return {
      'id': this.id,
      'round': this.roundId,
      'player': this.playerId,
      'hole': this.holeId,
      'gross_score': this.grossScore,
      'team_number': this.teamNumber,
      'no_score': this.noScore,
      'proxy': this.proxy
    };
  }
}

export class Skin {
  hole: Hole;
  player: Player;
  score: number;
  value: number;

  constructor(score: Score, value: number, isNet: boolean = false) {
    this.hole = score.hole;
    this.player = score.player;
    this.score = isNet ? score.netScore : score.grossScore;
    this.value = value;
  }
}
