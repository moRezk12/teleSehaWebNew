import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {

  constructor(readonly http: HttpClient) { }

  refreshLogin(refreshToken: string): Observable<IApiResponse<{ accessToken: string }>> {
    return this.http.post<IApiResponse<{ accessToken: string }>>(
      `${Environment.apiUrl}/api/authentication/refresh-login`,
      { refreshToken } 
    );
  }
}
