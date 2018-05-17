import { Player } from './player';

export interface GameResult {
  teamNumber: number;
  score: number;
  players: Player[];
  amount: number;
}

export class SkinResult implements GameResult {
  teamNumber: number;
  holeNumber: number;
  score: number;
  isNet: boolean;
  players: Player[];
  amount: number;

  fromJson(json: any): SkinResult {
    this.teamNumber = json.team_number;
    this.holeNumber = json.hole;
    this.score = json.score;
    this.isNet = json.is_net;
    this.amount = json.value;
    return this;
  }

  get playerNames(): string {
    return this.players.map(p => p.name).join(', ');
  }
}

export class BestBallResult implements GameResult {
  teamNumber: number;
  description: string;
  position: number;
  score: number;
  resultText: string;
  players: Player[];
  amount: number;

  fromJson(json: any): BestBallResult {
    this.teamNumber = json.team_number;
    this.description = json.description;
    this.position = json.position;
    this.score = json.total_score;
    this.resultText = json.result_text;
    this.amount = json.amount;
    return this;
  }
}
