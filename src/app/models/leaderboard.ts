import { Score } from './score';
import { Course } from './course';
import { Player } from './player';

export class Leaderboard {
  players: LeaderboardPlayer[];
  course: Course;

  constructor(course: Course) {
    this.course = course;
    this.players = [];
  }

  reload(players: Player[], scores: Score[]): void {
    this.players = [];
    players.forEach((player: Player) => {
      const playerScores = scores.filter(s => s.playerId === player.id);
      this.players.push(new LeaderboardPlayer(player, this.course, playerScores));
    });
  }

  get isComplete(): boolean {
    return this.players.every(p => p.isComplete);
  }
}

export class LeaderboardPlayer {
  name: string;
  courseHandicap: number;
  totalFrontScore: number;
  totalFrontNetScore: number;
  totalBackScore: number;
  totalBackNetScore: number;
  totalScore: number;
  totalNetScore: number;
  relativeScore: number;
  relativeNetScore: number;
  holes: LeaderboardHole[];

  constructor(player: Player, course: Course, scores: Score[]) {
    this.name = player.name;
    this.courseHandicap = course.calculateHandicap(player.handicapIndex);
    this.totalScore = 0;
    this.totalNetScore = 0;
    this.totalFrontScore = 0;
    this.totalFrontNetScore = 0;
    this.totalBackScore = 0;
    this.totalBackNetScore = 0;
    this.holes = course.holes.map(h => {
      const score = scores.find(s => s.holeId === h.id && s.playerId === player.id);
      const hole = new LeaderboardHole();
      hole.holeNumber = h.holeNumber;
      hole.par = h.par;
      hole.gross = !score ? 0 : score.grossScore;
      hole.bumps = h.getBumps(this.courseHandicap, course.numberOfHoles);
      hole.net = !score ? 0 : score.grossScore - hole.bumps;
      hole.noScore = !score ? false : score.noScore;
      this.totalScore += hole.gross;
      this.totalNetScore += hole.net;
      this.relativeScore += !score ? 0 : (hole.gross - h.par);
      this.relativeNetScore += !score ? 0 : (hole.net - h.par);
      if (h.holeNumber <= 9) {
        this.totalFrontScore += hole.gross;
        this.totalFrontNetScore += hole.net;
      } else {
        this.totalBackScore += hole.gross;
        this.totalBackNetScore += hole.net;
      }
      return hole;
    });
  }

  get isComplete(): boolean {
    return this.holes.every(h => h.gross > 0);
  }
}

export class LeaderboardHole {
  holeNumber: number;
  par: number;
  gross: number;
  net: number;
  noScore: boolean;
  bumps: number;

  get grossClass(): string {
    let scoreClass = 'par';
    if (this.noScore) {
      scoreClass = 'no-score';
    } else if (this.gross === 0) {
      scoreClass = 'empty';
    } else {
      if (this.gross + 2 <= this.par) {
        scoreClass = 'eagle';
      } else if (this.gross + 1 === this.par) {
        scoreClass = 'birdie';
      } else if (this.gross === this.par + 1) {
        scoreClass = 'bogey';
      } else if (this.gross > this.par + 1) {
        scoreClass = 'big-number';
      }
    }
    return scoreClass;
  }

  get netClass(): string {
    let scoreClass = 'par';
    if (this.noScore) {
      scoreClass = 'no-score';
    } else if (this.gross === 0) {
      scoreClass = 'empty';
    } else {
      if (this.net + 2 <= this.par) {
        scoreClass = 'eagle';
      } else if (this.net + 1 === this.par) {
        scoreClass = 'birdie';
      } else if (this.net === this.par + 1) {
        scoreClass = 'bogey';
      } else if (this.net > this.par + 1) {
        scoreClass = 'big-number';
      }
    }
    return scoreClass;
  }
}
