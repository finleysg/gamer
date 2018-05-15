import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { CourseService } from './course.service';
import { Round } from '../models/round';
import { Course } from '../models/course';
import { Group } from '../models/group';
import { Game } from '../models/game';
import { Player } from '../models/player';
import { cloneDeep } from 'lodash';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, flatMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { BaseService } from './base.service';
import { Score } from '../models/score';
import { Hole } from '../models/hole';
import { Leaderboard } from '../models/leaderboard';
import { GameType } from '../models/gameType';

@Injectable()
export class RoundService extends BaseService {

    private resource = `${this.baseUrl}/rounds/`;
    private groupResource = `${this.baseUrl}/groups/`;
    private gameResource = `${this.baseUrl}/games/`;
    private gameTypeResource = `${this.baseUrl}/game-types/`;
    private scoreResource = `${this.baseUrl}/scores/`;
    private scoringResource = `${this.baseUrl}/scoring/`;

    private _currentRound: Round;
    private _currentRoundSource: BehaviorSubject<Round>;
    private _currentHole: Hole;
    private _currentGroup: Group;

    constructor(
        private courseService: CourseService,
        private http: HttpClient
    ) {
        super();
        this._currentRound = new Round();
        this._currentRoundSource = new BehaviorSubject<Round>(this._currentRound);
    }

    hasRound(code: string): boolean {
        return this._currentRound && this._currentRound.code === code;
    }

    get currentRound(): Observable<Round> {
        return this._currentRoundSource.asObservable();
    }

    get lastHole(): Hole {
        return this._currentHole;
      }

    get currentGroup(): Group {
        return this._currentGroup;
    }

    createRound(course: Course): Observable<Round> {
        const round = new Round();
        round.course = course;
        return this.http.post(this.resource, round.toJson(), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        })
            .pipe(
                map((json: any) => {
                    this._currentRound = new Round().fromJson(json);
                    this._currentRound.course = course;
                    this._currentRoundSource.next(cloneDeep(this._currentRound));
                    return this._currentRound;
                })
            );
    }

    loadRound(code: string): Observable<Round> {
        return this.http.get(`${this.resource}?code=${code}`).pipe(
            flatMap((json: any) => {
                if (!json || json.length === 0) {
                    return null;
                } else {
                    this._currentRound = new Round().fromJson(json[0]);
                    return this.courseService.getCourse(this._currentRound.course.id);
                }
            }),
            map(course => {
                if (!course) {
                    return null;
                }
                this._currentRound.course = course;
                this._currentRoundSource.next(cloneDeep(this._currentRound));
                return this._currentRound;
            })
        );

    }

    updateCourse(course: Course): void {
        this.http.patch(`${this.resource}/${this._currentRound.id}`, { 'course': course.id }, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            tap(() => {
                this._currentRound.course = course;
                this._currentRoundSource.next(cloneDeep(this._currentRound));
            })
        ).subscribe();
    }

    saveGroups(round: Round): Observable<Round> {
        const requests = round.groups.map(g => {
            if (!g.id || g.id === 0) {
                return this.http.post(this.groupResource, g.toJson(), {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                });
            } else {
                return this.http.put(`${this.groupResource}${g.id}/`, g.toJson(), {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                });
            }
        });
        return forkJoin(requests).pipe(
           flatMap(() => {
                return this.loadRound(round.code);
            })
        );
    }

    deleteGroup(group: Group): Observable<Round> {
        return this.http.delete(`${this.groupResource}${group.id}/`).pipe(
            flatMap(() => {
                return this.loadRound(this._currentRound.code)
            })
        );
    }

    createGame(competitionType): Observable<Game> {
        const game = new Game();
        game.roundId = this._currentRound.id;
        game.competitionType = competitionType;
        return this.http.post(this.gameResource, game.toJson(), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            map((json) => {
                const created = new Game().fromJson(json);
                this._currentRound.addGame(created);
                this._currentRoundSource.next(cloneDeep(this._currentRound));
                return created;
            })
        );
    }

    updateGame(game: Game): Observable<Game> {
        return this.http.put(`${this.gameResource}${game.id}/`, game.toJson(), {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        }).pipe(
            map((json) => {
                const updated = new Game().fromJson(json);
                this._currentRound.updateGame(updated);
                this._currentRoundSource.next(cloneDeep(this._currentRound));
                return updated;
            })
        );
    }

    deleteGame(game: Game): Observable<any> {
        return this.http.delete(`${this.gameResource}${game.id}/`).pipe(
            tap(() => {
                this._currentRound.removeGame(game);
                this._currentRoundSource.next(cloneDeep(this._currentRound));
            })
        );
    }

    allScores(): Observable<Score[]> {
        return this.http.get(`${this.scoreResource}?round=${this._currentRound.id}`).pipe(
            map((json: any) => {
                return json.map(s => {
                    const score = new Score().fromJson(s);
                    score.hole = this.getHole(score.holeId);
                    score.player = this.getPlayer(score.playerId);
                    return score;
                });
            })
        );
    }

    groupScoresByHole(group: Group, hole: Hole): Observable<Score[]> {
        this._currentGroup = group;
        return this.allScores().pipe(
            map(scores => {
                const playerIds = group.players.map(p => p.id);
                let groupScores = scores.filter(s => {
                    return s.holeId === hole.id && playerIds.includes(s.playerId);
                });
                // No scores for this hole yet, so create them with par to start
                if (!groupScores || !groupScores.length) {
                    groupScores = [];
                    group.players.forEach((player: Player) => {
                        const score = new Score();
                        score.roundId = this._currentRound.id;
                        score.holeId = hole.id;
                        score.playerId = player.id;
                        score.grossScore = hole.par;
                        score.hole = hole;
                        score.player = player;
                        score.dirty = true;
                        groupScores.push(score);
                    });
                }
                return groupScores;
            })
        );
    }

    saveScores(scores: Score[]): void {
        if (scores[0]) {
            this._currentHole = scores[0].hole;
        }
        const actions = [];
        scores.forEach(s => {
            if (s.id) {
                actions.push(this.http.put(`${this.scoreResource}${s.id}`, s.toJson(), {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                }));
            } else {
                actions.push(this.http.post(this.scoreResource, s.toJson(), {
                    headers: new HttpHeaders().set('Content-Type', 'application/json'),
                }));
            }
        });
        forkJoin(actions).subscribe();
    }

    randomScores(): Observable<any> {
        return this.http.post(`${this.scoringResource}random/${this._currentRound.id}/`, {});
    }

    calculateEsc(score: Score): number {
        // TODO: based on handicap and current hole
        return score.hole.par + 2;
    }

    getLeaderboard(): Observable<Leaderboard> {
        return this.allScores().pipe(
            map(scores => {
                const leaderboard = new Leaderboard(this._currentRound.course);
                leaderboard.reload(this._currentRound.players, scores);
                return leaderboard;
            })
        );
    }

    getGameTypes(): Observable<GameType[]> {
        return this.http.get(this.gameTypeResource).pipe(
            map((json: any) => {
                return json.map(o => new GameType().fromJson(o));
            })
        );
    }

    private getHole(holeId: number): Hole {
        return this._currentRound.course.getHole(holeId);
    }

    private getPlayer(playerId: number): Player {
        return this._currentRound.players.find(p => p.id === playerId);
    }
}
