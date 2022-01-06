import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {
  SocialLoginModule,
  SocialAuthServiceConfig,
} from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { AuthService } from 'src/services/auth/auth.service';
import { environment } from 'src/environments/environment';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { RequestService } from 'src/services/http/request.service';
import { SessionService } from 'src/services/session/session.service';
import { UserProvider } from 'src/providers/user.provider';
import { LandingGuard } from './auth/guards/landing.guard';
import { AdminGuard } from './auth/guards/admin.guard';
import { JwtInterceptor } from 'src/interceptor/jwt.interceptor';
import { UserGuard } from './auth/guards/user.guard';
import { AuthenticationGuard } from './auth/guards/authentication.guard';

export function sessionServiceFactory(provider: SessionService) {
  return () => provider.initialize();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SocialLoginModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    HttpClient,
    LandingGuard,
    AuthenticationGuard,
    AdminGuard,
    UserGuard,
    RequestService,
    SessionService,
    UserProvider,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GoogleClientID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: sessionServiceFactory,
      deps: [SessionService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
