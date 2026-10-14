import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { DoctorMeetingVideoCallComponent } from '../doctor-meeting-video-call/doctor-meeting-video-call.component';
import { DoctorChatVideoCallComponent } from '../doctor-chat-video-call/doctor-chat-video-call.component';
import { CommonModule } from '@angular/common';
import { PopupDoctorComponent } from "../popup-doctor/popup-doctor.component";
import { Router, ActivatedRoute } from '@angular/router';
import { DoctorsService } from '../../../../shared/services/doctors.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { MeetingDiagnosisStateService } from '../../service/meeting-diagnosis-state.service';

@Component({
  selector: 'app-doctor-view-video-call',
  imports: [
    CommonModule,
    DoctorMeetingVideoCallComponent,
    DoctorChatVideoCallComponent,
    PopupDoctorComponent,
    TranslateModule
],
  templateUrl: './doctor-view-video-call.component.html',
  styleUrl: './doctor-view-video-call.component.css',
})
export class DoctorViewVideoCallComponent implements OnInit, OnDestroy {
  showWhatsapp = false;
  meetingId!: number;
  isValidating = true;
  isMeetingValid = false;
  meetingReport: any = null;

  private readonly diagnosisState = inject(MeetingDiagnosisStateService);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private doctorService: DoctorsService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.meetingId = Number(params['meetingId']);
      // ميتينج جديد يبدأ بحالة تشخيص فاضية لحد ما السيرفر يقول العكس، عشان
      // ماينفعش تشخيص كشف سابق يفضل مفعّل الأزرار في كشف جديد.
      this.diagnosisState.reset();
      if (this.meetingId) {
        this.checkMeetingStatus();
      } else {
        this.router.navigate(['/doctor/home']);
      }
    });
  }

  checkMeetingStatus() {
    this.doctorService.getReports(this.meetingId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        if (data?.status === 2 || data?.status === 3) {
          const message = data?.status === 3
            ? 'هذه الجلسة تم إلغاؤها'
            : 'هذه الجلسة انتهت بالفعل';
          this.toastr.warning(message);
          this.router.navigate(['/doctor/home']);
          return;
        }

        this.meetingReport = data;
        this.diagnosisState.setFromMeetingReport(this.meetingId, data?.diagnoses);
        this.isMeetingValid = true;
        this.isValidating = false;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('فشل تحميل بيانات الجلسة');
        this.router.navigate(['/doctor/home']);
      }
    });
  }

  /**
   * إعادة تحميل بيانات الميتينج لما المريض يدخل القناة — نسبة التحسن بيسجّلها
   * المريض لحظة دخوله، يعني بعد ما الصفحة دي حمّلت بوقت. تحديث فقط، من غير
   * منطق الطرد بتاع checkMeetingStatus: دا صح عند الدخول وغلط في نص مكالمة شغّالة.
   */
  refreshMeetingReport() {
    if (!this.meetingId) return;
    this.doctorService.getReports(this.meetingId).subscribe({
      next: (res: any) => {
        const data = res?.data ?? res;
        this.meetingReport = data;
        this.diagnosisState.setFromMeetingReport(this.meetingId, data?.diagnoses);
      },
      error: () => {
        // بنسيب آخر نسخة موجودة — فشل تحديث ماينفعش يقطع المكالمة.
      },
    });
  }

  ngOnDestroy(): void {
    this.diagnosisState.reset();
    localStorage.removeItem('agoraDetails');
    localStorage.removeItem('meetingId');
    localStorage.removeItem('channelName');
    localStorage.removeItem('checkUpId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('meetingToken');
    // مفاتيح قديمة كانت بتعيش عبر الميتينجات وتخلي البوب أب يعدّل روشتة/طلب ميتينج
    // تاني (403). الكود مبقاش يكتبها — بنمسحها من المتصفحات اللي لسه شايلاها.
    localStorage.removeItem('prescriptionId');
    localStorage.removeItem('labTestId');
    localStorage.removeItem('radiologyId');
  }
}
