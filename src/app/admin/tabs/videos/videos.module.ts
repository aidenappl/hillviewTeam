import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideosRoutingModule } from './videos-routing.module';
import { VideosComponent } from './videos.component';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  declarations: [
    VideosComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    VideosRoutingModule
  ]
})
export class VideosModule { }
