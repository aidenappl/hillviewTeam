import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinksRoutingModule } from './links-routing.module';
import { LinksComponent } from './links.component';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  declarations: [
    LinksComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    LinksRoutingModule
  ]
})
export class LinksModule { }
