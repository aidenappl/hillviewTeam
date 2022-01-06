import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckoutsComponent } from './checkouts.component';

const routes: Routes = [{ path: '', component: CheckoutsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CheckoutsRoutingModule { }
