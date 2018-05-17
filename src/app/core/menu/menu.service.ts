import { Injectable } from '@angular/core';
import { RoundService } from '../../services/round.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Round } from '../../models/round';

export interface BadgeItem {
  type: string;
  value: string;
}

export interface ChildrenItems {
  state: string[];
  name: string;
  type?: string;
}

export interface Menu {
  state: string[];
  name: string;
  type: string;
  icon: string;
  badge?: BadgeItem[];
  children?: ChildrenItems[];
}

@Injectable()
export class MenuService {

  private _menuSource: BehaviorSubject<Menu[]>;

  constructor(
    private roundService: RoundService
  ) {
    this._menuSource = new BehaviorSubject<Menu[]>([]);
    this.roundService.currentRound.subscribe(round => this.menuBuilder(round));
  }

  getMenu(): Observable<Menu[]> {
    return this._menuSource.asObservable();
  }

  menuBuilder(round: Round): void {
    const menu = [
      {
        state: [''],
        name: 'Home',
        type: 'link',
        icon: 'home'
      },
      {
        state: ['my-rounds'],
        name: 'My Rounds',
        type: 'link',
        icon: 'list'
      }
    ];
    if (round.code) {
      menu.push(this.setupMenu(round));
      menu.push(this.scoringMenu(round));
      menu.push(this.resultsMenu(round));
    }
    this._menuSource.next(menu);
  }

  setupMenu(round: Round): Menu {
    if (round.code) {
      const setupMenu = {
        state: ['setup'],
        name: 'Round Setup',
        type: 'sub',
        icon: 'group_add',
        children: [
          {
            state: [round.code, 'groups'],
            name: 'Groups & Players'
          },
          {
            state: [round.code, 'games'],
            name: 'Games'
          }
        ]
      };
      return setupMenu;
    }
    return null;
  }

  scoringMenu(round: Round): Menu {
    if (round.code) {
      const scoringMenu = {
        state: ['scoring'],
        name: 'Scoring',
        type: 'sub',
        icon: 'view_comfy',
        children: []
      };
      round.groups.forEach(group => {
        scoringMenu.children.push({state: [round.code, 'hole', group.number.toString(), '1'], name: `Group ${group.number}`});
      });
      scoringMenu.children.push({state: [round.code, 'leaderboard', 'front', '0'], name: 'Leaderboard'});
      return scoringMenu;
    }
    return null;
  }

  resultsMenu(round: Round): Menu {
    if (round.code) {
      const resultMenu = {
        state: ['results'],
        name: 'Results',
        type: 'sub',
        icon: 'attach_money',
        children: []
      };
      round.games.forEach(game => {
        resultMenu.children.push({state: [round.code, 'game', game.id.toString()], name: game.name});
      });
      return resultMenu;
    }
    return null;
  }
}
