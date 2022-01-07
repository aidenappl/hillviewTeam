import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MobileRegisterRoutingModule } from './mobile-register-routing.module';
import { MobileRegisterComponent } from './mobile-register.component';


@NgModule({
  declarations: [
    MobileRegisterComponent
  ],
  imports: [
    CommonModule,
    MobileRegisterRoutingModule
  ]
})
export class MobileRegisterModule { }
