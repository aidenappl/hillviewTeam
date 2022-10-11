import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { from, of, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserProvider } from 'src/providers/user.provider';
import { RequestService } from '../http/request.service';
import jwt_decode from 'jwt-decode';
import { User } from 'src/providers/user.interface';

@Injectable()
export class SessionService {
  constructor(
    private user: UserProvider,
    private authService: SocialAuthService,
    private http: HttpClient,
    private request: RequestService,
    private router: Router
  ) {}

  accessToken: string | null = null;
  refreshToken: string | null = null;

  // Begin a new Session

  async begin(req: {
    accessToken: string;
    refreshToken: string;
    user: User;
  }): Promise<boolean> {
    try {
      if (req.accessToken && req.refreshToken && req.user) {
        localStorage.setItem('accessToken', req.accessToken);
        localStorage.setItem('refreshToken', req.refreshToken);

        this.user.set(req.user);

        return true;
      } else {
        throw new Error('Invalid Request');
      }
    } catch (error) {
      throw error;
    }
  }

  // Is there an Active and Valid Session

  async active(): Promise<boolean> {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

        this.accessToken = accessToken;
        this.refreshToken = refreshToken;

      if (accessToken && refreshToken) {
        this.checkTokenExpiration();
        return true;
      } else {
        if (accessToken || refreshToken) {
          this.logout();
        }
        return false;
      }
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // Logout of an Active Session

  async logout(): Promise<void> {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      this.user.clear();

      this.authService.signOut();

      this.router.navigate(['/login']);
    } catch (error) {
      console.error(error);
    }
  }

  // Find user Landing Page

  async findLander(): Promise<string> {
    try {
      const user = await this.user.get();

      if (user.authentication.id) {
        if (user.authentication.short_name === 'unauthorized') {
          return '/pending';
        } else {
          return '/admin/home';
        }
      } else {
        return '/login';
      }
    } catch (error) {
      console.error(error);
      return '/login';
    }
  }

  // Initlizer

  async initialize(): Promise<void> {
    try {
      const session = await this.active();
      if (session) {
        await this.initializeUser();
      } else {
        // Do Nothing
      }
      return;
    } catch (err) {
      throw err;
    }
  }

  async initializeUser(): Promise<void> {
    try {
      const response: any = await this.request.get(
        `${environment.AUTH_API_URL}/user`
      );
      if (response.status !== 200) {
        this.logout()
      }
      this.user.set(response.body as User);
    } catch (err) {
      this.logout()
      throw err;
    }
  }

  // Pipe New Access Token
  getNewAccessToken() {
    const refreshToken = from(this.getRefresh());
    const rts = this.getRefresh();
    return refreshToken.pipe(
      switchMap((token: any) => {
        if (token) {
          return this.http.post(`${environment.AUTH_API_URL}/token`, {
            grant_type: 'refresh_token',
            refresh_token: rts,
          });
        } else {
          return of(null);
        }
      })
    );
  }

  getRefresh(): string {
    return String(this.refreshToken);
  }

  // Reissue Token Promise
  async reissueAccessToken(): Promise<any> {
    try {
      const tokenResponder = await this.request.post(
        `${environment.AUTH_API_URL}/token`,
        {
          refresh_token: await this.get('refreshToken'),
        }
      );
      return tokenResponder.body;
    } catch (err: any) {
      console.error(err);
      if (err.error.errors) {
        if (err.error.errors.toString().includes('invalid refresh_token')) {
          this.logout();
        }
      }
    }
  }

  async checkTokenExpiration(): Promise<void> {
    try {
      if (this.accessToken) {
        const sessionExpired = await this.tokenExpired({
          token: String(this.accessToken),
          threshold: 1200000,
        });
        if (sessionExpired) {
          console.error(
            'Token expiration within 20 minutes, preemptive reissue init'
          );
          const refresher = await this.reissueAccessToken();
          console.log(refresher);
          this.accessToken = refresher.access_token;
          localStorage.setItem('accessToken', refresher.access_token);
          return;
        } else {
          return;
        }
      }
    } catch (err) {
      console.error('Check Token Expiration', err);
    }
  }

  async tokenExpired(options: {
    token: string;
    threshold: number;
  }): Promise<boolean> {
    try {
      const decoded: any = await jwt_decode(options.token);
      // console.log(
      //   'Comparing token for expiration',
      //   decoded.exp * 1000,
      //   Date.now(),
      //   'Time Left: ' + (decoded.exp * 1000 - Date.now())
      // );
      const isExpired = decoded.exp * 1000 - Date.now() <= options.threshold;
      return isExpired;
    } catch (err) {
      throw err;
    }
  }

  async get(key: string): Promise<string | null> {
    return localStorage.getItem(key);
  }
}
