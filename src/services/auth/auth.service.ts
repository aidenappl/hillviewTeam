import { Injectable } from '@angular/core';
import { GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { RequestService } from '../http/request.service';
import { SessionService } from '../session/session.service';
import { GoogleResponse, LoginResponse } from './auth.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private authService: SocialAuthService,
    private session: SessionService,
    private request: RequestService
  ) {}

  async google(): Promise<boolean> {
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
          let body: LoginResponse = userFromAuth.body as LoginResponse;
          if (body.accessToken && body.refreshToken && body.user) {
            const goodSession = await this.session.begin({
                accessToken: body.accessToken,
                refreshToken: body.refreshToken,
                user: body.user
            })
            return goodSession
          } else {
            throw new Error('Invalid Login Response Malformed Body');
          }
        } else {
            throw new Error('Invalid Login Response Missing Body');
        }
      } else {
        throw new Error('Invalid Response');
      }
    } catch (error) {
      throw error;
    }
  }

  async local(req: {
    email: string;
    password: string;
  }): Promise<boolean> {
    try {
      if (
        req.email &&
        req.password
      ) {
        // Get Hillview Tokens + User Profile
        const data = {
            email: req.email,
            password: req.password
        }
        const userFromAuth = await this.request.post(
          `${environment.API_URL}/local`,
          data
        );
        if (userFromAuth.body) {
          let body: LoginResponse = userFromAuth.body as LoginResponse;
          if (body.accessToken && body.refreshToken && body.user) {
            const goodSession = await this.session.begin({
                accessToken: body.accessToken,
                refreshToken: body.refreshToken,
                user: body.user
            })
            return goodSession
          } else {
            throw new Error('Invalid Login Response Malformed Body');
          }
        } else {
            throw new Error('Invalid Login Response Missing Body');
        }
      } else {
        throw new Error('Invalid Response');
      }
    } catch (error) {
      throw error;
    }
  }

}
