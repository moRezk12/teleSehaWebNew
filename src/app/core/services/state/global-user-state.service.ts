import { Injectable, Inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { decodeJwtPayload, JwtUserClaims, getJwtUserDetails } from '../../utils/jwt.utils';

@Injectable({
  providedIn: 'root',
})
export class GlobalUserStateService {

  // Stored in localStorage
  private _refreshToken = signal<string>('');
  readonly refreshToken = this._refreshToken.asReadonly();

  // Stored in memory only
  private _accessToken = signal<string>('');
  readonly accessToken = this._accessToken.asReadonly();

  private _role = signal<string | null>(null);
  readonly role = this._role.asReadonly();

  private _userId = signal<string | null>(null);
  readonly userId = this._userId.asReadonly();

  private _nextStepEnum = signal<string>('');
  readonly nextStepEnum = this._nextStepEnum.asReadonly();

  // User details
  private _userName = signal<string>('');
  readonly userName = this._userName.asReadonly();

  // Doctor Data (Populated if user has a doctor profile)
  private _doctorId = signal<string>('');
  readonly doctorId = this._doctorId.asReadonly();

  private _doctorName = signal<string>('');
  readonly doctorName = this._doctorName.asReadonly();

  private _doctorImage = signal<string>('');
  readonly doctorImage = this._doctorImage.asReadonly();

  // Patient Data (Populated if user has patient profiles)
  private _patientId = signal<string>('');
  readonly patientId = this._patientId.asReadonly();

  private _patientName = signal<string>('');
  readonly patientName = this._patientName.asReadonly();

  private _loggedInPatientId = signal<string | null>(null);
  readonly loggedInPatientId = this._loggedInPatientId.asReadonly();

  private _patients = signal<any[]>([]);
  readonly patients = this._patients.asReadonly();

  private _isInitialized = signal<boolean>(false);
  readonly isInitialized = this._isInitialized.asReadonly();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const storedRefreshToken = localStorage.getItem('refreshToken') || '';
      this._refreshToken.set(storedRefreshToken);
    }
  }

  hydrateFromLoginResponse(res: any): void {
    const data = res?.data ?? res;
    if (data?.accessToken) {
      this._accessToken.set(data.accessToken);
    }

    if (data?.refreshToken) {
      this._refreshToken.set(data.refreshToken);
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('refreshToken', data.refreshToken);
      }
    }

    const nextStep = res?.meta?.nextStep ?? res?.nextStep ?? data?.nextStep;
    if (nextStep) {
      this._nextStepEnum.set(nextStep);
    }

    if (data?.user?.role) {
      this._role.set(data.user.role);
    }

    if (data?.user?.name) {
       this._userName.set(data.user.name);
    }

    // Doctor Data
    if (data?.user?.doctor) {
      const doctor = data.user.doctor;
      this._doctorId.set(doctor.doctorId?.toString() || '');
      this._doctorName.set(doctor.name || '');
      this._doctorImage.set(doctor.imageUrl || '');
    }

    // Patient Data
    if (data?.user?.patients?.length > 0) {
      const firstPatient = data.user.patients[0];
      this._patientName.set(firstPatient.name || '');
      this._patientId.set(firstPatient.patientId?.toString() || '');
      this._loggedInPatientId.set(firstPatient.patientId?.toString() || null);
      this._patients.set(data.user.patients);
    }

    if (!data?.user?.role && data?.accessToken) {
      const payload = decodeJwtPayload<JwtUserClaims>(data.accessToken);
      const details = getJwtUserDetails(payload);
      if (details?.role) this._role.set(details.role);
      if (details?.userId) this._userId.set(details.userId);
    }

    this._isInitialized.set(true);
  }

  hydrateNextStep(nextStep: string) {
    if (nextStep) {
      this._nextStepEnum.set(nextStep);
    }
  }

  selectPatientProfile(patientId: string, patientName: string) {
    this._patientId.set(patientId);
    this._patientName.set(patientName);
    this._loggedInPatientId.set(patientId);
  }

  setRefreshToken(token: string): void {
    this._refreshToken.set(token);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('refreshToken', token);
    }
  }

  clearUserData(): void {
    this._accessToken.set('');
    this._refreshToken.set('');
    this._role.set(null);
    this._userId.set(null);
    this._nextStepEnum.set('');
    this._userName.set('');
    this._doctorId.set('');
    this._doctorName.set('');
    this._doctorImage.set('');
    this._patientName.set('');
    this._patientId.set('');
    this._loggedInPatientId.set(null);
    this._patients.set([]);
    this._isInitialized.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('refreshToken');
    }

    if (typeof document !== 'undefined') {
      document.cookie = 'createPasswordToken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    }
  }
}
