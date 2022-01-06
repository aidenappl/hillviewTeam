import { NgModule } from '@angular/core';
import { RouteReuseStrategy, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './auth/guards/admin.guard';
import { AuthenticationGuard } from './auth/guards/authentication.guard';
import { LandingGuard } from './auth/guards/landing.guard';
import { UserGuard } from './auth/guards/user.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [LandingGuard],
    canLoad: [LandingGuard],
    loadChildren: () =>
      import('./auth/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'pending',
    canActivate: [UserGuard],
    canLoad: [UserGuard],
    loadChildren: () =>
      import('./auth/pending/pending.module').then((m) => m.PendingModule),
  },
  {
    path: 'redirect',
    canActivate: [AuthenticationGuard],
    canLoad: [AuthenticationGuard],
    loadChildren: () =>
      import('./auth/redirect/redirect.module').then((m) => m.RedirectModule),
  },
  {
    path: 'logout',
    canActivate: [AuthenticationGuard],
    canLoad: [AuthenticationGuard],
    loadChildren: () =>
      import('./auth/logout/logout.module').then((m) => m.LogoutModule),
    },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    canLoad: [AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./public/err404/err404.module').then((m) => m.Err404Module),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
