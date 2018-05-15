export class Hole {
  id: number;
  courseId: number;
  holeNumber: number;
  par: number;
  handicap: number;

  fromJson(json: any): Hole {
    this.id = json.id;
    this.courseId = json.course;
    this.holeNumber = json.hole_number;
    this.par = json.par;
    this.handicap = json.handicap;
    return this;
  }

  toJson(): any {
    return {
      'id': this.id,
      'course': this.courseId,
      'hole_number': this.holeNumber,
      'par': this.par,
      'handicap': this.handicap
    };
  }

  // strokes is the number a player is getting for a given game
  getBumps(strokes: number, holes: number): number {
    if (strokes < 0) {
      // plus handicap (net skins or we're not playing off the low hcp)
      return this.handicap <= (holes + strokes) ? -1 : 0;
    }
    let bumps = this.handicap <= strokes ? 1 : 0;
    if (this.handicap > holes) {
      bumps += this.handicap <= (strokes - holes) ? 1 : 0;
    }
    return bumps;
  }
}
