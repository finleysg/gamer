import { Player } from './player';

export class Group {
  id: number;
  number: number;
  roundId: number;
  players: Player[] = [];

  fromJson(json: any): Group {
    this.id = json.id;
    this.number = json.group_number;
    this.roundId = json.round;
    if (json.players) {
      json.players.forEach(player => {
        this.players.push(new Player().fromJson(player));
      });
    }
    return this;
  }

  toJson(): any {
    const players = [];
    this.players.forEach(p => players.push(p.toJson()));
    return {
      'id': this.id,
      'group_number': this.number,
      'round': this.roundId,
      'players': players
    };
  }

  getPlayer(id: number): Player {
    return this.players.find(p => p.id === id);
  }
}
