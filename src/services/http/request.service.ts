/* eslint-disable max-len */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

interface GeneralHTTPResponse {
    status: number;
    message: string;
    body: any;
    error: any;
    success: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class RequestService {

  server = environment.AUTH_API_URL;

  constructor(private http: HttpClient) {}

  async post (url: string, body: any): Promise<GeneralHTTPResponse> {
      try {
          const response = await this.http.post(url, body, { observe: 'response' }).toPromise()
          if (!response) {
            return {
                status: 505,
                message: 'Error: No Response',
                body: null,
                error: null,
                success: false,
            }
          }
          return {
                status: response.status,
                body: response.body,
                error: null,
                message: response.statusText,
                success: response.ok,
          }
      } catch (error: any) {
        return {
            status: 505,
            message: error.message,
            body: null,
            error,
            success: false,
        }
      }
  }
  
  async get (url: string): Promise<GeneralHTTPResponse>  {
    try {
        const response = await this.http.get(url, { observe: 'response' }).toPromise()
        if (!response) {
            return {
                status: 505,
                message: 'Error: No Response',
                body: null,
                error: null,
                success: false,
            }
          }
          return {
                status: response.status,
                body: response.body,
                error: null,
                message: response.statusText,
                success: response.ok,
          }
    } catch (error: any) {
        return {
            status: 505,
            message: error.message,
            body: null,
            error,
            success: false,
        }
    }
}
}
