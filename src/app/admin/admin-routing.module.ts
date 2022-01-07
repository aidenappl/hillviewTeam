import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: 'r',
        pathMatch: 'full',
      },
      {
        path: 'r',
        loadChildren: () =>
          import('./tabs/tabs.module').then((m) => m.TabsModule),
      },
    ],
  },
  {
    path: 'tools/mobileRegister',
    loadChildren: () =>
      import('./tools/mobile-register/mobile-register.module').then(
        (m) => m.MobileRegisterModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
