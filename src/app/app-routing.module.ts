import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
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
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./auth/redirect/redirect.module').then((m) => m.RedirectModule),
  },
  {
    path: 'logout',
    canActivate: [AuthGuard],
    canLoad: [AuthGuard],
    loadChildren: () =>
      import('./auth/logout/logout.module').then((m) => m.LogoutModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./public/err404/err404.module').then((m) => m.Err404Module),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
