export class Team {
  id: number;
  // gameId: number;
  playerId: number;
  teamNumber: number;
  strokes: number;
  localId: string = Math.floor(Math.random() * 1000).toString();
  isPlaying = true;

  fromJson(json: any): Team {
    this.id = json.id;
    // this.gameId = json.game;
    this.playerId = json.player;
    this.teamNumber = json.team_number;
    this.strokes = json.strokes;
    return this;
  }

  toJson(): any {
    return {
      'id': this.id,
      // 'game': this.gameId,
      'player': this.playerId,
      'team_number': this.teamNumber,
      'strokes': this.strokes
    };
  }
}
