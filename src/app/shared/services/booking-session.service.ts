import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BookingSessionService {
  constructor(readonly http: HttpClient) {}

  bookingSession(patientId : number , sessionId : number): Observable<IApiResponse<any>> {

    return this.http.post<IApiResponse<any>>(`${Environment.apiUrl}/api/appointment`, {
      PatientId: patientId,
      SessionId: sessionId
    });
  }
}
