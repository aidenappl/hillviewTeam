import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutsRoutingModule } from './checkouts-routing.module';
import { CheckoutsComponent } from './checkouts.component';


@NgModule({
  declarations: [
    CheckoutsComponent
  ],
  imports: [
    CommonModule,
    CheckoutsRoutingModule
  ]
})
export class CheckoutsModule { }
