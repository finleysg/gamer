import { Routes } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings.component';

export const ProfileRoutes: Routes = [{
  path: '',
    children: [{
      path: 'edit',
      component: ProfileComponent
    }, {
      path: 'settings',
      component: SettingsComponent
    }
  ]
}];
