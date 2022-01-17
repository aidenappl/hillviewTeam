import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlaylistsRoutingModule } from './playlists-routing.module';
import { PlaylistsComponent } from './playlists.component';
import { HeaderModule } from '../../components/header/header.module';


@NgModule({
  declarations: [
    PlaylistsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    PlaylistsRoutingModule
  ]
})
export class PlaylistsModule { }
