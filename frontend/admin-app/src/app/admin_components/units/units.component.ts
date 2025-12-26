import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-units',
  imports: [CommonModule, FormsModule, Navbar, LoadingSpinnerComponent],
  templateUrl: './units.component.html',
  styleUrls: ['./units.component.css']
})
export class UnitsComponent implements OnInit {
  units: any[] = [];
  filteredUnits: any[] = [];
  towers: any[] = [];
  isLoading = true;
  
  flat_number = '';
  rent = 0;
  tower_name = '';
  image = '';
  
  // Search
  searchFlat = '';
  
  // Edit mode
  editMode = false;
  editingUnitId: number | null = null;

  constructor(
    public api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadUnits();
    this.loadTowers();
  }

  loadTowers() {
    this.api.getTowers().subscribe({
      next: (res: any) => {
        this.towers = res;
      },
      error: () => {}
    });
  }

  filterUnits() {
    if (!this.searchFlat.trim()) {
      this.filteredUnits = this.units;
    } else {
      this.filteredUnits = this.units.filter(u => 
        u.flat_number?.toLowerCase().includes(this.searchFlat.toLowerCase())
      );
    }
  }

  loadUnits() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getAdminUnits().subscribe({
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

  deleteUnit(id: number): void {
    if (confirm('Are you sure you want to delete this unit?')) {
      this.api.deleteUnit(id).subscribe({
        next: () => {
          this.toastr.success('Unit deleted successfully', 'Success');
          this.loadUnits();
        },
        error: () => {
          this.toastr.error('Failed to delete unit', 'Error');
        }
      });
    }
  }

  editUnit(unit: any): void {
    this.editMode = true;
    this.editingUnitId = unit.id;
    this.flat_number = unit.flat_number;
    this.rent = unit.rent;
    this.tower_name = unit.tower_name || '';
    this.image = unit.image || '';
  }

  cancelEdit(): void {
    this.editMode = false;
    this.editingUnitId = null;
    this.flat_number = '';
    this.rent = 0;
    this.tower_name = '';
    this.image = '';
  }

  saveUnit() {
    if (!this.flat_number || !this.rent || !this.tower_name) {
      this.toastr.warning('Please fill all required fields', 'Validation');
      return;
    }

    const data = {
      flat_number: this.flat_number,
      rent: this.rent,
      tower_name: this.tower_name,
      image: this.image
    };

    if (this.editMode && this.editingUnitId) {
      this.api.updateUnit(this.editingUnitId, data).subscribe({
        next: () => {
          this.toastr.success('Unit updated successfully', 'Success');
          this.cancelEdit();
          this.loadUnits();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to update unit', 'Error');
        }
      });
    } else {
      this.api.createUnit(data).subscribe({
        next: () => {
          this.toastr.success('Unit added', 'Success');
          this.cancelEdit();
          this.loadUnits();
        },
        error: (err) => {
          this.toastr.error(err?.error?.message || 'Failed to create unit', 'Error');
        }
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    location.href = '/';
  }
}
