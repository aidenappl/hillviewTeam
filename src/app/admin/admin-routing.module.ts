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
  { path: 'tools/assetCreator', loadChildren: () => import('./tools/asset-creator/asset-creator.module').then(m => m.AssetCreatorModule) },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
