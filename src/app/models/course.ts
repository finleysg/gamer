import { Hole } from './hole';

export class Course {
  id: number;
  name: string;
  numberOfHoles: number;
  slope: number;
  rating: number;
  owner: number;
  holes: Hole[] = [];

  get par(): number {
    return this.front9 + this.back9;
  }

  get front9(): number {
    let par = 0;
    if (this.holes && this.holes.length) {
      this.holes.forEach(h => {
        if (h.holeNumber <= 9) {
          par += h.par;
        }
      });
    }
    return par;
  }

  get back9(): number {
    let par = 0;
    if (this.holes && this.holes.length) {
      this.holes.forEach(h => {
        if (h.holeNumber > 9) {
          par += h.par;
        }
      });
    }
    return par;
  }

  fromJson(json: any): Course {
    this.id = json.id;
    this.name = json.name;
    this.numberOfHoles = json.number_of_holes;
    this.slope = json.slope;
    this.rating = json.rating;
    this.owner = json.owner;
    if (json.holes) {
      json.holes.forEach(hole => {
        this.holes.push(new Hole().fromJson(hole));
      });
    }
    return this;
  }

  toJson(): any {
    const holes = [];
    this.holes.forEach(h => holes.push(h.toJson()));
    return {
      'id': this.id,
      'name': this.name,
      'number_of_holes': this.numberOfHoles,
      'slope': this.slope,
      'rating': this.rating,
      'owner': this.owner,
      'holes': holes
    };
  }

  getHole(id: number): Hole {
    return this.holes.find(h => h.id === id);
  }

  calculateHandicap(handicapIndex: number): number {
    if (this.holes.length === 18) {
      const handicap = (handicapIndex * this.slope) / 113;
      return Math.round(handicap);
    } else if (this.holes.length === 9) {
      const handicap = (this.round(handicapIndex / 2, 1) * this.slope) / 113;
      return Math.round(handicap);
    } else {
      // TODO: log a warning
      return 0;
    }
  }

  round(value: any, precision: number): number {
    const shift = function (num, exponent) {
      const numArray = ('' + num).split('e');
      return +(numArray[0] + 'e' + (numArray[1] ? (+numArray[1] + exponent) : exponent));
    };
    return shift(Math.round(shift(value, +precision)), -precision);
  }
}
