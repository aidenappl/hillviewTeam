import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetCreatorComponent } from './asset-creator.component';

const routes: Routes = [{ path: '', component: AssetCreatorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetCreatorRoutingModule { }
