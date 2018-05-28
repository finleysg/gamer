import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SummaryComponent } from './summary/summary.component';
import { GroupCreateComponent } from './groups/group-create.component';
import { RoundResolverService } from '../services/round-resolver.service';
import { GamesComponent } from './games/games.component';
import { GameComponent } from './game/game.component';
import { SetupComponent } from './setup.component';

const routes: Routes = [
  { path: '', component: SetupComponent, children: [
    { path: ':code', children: [
      { path: 'summary', resolve: { round: RoundResolverService }, component: SummaryComponent },
      { path: 'groups', resolve: { round: RoundResolverService }, component: GroupCreateComponent },
      { path: 'games', resolve: { round: RoundResolverService }, component: GamesComponent },
      { path: 'game/:id', resolve: { round: RoundResolverService }, component: GameComponent }
    ]}
  ]}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
