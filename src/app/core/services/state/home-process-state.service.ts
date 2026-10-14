import { Injectable, signal } from '@angular/core';

@Injectable()
export class HomeProcessStateService {
  private _patients = signal<any[]>([]);
  readonly patients = this._patients.asReadonly();

  hydrateFromLoginResponse(res: any): void {
    const data = res?.data ?? res;
    const patients = data?.user?.patients;
    if (Array.isArray(patients) && patients.length > 0) {
      this._patients.set(patients);
    }
  }

  setPatients(patients: any[]): void {
    this._patients.set(patients);
  }
}
