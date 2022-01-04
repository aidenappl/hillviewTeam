/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';

import { SessionService } from 'src/services/session/session.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  isRefreshingToken = false;

  accessTMP = '';

  constructor(private session: SessionService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.isInBlockedList(request.url)) {
      return next.handle(request);
    } else {
      return next.handle(this.addToken(request)).pipe(
        catchError((err) => {
          console.log(err);
          if (err instanceof HttpErrorResponse) {
            switch (err.status) {
              case 404:
                return throwError(err);
              case 401:
                return this.handle401Error(request, next, err);
              case 403:
                return this.handle403Error(request, next, err);
              case 500:
                return this.handle500Error(request, next, err);
              default:
                return throwError(err);
            }
          } else {
            return throwError(err);
          }
        })
      );
    }
  }

  private handle403Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    err: any
  ): Observable<any> {
    if (err.error) {
      console.error(err.error.errors[0]);
      this.session.logout(); // logout user
      return err;
    } else {
      return throwError(err);
    }
  }

  private handle500Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    err: any
  ): Observable<any> {
    if (err.error.errors) {
      if (
        err.error.errors.toString().includes('error retrieving calling user')
      ) {
        // Token Expired
        console.error('error retrieving calling user');
        this.session.logout();
        return err;
      } else {
        return throwError(err);
      }
    } else {
      return throwError(err);
    }
  }

  private handle401Error(
    request: HttpRequest<any>,
    next: HttpHandler,
    err: any
  ): Observable<any> {
    if (err.error) {
      if (!err.error.message) {
        if (err.error.errors.toString().includes('calling user does not have a type')) {
          window.location.href = 'https://accounts.grindstoneapp.com/o/oauth/type?redirectURI=' + window.location.href;
          throw err
        } else {
          return throwError(err);
        }
      }
      if (err.error.message.toString().includes('missing bearer')) {
        console.log('missing bearer token');
        return next.handle(this.addToken(request));
      } else if (
        err.error.message.toString().includes('expired bearer token')
      ) {
        // Token Expired
        console.error(
          'Token Expired on call, queuing all requests until new issued'
        );
        if (!this.isRefreshingToken) {
          this.isRefreshingToken = true;
          this.session.accessToken = null;

          return this.session.getNewAccessToken().pipe(
            switchMap((token: any) => {
              if (token) {
                // Store the new token
                const accessToken = token.access_token;
                this.accessTMP = accessToken;

                this.tokenSubject.next(accessToken);

                return next.handle(this.addToken(request));
              } else {
                // No new token or other problem occurred
                return of(null);
              }
            }),
            finalize(() => {
              // Unblock the token reload logic when everything is done
              this.isRefreshingToken = false;
            })
          );
        } else {
          // "Queue" other calls while we load a new token
          return this.tokenSubject.pipe(
            filter((token) => token !== null),
            take(1),
            switchMap((token) => {
              // Perform the request again now that we got a new token!
              return next.handle(this.addToken(request));
            })
          );
        }
      } else {
        return throwError(err);
      }
    } else {
      return throwError(err);
    }
  }

  private isInBlockedList(url: string): Boolean {
    if (url.includes('token')) {
      return true;
    } else {
      this.session.checkTokenExpiration();
      return false;
    }
  }

  private addToken(req: HttpRequest<any>) {
    if (this.session.accessToken) {
      return req.clone({
        headers: new HttpHeaders({
          Authorization: `Bearer ${this.session.accessToken}`,
        }),
      });
    } else {
      return req;
    }
  }
}
