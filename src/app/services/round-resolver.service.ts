import { Injectable } from '@angular/core';
import { Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Round } from '../models/round';
import { RoundService } from './round.service';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

@Injectable()
export class RoundResolverService implements Resolve<Observable<Round>> {

  constructor(private roundService: RoundService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Round> {
    const code = route.params['code'].toUpperCase();
    if (this.roundService.hasRound(code)) {
      return this.roundService.currentRound.pipe(first());
    }
    return this.roundService.loadRound(code).pipe(first());
  }
}
