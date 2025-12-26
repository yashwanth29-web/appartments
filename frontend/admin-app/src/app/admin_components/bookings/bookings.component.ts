import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-bookings',
  imports: [CommonModule, Navbar, LoadingSpinnerComponent],
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.css']
})
export class BookingsComponent implements OnInit {
  results: any[] = [];
  isLoading = true;

  constructor(
    private api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getAdminBookings().subscribe({
      next: (res: any) => {
        this.results = res;
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

  update(id: number, status: string): void {
    this.api.updateBooking(id, status).subscribe({
      next: () => {
        if (status === 'approved') {
          this.toastr.success('Booking approved! Lease created automatically.', 'Success');
        } else if (status === 'rejected') {
          this.toastr.info('Booking rejected and removed.', 'Info');
        } else {
          this.toastr.success('Booking updated', 'Success');
        }
        this.loadBookings();
      },
      error: () => {
        this.toastr.error('Failed to update booking', 'Error');
      }
    });
  }
}
