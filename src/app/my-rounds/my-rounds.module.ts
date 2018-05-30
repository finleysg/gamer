import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRoundsComponent } from './my-rounds/my-rounds.component';
import { SharedModule } from '../shared/shared.module';
import { MyRoundsRoutes } from './my-rounds.routing';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild(MyRoundsRoutes),
    SharedModule
  ],
  declarations: [MyRoundsComponent]
})
export class MyRoundsModule { }
