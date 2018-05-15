import { Pipe, PipeTransform } from '@angular/core';
import { Team } from '../../models/team';

@Pipe({
  name: 'teamFilter',
  pure: false
})
export class TeamFilterPipe implements PipeTransform {

  transform(value: Team[], teamNumber: number): any {
    return value.filter(team => team.teamNumber === teamNumber);
  }
}
