import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../../environments/environment.development';
import { IApiResponse } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PatientVideoCallService {
  constructor(readonly http: HttpClient) {}

  ratingSession(data: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${Environment.apiUrl}/api/rating-review`, data);
  }

  meetingReports(mettingId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/meeting/reports/${mettingId}`,
    );
  }

  getMeetingDetails(mettingId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/meeting/initial-data/${mettingId}`,
    );
  }
  getMeetingReports(mettingId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/meeting/reports/${mettingId}`,
    );
  }
  getMeetingReportsByCheckup(checkupId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/meeting/reports/checkup/${checkupId}?withReports=true`,
    );
  }
}
