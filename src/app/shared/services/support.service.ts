import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SupportService {
  constructor(readonly http: HttpClient) {}

  support( data: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/support`,
      data,
    );
  }
}
