import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoUploaderRoutingModule } from './video-uploader-routing.module';
import { VideoUploaderComponent } from './video-uploader.component';


@NgModule({
  declarations: [
    VideoUploaderComponent
  ],
  imports: [
    CommonModule,
    VideoUploaderRoutingModule
  ]
})
export class VideoUploaderModule { }
