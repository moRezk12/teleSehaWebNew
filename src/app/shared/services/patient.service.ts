import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  constructor(readonly http: HttpClient) {}

  getPatientProfile(patientId: number): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(
      `${Environment.apiUrl}/api/admin/patient/${patientId}`,
    );
  }

  updatePatientProfile(patientId: number, data: any): Observable<IApiResponse<any>> {
    return this.http.put<IApiResponse<any>>(
      `${Environment.apiUrl}/api/patient/${patientId}`,
      data,
    );
  }

  getPrivacyAndTermsAndPolicy(page: any): Observable<IApiResponse<any>> {
    return this.http.get<IApiResponse<any>>(`${Environment.apiUrl}/api/info-page/${page}`);
  }

  receiption(patientId: number, text: string): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/receiption/${patientId}`,
      JSON.stringify(text),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  }

  // chage mobile number
  changeMobileNumber(data: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/authentication/change-mobile-number`,
      data,
    );
  }

  // verify otp
  verifyOtp(data: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(
      `${Environment.apiUrl}/api/authentication/change-mobile-number/otp-confirm`,
      data,
    );
  }

  // Rating Review Doctor
  ratingReviewDoctor(data: any): Observable<IApiResponse<any>> {
    return this.http.post<IApiResponse<any>>(`${Environment.apiUrl}/api/rating-review`, data);
  }
}
