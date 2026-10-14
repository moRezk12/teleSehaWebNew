import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class RecentAppointmentsService {
  constructor(readonly http: HttpClient) {}

  appointmentComming(patientId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/appointment/comming/${patientId}`,
    );
  }
  appointmentCheckComming(patientId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/appointment/check-comming/${patientId}`,
    );
  }

  // Past bookings (Completed / Canceled). Kept separate from `comming` (upcoming only) so a
  // finished check-up still shows in the patient's booking history instead of disappearing.
  appointmentHistory(patientId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/appointment/history/${patientId}`,
    );
  }

  getMeetingSatisfactionRatio(checkupId: number, data: any): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(
      `${Environment.apiUrl}/api/meeting/satisfaction-ratio/${checkupId}`,
      data,
    );
  }

  paying(appointmentId: number): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/appointment/pay/${appointmentId}`,
      {},
    );
  }

  cancelAppointment(appointmentId: number): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/appointment/cancel/${appointmentId}`,
      {},
    );
  }
}

