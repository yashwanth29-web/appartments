import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-bookings',
  imports: [CommonModule, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  bookings: any[] = [];
  isLoading = true;

  constructor(
    private api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.myBookings().subscribe({
      next: (res: any) => {
        this.bookings = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load bookings', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
