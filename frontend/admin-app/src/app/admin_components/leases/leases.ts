import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../navbar/navbar';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-leases',
  imports: [CommonModule, FormsModule, Navbar, LoadingSpinnerComponent],
  templateUrl: './leases.html',
  styleUrl: './leases.css',
})
export class Leases implements OnInit {
  leases: any[] = [];
  isLoading = true;

  form = {
    Booking_id: 0,
    flat_number: '',
    user_name: ''
  };

  constructor(
    private api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLeases();
  }

  loadLeases() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getLeases().subscribe({
      next: (res: any) => {
        this.leases = res;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load leases', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  createLease() {
    if (!this.form.flat_number) {
      this.toastr.warning('Please enter flat number', 'Validation');
      return;
    }

    this.api.createLease(this.form).subscribe({
      next: () => {
        this.toastr.success('Lease created', 'Success');
        this.form = { Booking_id: 0, flat_number: '', user_name: '' };
        this.loadLeases();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Failed to create lease', 'Error');
      }
    });
  }

  deleteLease(id: number) {
    if (confirm('End this lease?')) {
      this.api.deleteLease(id).subscribe({
        next: () => {
          this.toastr.success('Lease deleted', 'Success');
          this.loadLeases();
        },
        error: () => {
          this.toastr.error('Failed to delete lease', 'Error');
        }
      });
    }
  }
}
