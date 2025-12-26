import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { NavbarComponent } from '../navbar/navbar';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-amenities',
  imports: [CommonModule, FormsModule, NavbarComponent, LoadingSpinnerComponent],
  templateUrl: './amenities.html',
  styleUrl: './amenities.css',
})
export class Amenities implements OnInit {

  // All amenities from API
  amenities: any[] = [];

  // Grouped by tower_id
  groupedAmenities: { [towerId: number]: any[] } = {};

  // Sorted tower IDs (1,2,3...)
  towerKeys: number[] = [];

  // Search input
  searchText: string = '';
  
  // Loading state
  isLoading = true;

  constructor(
    public api: ApiService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadAmenities();
  }

  loadAmenities(): void {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getResidentAmenities().subscribe({
      next: (res: any[]) => {
        this.amenities = res;
        this.applyGrouping(res);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  // Triggered on search input
  search(): void {
    const filtered = this.amenities.filter(a =>
      a.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
    this.applyGrouping(filtered);
  }

  // Group amenities tower-wise
  private applyGrouping(list: any[]): void {
    this.groupedAmenities = {};

    list.forEach(a => {
      if (!this.groupedAmenities[a.tower_id]) {
        this.groupedAmenities[a.tower_id] = [];
      }
      this.groupedAmenities[a.tower_id].push(a);
    });

    // Sort tower IDs
    this.towerKeys = Object.keys(this.groupedAmenities)
      .map(Number)
      .sort((a, b) => a - b);
  }
}
