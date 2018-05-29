import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyRoundsComponent } from './my-rounds/my-rounds.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [MyRoundsComponent]
})
export class MyRoundsModule { }
