import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from '../../../environments/environment.development';
import { IApiResponse } from '../../core/models/api-response';
import { ISpecialties } from '../interface/specialties.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpecialtiesService {
  constructor(readonly http: HttpClient) {}

  // Get All Specialties
  getSpecialties(): Observable<IApiResponse<ISpecialties[]>> {
    return this.http.get<IApiResponse<ISpecialties[]>>(`${Environment.apiUrl}/api/speciality`);
  }
}
