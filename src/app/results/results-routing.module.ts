import { NgModule, ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoundResolverService } from '../services/round-resolver.service';
import { GameResultsComponent } from './game-results.component';
import { GameResultComponent } from './game-result/game-result.component';

const routes: Routes = [
  { path: '', component: GameResultsComponent, children: [
    { path: ':code', children: [
      { path: 'game/:id', resolve: { round: RoundResolverService }, component: GameResultComponent }
    ]}
  ]}
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);
