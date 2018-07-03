import { Course } from './course';
import { Group } from './group';
import { Game } from './game';
import { Player } from './player';
import { Team } from './team';
import * as moment from 'moment';
import { isNumber } from 'util';

export class Round {
  id: number;
  code: string;
  created: moment.Moment;
  played: moment.Moment;
  completed: boolean;
  course: Course;
  groups: Group[] = [];
  games: Game[] = [];
  currentState: RoundStateEnum;
  readonly: boolean;

  get players(): Player[] {
    const players = [];
    this.groups.forEach((group: Group) => {
      group.players.forEach((player: Player) => players.push(player));
    });
    return players;
  }

  get canEdit(): boolean {
    return !this.completed && !this.readonly;
  }

  get hasGroup(): boolean {
    return this.groups && this.groups.length > 0;
  }

  get hasGames(): boolean {
    return this.games && this.games.length > 0;
  }

  newGroup(): void {
    const group = new Group();
    group.roundId = this.id;
    group.number = this.groups.length + 1;
    for (let i = 0; i < 4; i++) {
      group.players.push(new Player());
      group.players[i].localId = Math.random();
    }
    this.groups.push(group);
  }

  removeGroup(groupNumber: number): Group {
    const idx = this.groups.findIndex(g => g.number === groupNumber);
    const removed = this.groups.splice(idx, 1);
    let i = 1;
    this.groups.forEach(g => {
      g.number = i;
      i += 1;
    });
    return removed[0];
  }

  addPlayer(group: Group): void {
    const player = new Player();
    player.localId = Math.random();
    group.players.push(player);
  }

  removePlayer(group, player): void {
    const thisGroup = this.groups.find(g => g.number === group.number);
    if (thisGroup) {
      const idx = thisGroup.players.findIndex(p => {
        if (player.id) {
          return p.id === player.id;
        } else if (player.localId) {
          return p.localId === player.localId;
        } else {
          return false;
        }
      });
      if (idx >= 0) {
        thisGroup.players.splice(idx, 1);
      }
    } else {
      throw new Error(`Cannot remove player - no group provided with #${group.id}`);
    }
  }

  addGame(game: Game): void {
    this.games.push(game);
  }

  updateGame(game: Game): void {
    const idx = this.games.findIndex(g => g.id === game.id);
    this.games[idx] = game;
  }

  removeGame(game: Game): void {
    const idx = this.games.findIndex(g => g.id === game.id);
    this.games.splice(idx, 1);
  }

  teamMembers(game: Game, teamNumber: number): string {
    const playerIds = game.teams.filter(t => t.teamNumber === teamNumber).map(t => t.playerId);
    const players = this.players.filter(p => playerIds.indexOf(p.id) >= 0);
    return players.map(p => p.name).join(', ');
  }

  selectGame(id: number): Game {
    const game = this.games.find(g => g.id === id);
    if (!game) {
      throw new Error(`No game has been created for id ${id}`);
    }
    if (game.teams.length === 0 && game.competitionType !== 'team') {
      this.createDefaultTeams(game);
    }
    return game;
  }

  createDefaultTeams(game: Game): void {
    if (game.competitionType === 'individual') {
      game.teams = this.allPlay();
    } else if (game.competitionType === 'team') {
      game.teams = this.teamsFromGroups();
    } else {
      game.teams = this.createMatchTeams();
    }
    this.calculateHandicaps(game);
  }

  // To auto-include everyone for an individual game
  allPlay(): Team[] {
    const teams = this.players.map(p => {
      const team = new Team();
      team.playerId = p.id;
      team.teamNumber = 0;
      return team;
    });
    teams.forEach((t, idx) => {
      t.teamNumber = idx + 1;
    });
    return teams;
  }

  teamsFromGroups(): Team[] {
    const teams = [];
    this.groups.forEach(group => {
      group.players.forEach(player => {
        const team = new Team();
        team.playerId = player.id;
        team.teamNumber = group.number;
        teams.push(team);
      });
    });
    return teams;
  }

  createMatchTeams(): Team[] {
    const teams = [];
    const team1 = new Team();
    team1.teamNumber = 1;
    teams.push(team1);
    const team2 = new Team();
    team2.teamNumber = 2;
    teams.push(team2);
    return teams;
  }

  // TODO: maybe make it an option not to play off the low cap
  calculateHandicaps(game: Game): void {
    if (game.isNet) {
      // Start with course handicaps
      game.teams.forEach(team => {
        const player = this.players.find(p => p.id === team.playerId);
        if (player) {
          team.strokes = this.course.calculateHandicap(player.handicapIndex);
        }
      });
      // Find low and play off that
      const caps = game.teams.map(t => t.strokes || 0);
      const lowCap = Math.min(...caps);
      game.teams.forEach(team => {
        if (team.playerId) {
          team.strokes = team.strokes - lowCap;
        }
      });
    } else {
      game.teams.forEach(team => {
        team.strokes = 0;
      });
    }
  }

  fromJson(json: any): Round {
    // only serializing a course id when round is retrieved by code
    let course = new Course();
    if (isNumber(json.course)) {
      course.id = json.course;
    } else {
      course = new Course().fromJson(json.course);
    }
    this.id = json.id;
    this.course = course;
    this.code = json.code;
    this.created = moment(json.created);
    this.played = json.played ? moment(json.played) : moment(json.created);
    this.completed = json.is_complete;
    if (json.groups) {
      json.groups.forEach(group => {
        this.groups.push(new Group().fromJson(group));
      });
    }
    if (json.games) {
      json.games.forEach(game => {
        this.games.push(new Game().fromJson(game));
      });
    }
    return this;
  }

  // Only the course and completed flag are directly editable on a Round - everything else is derived or calculated
  // Sending just enough to pass that validator
  toJson(): any {
    return {
      'code': '',
      'played': this.played.format('YYYY-MM-DD'),
      'is_complete': this.completed,
      'course': this.course.id
    };
  }
}

export enum RoundStateEnum {
  NoRound = 0,
  SetupIncomplete,
  SetupComplete,
  Scoring,
  ScoringComplete,
  Archived
}
