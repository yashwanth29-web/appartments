import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-units',
  imports: [CommonModule, NavbarComponent, FormsModule, LoadingSpinnerComponent],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  units: any[] = [];
  filteredUnits: any[] = [];
  showPopup = false;
  selectedUnit: any = null;
  isLoading = true;
  
  // Search filters
  searchFlat = '';
  searchTower = '';
  maxRent: number | null = null;
  
  // Payment form fields
  cardNumber = '';
  cardExpiry = '';
  cardCvv = '';
  isProcessing = false;

  constructor(
    public api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUnits();
  }

  loadUnits() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getResidentUnits().subscribe({
      next: (res: any) => {
        this.units = res;
        this.filterUnits();
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.toastr.error('Failed to load units', 'Error');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  filterUnits() {
    this.filteredUnits = this.units.filter(u => {
      const matchFlat = !this.searchFlat || u.flat_number?.toLowerCase().includes(this.searchFlat.toLowerCase());
      const matchTower = !this.searchTower || u.tower_name?.toLowerCase().includes(this.searchTower.toLowerCase());
      const matchRent = !this.maxRent || u.rent <= this.maxRent;
      return matchFlat && matchTower && matchRent;
    });
  }

  openBookingPopup(unit: any) {
    this.selectedUnit = unit;
    this.showPopup = true;
  }

  closePopup() {
    this.selectedUnit = null;
    this.cardNumber = '';
    this.cardExpiry = '';
    this.cardCvv = '';
    this.showPopup = false;
    this.isProcessing = false;
  }

  confirmBooking() {
    if (!this.validatePayment()) {
      return;
    }

    this.isProcessing = true;
    
    // First create the booking
    this.api.bookUnit(this.selectedUnit.id).subscribe({
      next: () => {
        // Simulate payment processing
        setTimeout(() => {
          this.toastr.success('Payment successful! Your booking request has been submitted.', 'Success');
          this.closePopup();
          this.loadUnits();
        }, 1500);
      },
      error: (err) => {
        this.isProcessing = false;
        this.toastr.error(err?.error?.message || 'Booking failed', 'Error');
      }
    });
  }

  validatePayment(): boolean {
    if (!this.cardNumber || this.cardNumber.replace(/\s/g, '').length < 16) {
      this.toastr.warning('Please enter a valid card number', 'Validation');
      return false;
    }
    if (!this.cardExpiry || !this.cardExpiry.match(/^\d{2}\/\d{2}$/)) {
      this.toastr.warning('Please enter expiry in MM/YY format', 'Validation');
      return false;
    }
    if (!this.cardCvv || this.cardCvv.length < 3) {
      this.toastr.warning('Please enter a valid CVV', 'Validation');
      return false;
    }
    return true;
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/\D/g, '');
    value = value.substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    this.cardNumber = formatted;
  }

  formatExpiry(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.cardExpiry = value;
  }
}
