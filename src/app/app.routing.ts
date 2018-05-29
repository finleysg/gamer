import { Routes, RouterModule } from '@angular/router';

import { AdminLayoutComponent, AuthLayoutComponent } from './core';
import { ModuleWithProviders } from '@angular/core';

const AppRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule' },
      { path: 'my-rounds', loadChildren: './my-rounds/my-rounds.module#MyRoundsModule' },
      { path: 'courses', loadChildren: './courses/courses.module#CoursesModule' },
      { path: 'setup', loadChildren: './setup/setup.module#SetupModule' },
      { path: 'scoring', loadChildren: './scoring/scoring.module#ScoringModule' },
      { path: 'results', loadChildren: './results/results.module#ResultsModule' }
    ]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'session', loadChildren: './session/session.module#SessionModule' }
    ]
  },
  { path: '**', redirectTo: 'session/404' }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(AppRoutes);
