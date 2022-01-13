import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { TabsComponent } from './tabs.component';

const routes: Routes = [
  {
    path: '',
    component: TabsComponent,
    children: [
      {
        path: '',
        redirectTo: 'assets',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'assets',
        loadChildren: () =>
          import('./assets/assets.module').then((m) => m.AssetsModule),
      },
      {
        path: 'performance',
        loadChildren: () =>
          import('./performance/performance.module').then(
            (m) => m.PerformanceModule
          ),
      },
      {
        path: 'checkouts',
        loadChildren: () =>
          import('./checkouts/checkouts.module').then((m) => m.CheckoutsModule),
      },
      {
        path: 'videos',
        loadChildren: () =>
          import('./videos/videos.module').then((m) => m.VideosModule),
      },
      {
        path: 'playlists',
        loadChildren: () =>
          import('./playlists/playlists.module').then((m) => m.PlaylistsModule),
      },
      {
        path: 'links',
        loadChildren: () =>
          import('./links/links.module').then((m) => m.LinksModule),
      },
      {
        path: 'users',
        loadChildren: () =>
          import('./users/users.module').then((m) => m.UsersModule),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./settings/settings.module').then((m) => m.SettingsModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsRoutingModule {}
