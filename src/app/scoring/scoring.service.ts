import { Injectable } from '@angular/core';
import { BaseService } from '../services/base.service';
import { HttpClient } from '@angular/common/http';
import { Game } from '../models/game';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Round } from '../models/round';
import { RoundService } from '../services/round.service';
import { GameType } from '../models/gameType';

@Injectable()
export class ScoringService extends BaseService {

  private resource = `${this.baseUrl}/game`;
  private round: Round;
  private gameTypes: GameType[];

  constructor(
    private http: HttpClient,
    private roundService: RoundService
  ) {
    super();
    this.roundService.getGameTypes().subscribe(gt => this.gameTypes = gt);
  }

  getSummary(round: Round, game: Game): Observable<string[]> {
    this.round = round;
    console.log(`getSummary for game ${game.name}`);
    return this.http.get(`${this.resource}/${game.id}/summary`).pipe(
      map((summary: any) => {
        console.log(`mapping response for game ${game.name}`);
        return this.interpretSummary(game, summary);
      })
    );
  }

  interpretSummary(game: Game, summary: any[]): string[] {
    if (this.scoringTypeName(game) === 'Nassau') {
      return this.nassauSummary(game, summary);
    } else if (this.scoringTypeName(game) === 'Closeout') {
      return this.closeoutSummary(game, summary);
    } else if (this.scoringTypeName(game) === 'Match') {
      return [this.matchSummary(game, summary)];
    } else if (this.gameTypeName(game) === 'Skins') {
      return this.skinsSummary(game, summary);
    } else if (this.gameTypeName(game) === 'Canadian Skins') {
      return this.skinsSummary(game, summary);
    } else if (this.scoringTypeName(game) === 'Payouts') {
      return this.payoutSummary(game, summary);
    } else {
      return [];
    }
  }

  skinsSummary(game: Game, summary: any[]): string[] {
    return summary.map(s => {
      if (s[3]) {
        return `#${s[0]}: ${s[1]} (net ${s[2]})`;
      } else {
        return `#${s[0]}: ${s[1]} (${s[2]})`;
      }
    });
  }

  matchSummary(game: Game, results: any[]): string {
    const leader = results[0] as number;
    const lead = results[1] as number;
    const remaining = results[2] as number;
    if (leader === 0) {
      return 'All Square';
    }
    if (lead > remaining) {
      if (remaining === 0) {
        return `${this.round.teamMembers(game, leader)} wins ${lead} up`;
      } else {
        return `${this.round.teamMembers(game, leader)} wins ${lead} and ${remaining}`;
      }
    }
    if (lead === remaining) {
      return `${this.round.teamMembers(game, leader)} is dormie ${lead}`;
    }
    return `${this.round.teamMembers(game, leader)} is ${lead} up`;
  }

  nassauSummary(game: Game, summary: any[]): string[] {
    const results = [];
    results.push(`Front: ${this.matchSummary(game, summary[0])}`);
    results.push(`Back: ${this.matchSummary(game, summary[1])}`);
    results.push(`Total: ${this.matchSummary(game, summary[2])}`);
    return results;
  }

  closeoutSummary(game: Game, summary: any[]): string[] {
    return summary.map(s => this.matchSummary(game, s));
  }

  payoutSummary(game: Game, summary: any[]): string[] {
    return summary.map(s => {
      return `${s[1]}: ${this.round.teamMembers(game, s[0])}`;
    });
  }

  gameTypeName(game: Game): string {
    const gameType = this.gameTypes.find(t => t.id === game.gameType);
    return gameType.name;
  }

  scoringTypeName(game: Game): string {
    const gameType = this.gameTypes.find(t => t.id === game.gameType);
    const scoringType = gameType.scoringTypes.find(s => s.id === game.scoringType);
    return scoringType.name;
  }
}
