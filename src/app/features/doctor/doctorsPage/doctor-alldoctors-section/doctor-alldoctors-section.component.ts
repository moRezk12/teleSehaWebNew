import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DatePickerModule } from 'primeng/datepicker';
import { LocalstorageService } from '../../../../core/services/localstorage.service';
import { IDoctorResponse } from '../../../../shared/interface/doctor.interface';
import { BookingSessionService } from '../../../../shared/services/booking-session.service';
import { DoctorsService } from '../../../../shared/services/doctors.service';
import { SliderModule } from 'primeng/slider';
import { Select } from 'primeng/select';
import { SpecialtiesService } from '../../../../shared/services/specialties.service';
import { debounceTime, Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-doctor-alldoctors-section',
  imports: [
    FormsModule,
    DatePickerModule,
    CommonModule,
    RouterLink,
    Select,
    SliderModule,
    TranslateModule,
  ],
  templateUrl: './doctor-alldoctors-section.component.html',
  styleUrl: './doctor-alldoctors-section.component.css',
})
export class DoctorAlldoctorsSectionComponent implements OnInit {
  doctorId: string | null = null;
  date1: Date | undefined;

  doctors: IDoctorResponse[] = [];
  filterForm!: FormGroup;

  // Filters
  searchText: string = '';
  selectedPrice: number | null = null;
  availableDate: string | null = null;
  selectedSpeciality: number | null = null;
  maxPrice: number = 500;

  dateOptions = [
    { label: 'Today', value: 'today' },
    { label: 'This Week', value: 'week' },
    { label: 'This Month', value: 'month' },
  ];

  sessions: any[] = [];
  uniqueDays: any[] = [];

  selectedDate: string | null = null;
  selectedSessionId: number | null = null;

  constructor(
    readonly fb: FormBuilder,
    readonly doctorsService: DoctorsService,
    readonly bookingSessionService: BookingSessionService,
    readonly toastr: ToastrService,
    readonly localStorageService: LocalstorageService,
    readonly specailtiesService: SpecialtiesService,
  ) {}

  ngOnInit(): void {
    this.getSpecialties();
    this.getDoctors();

    this.searchSubject.pipe(debounceTime(600)).subscribe(() => {
      this.applyFilters();
    });
  }

  specialties: any[] = [];
  getSpecialties() {
    this.specailtiesService.getSpecialties().subscribe({
      next: (res: any) => {
        console.log(res);
        this.specialties = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : []);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  searchSubject = new Subject<string>();

  page: number = 1;
  pageSize: number = 10;
  totalCount: number = 0;
  totalPages: number = 1;
  isLoading: boolean = false;

  getDoctors(page: number = 1) {
    this.page = page;
    this.isLoading = true;

    this.doctorsService
      .getDoctors({
        Search: this.searchText?.trim() || null,
        SpecialityId: this.selectedSpeciality,
        MaxPrice: this.maxPrice || null,
        AvailableDate: this.availableDate || null,
        page: this.page,
        pageSize: this.pageSize,
      })
      .subscribe({
        next: (res: any) => {
          const newDoctors = Array.isArray(res?.data)
            ? res.data
            : (Array.isArray(res?.data?.items)
              ? res.data.items
              : (Array.isArray(res) ? res : []));

          this.doctors = newDoctors;

          const total = res?.totalCount
            ?? res?.data?.totalCount
            ?? res?.meta?.totalCount
            ?? res?.total
            ?? res?.data?.total
            ?? res?.count;

          if (typeof total === 'number') {
            this.totalCount = total;
            this.totalPages = Math.max(1, Math.ceil(total / this.pageSize));
          } else {
            if (newDoctors.length < this.pageSize) {
              this.totalCount = (this.page - 1) * this.pageSize + newDoctors.length;
              this.totalPages = this.page;
            } else {
              this.totalPages = this.page + 1;
            }
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error fetching doctors:', err);
          this.isLoading = false;
        },
      });
  }

  applyFilters() {
    this.page = 1;
    this.getDoctors(1);
  }

  resetFilters() {
    this.searchText = '';
    this.selectedPrice = null;
    this.maxPrice = 500;
    this.availableDate = null;
    this.selectedSpeciality = null;
    this.page = 1;
    this.getDoctors(1);
  }

  onSearchChange() {
    this.searchSubject.next(this.searchText);
  }

  onPageChange(page: number) {
    if (page < 1 || page > this.totalPages || page === this.page || this.isLoading) {
      return;
    }
    this.getDoctors(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pagesArray(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(h, m);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  }
}
