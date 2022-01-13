import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoUploaderComponent } from './video-uploader.component';

const routes: Routes = [{ path: '', component: VideoUploaderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoUploaderRoutingModule { }
