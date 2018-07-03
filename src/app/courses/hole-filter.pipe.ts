import { Pipe, PipeTransform } from '@angular/core';
import { Hole } from '../models/hole';

@Pipe({
  name: 'holeFilter'
})
export class HoleFilterPipe implements PipeTransform {

  transform(holes: Hole[], side: string): Hole[] {
    if (holes) {
      if (side === 'front') {
        return holes.filter(h => h.holeNumber <= 9);
      } else {
        return holes.filter(h => h.holeNumber >= 10);
      }
    }
  }
}
