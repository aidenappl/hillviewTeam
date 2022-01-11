import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetCreatorRoutingModule } from './asset-creator-routing.module';
import { AssetCreatorComponent } from './asset-creator.component';


@NgModule({
  declarations: [
    AssetCreatorComponent
  ],
  imports: [
    CommonModule,
    AssetCreatorRoutingModule
  ]
})
export class AssetCreatorModule { }
