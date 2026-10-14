import { Injectable, signal } from '@angular/core';

@Injectable()
export class PatientRegistrationStateService {
  private _patientId = signal<string>('');
  readonly patientId = this._patientId.asReadonly();

  private _patientName = signal<string>('');
  readonly patientName = this._patientName.asReadonly();

  hydrateFromRegistrationResponse(res: any): void {
    const data = res?.data ?? res;
    if (data?.patientId) {
      this._patientId.set(data.patientId.toString());
    }
  }

  setPatientId(id: string): void {
    this._patientId.set(id);
  }

  setPatientName(name: string): void {
    this._patientName.set(name);
  }

  clearRegistrationData(): void {
    this._patientId.set('');
    this._patientName.set('');
  }
}
