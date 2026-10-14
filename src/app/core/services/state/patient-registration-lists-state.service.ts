import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PatientAuthService } from '../../../features/patient/service/patient-auth.service';

@Injectable()
export class PatientRegistrationListsStateService {
  private _countries = signal<any[]>([]);
  readonly countries = this._countries.asReadonly();

  private _maritalStatus = signal<any[]>([]);
  readonly maritalStatus = this._maritalStatus.asReadonly();

  private _jobTitles = signal<any[]>([]);
  readonly jobTitles = this._jobTitles.asReadonly();

  constructor(private patientAuthService: PatientAuthService) {}

  loadLists(): Observable<any> {
    return this.patientAuthService.getInfoLists().pipe(
      catchError(() => of({})),
      tap((res: any) => {
        const data = res?.data ?? res;
        this._countries.set(data?.countries || []);
        this._maritalStatus.set(data?.maritalStatus || []);
        const rawJobs = data?.jobTitles || data?.jobTitle || [];
        const mappedJobs = (Array.isArray(rawJobs) ? rawJobs : []).map((item: any) => {
          if (typeof item === 'string') return item;
          return item.titleAr || item.titleEn || item.nameAr || item.nameEn || item.name || item.title || '';
        }).filter(Boolean);
        this._jobTitles.set(mappedJobs);
      })
    );
  }
}
