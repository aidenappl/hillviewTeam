/* eslint-disable max-len */
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  server = environment.API_URL;

  constructor(private http: HttpClient) {}

  async post (url: string, body: any): Promise<HttpResponse<object>> {
      try {
          const response = await this.http.post(url, body, { observe: 'response' }).toPromise()
          return response!;
      } catch (error) {
          throw error
      }
  }
  
  async get (url: string): Promise<HttpResponse<object>>  {
    try {
        const response = await this.http.get(url, { observe: 'response' }).toPromise()
        return response!;
    } catch (error) {
        throw error
    }
}
}
