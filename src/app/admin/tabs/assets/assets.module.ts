import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetsRoutingModule } from './assets-routing.module';
import { AssetsComponent } from './assets.component';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  declarations: [
    AssetsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    AssetsRoutingModule
  ]
})
export class AssetsModule { }
