export class Player {
  id = 0;
  localId: number; // to uniquely identify a player within a group
  name: string;
  handicapIndex: number;
  groupId: number;
  memberId: number;

  fromJson(json: any): Player {
    this.id = json.id;
    this.name = json.name;
    this.handicapIndex = json.handicap;
    this.groupId = json.group;
    this.memberId = json.member;
    return this;
  }

  toJson(): any {
    return {
      'id': this.id,
      'name': this.name,
      'handicap': this.handicapIndex,
      'group': this.groupId,
      'member': this.memberId
    };
  }
}
