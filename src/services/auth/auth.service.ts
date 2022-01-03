import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { RequestService } from '../http/request.service';
import { GoogleResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
      private authService: SocialAuthService,
      private request: RequestService
    ) {}

  async google(): Promise<any> {
    try {
      const response: GoogleResponse = await this.authService.signIn(
        GoogleLoginProvider.PROVIDER_ID
      );
      if (
        response.email &&
        response.name &&
        response.id &&
        response.photoUrl &&
        response.idToken &&
        response.response
      ) {
        // Get Hillview Tokens + User Profile
        const userFromAuth = await this.request.post(
          `${environment.API_URL}/google`,
          response
        );
        if (userFromAuth.body) {
            console.log(userFromAuth.body);
        }
      } else {
        throw new Error('Invalid Response');
      }
    } catch (error) {
      throw error;
    }
  }
}
