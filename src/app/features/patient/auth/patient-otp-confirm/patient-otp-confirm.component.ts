import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { AuthLogoComponent } from '../../../../shared/components/auth-logo/auth-logo.component';
import { AuthLeftSideComponent } from '../../../../shared/components/auth-left-side/auth-left-side.component';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { GlobalUserStateService } from '../../../../core/services/state/global-user-state.service';
import { AuthProcessStateService } from '../../../../core/services/state/auth-process-state.service';
import { PatientAuthService } from '../../service/patient-auth.service';
import { INextStepEnum } from '../../../../core/models/nextStepEnum';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-otp-confirm',
  imports: [
    AuthLogoComponent,
    AuthLeftSideComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './patient-otp-confirm.component.html',
  styleUrl: './patient-otp-confirm.component.css',
})
export class PatientOtpConfirmComponent {
  otpForm!: FormGroup;
  otpArray: string[] = ['', '', '', '', '', ''];
  showError: boolean = false;
  mobile: string = '';

  isLoading: boolean = false;

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;

  constructor(
    readonly fb: FormBuilder,
    readonly route: Router,
    readonly globalUserStateService: GlobalUserStateService,
    readonly authProcessStateService: AuthProcessStateService,
    readonly patientAuthService: PatientAuthService,
    readonly toastr: ToastrService,
  ) {
    this.mobile = this.authProcessStateService.mobile();
  }

  ngOnInit(): void {
    this.otpForm = this.fb.group({
      otp: [''],
    });
  }

  controls = new Array(6);

  onInput(event: any, index: number) {
    const value = event.target.value;

    if (!/^[0-9]$/.test(value)) {
      event.target.value = '';
      return;
    }

    this.otpArray[index] = value;
    this.showError = false;

    if (index < 5) {
      const inputs = this.otpInputs.toArray();
      inputs[index + 1].nativeElement.focus();
    }
  }

  //  Backspace
  onKeyDown(event: KeyboardEvent, index: number) {
    const inputs = this.otpInputs.toArray();
    if (event.key !== 'Backspace') return;

    event.preventDefault();

    const curr = inputs[index].nativeElement as HTMLInputElement;

    if (curr.value) {
      curr.value = '';
      this.otpArray[index] = '';
      if (index > 0) {
        const prev = inputs[index - 1].nativeElement as HTMLInputElement;
        prev.focus();
      }
    } else {
      if (index > 0) {
        const prev = inputs[index - 1].nativeElement as HTMLInputElement;
        prev.value = '';
        this.otpArray[index - 1] = '';
        prev.focus();
      }
    }
  }

  submitOtp() {
    const code = this.otpArray.join('');

    if (code.length < 6) {
      this.showError = true;
      return;
    }

    this.otpForm.patchValue({ otp: code });

    const payload = { mobile: this.mobile, otp: code };

    this.isLoading = true;
    this.patientAuthService.otpConfirm(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.toastr.success('OTP Confirmed Successfully');
        const token = res?.data?.token || (typeof res?.data === 'string' ? res.data : null) || res?.token || res?.data;
        if (token) {
          this.setCookie('createPasswordToken', token, 1);
          this.authProcessStateService.setCreatePasswordToken(token);
        }
        const nextStep = res?.meta?.nextStep ?? res?.nextStep;
        if (nextStep === INextStepEnum.CreatePassword) {
          this.globalUserStateService.hydrateNextStep(nextStep);
          this.route.navigate(['patient/auth/password'], { replaceUrl: true });
        }
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  setCookie(name: string, value: string, days = 1) {
    if (typeof document === 'undefined') return;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
  }

  clearLocalStorage() {
    this.globalUserStateService.clearUserData();
    this.authProcessStateService.clearAuthData();
    this.route.navigate(['/'], { replaceUrl: true });
  }
}
