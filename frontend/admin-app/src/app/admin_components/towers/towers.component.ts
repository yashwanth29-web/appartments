import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ToastrService } from 'ngx-toastr';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  standalone: true,
  selector: 'app-towers',
  imports: [CommonModule, FormsModule, Navbar, LoadingSpinnerComponent],
  templateUrl: './towers.component.html',
  styleUrls: ['./towers.component.css']
})
export class TowersComponent implements OnInit {
  name = '';
  towers: any[] = [];
  isLoading = true;

  constructor(
    private api: ApiService, 
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadTowers();
  }

  loadTowers() {
    this.isLoading = true;
    this.cdr.detectChanges();
    
    this.api.getTowers().subscribe({
      next: (res: any) => {
        this.towers = res || [];
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.towers = [];
        this.isLoading = false;
        this.cdr.detectChanges();
        this.toastr.error('Failed to load towers', 'Error');
      }
    });
  }

  startEdit(t: any) {
    t.editing = true;
    t.editName = t.name;
  }

  cancelEdit(t: any) {
    t.editing = false;
    delete t.editName;
  }

  saveEdit(t: any) {
    const name = (t.editName || '').trim();
    if (!name) {
      this.toastr.warning('Please enter a name', 'Validation');
      return;
    }
    this.api.updateTower(t.id, name).subscribe({
      next: () => {
        t.editing = false;
        this.toastr.success('Tower updated', 'Success');
        this.loadTowers();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Update failed', 'Error');
      }
    });
  }

  deleteTower(t: any) {
    if (!confirm(`Delete tower "${t.name}"?`)) return;
    this.api.deleteTower(t.id).subscribe({
      next: () => {
        this.toastr.success('Tower deleted', 'Success');
        this.loadTowers();
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Delete failed', 'Error');
      }
    });
  }

  createTower() {
    if (!this.name || !this.name.trim()) {
      this.toastr.warning('Please enter a tower name', 'Validation');
      return;
    }

    this.api.createTower(this.name.trim()).subscribe({
      next: () => {
        this.toastr.success('Tower created', 'Success');
        this.name = '';
        this.loadTowers();
      },
      error: () => {
        this.toastr.error('Failed to create tower', 'Error');
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    location.href = '/';
  }
}
