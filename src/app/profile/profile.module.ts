import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProfileRoutes } from './profile.routing';
import { ProfileComponent } from './profile.component';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    RouterModule.forChild(ProfileRoutes),
    SharedModule
  ],
  declarations: [ ProfileComponent, SettingsComponent ]
})

export class ProfileModule {}
