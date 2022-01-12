import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CheckoutsRoutingModule } from './checkouts-routing.module';
import { CheckoutsComponent } from './checkouts.component';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  declarations: [
    CheckoutsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    CheckoutsRoutingModule
  ]
})
export class CheckoutsModule { }
