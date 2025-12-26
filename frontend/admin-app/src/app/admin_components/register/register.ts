import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  name = '';
  email = '';
  password = '';
  role = 'user';

  constructor(
    private api: ApiService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  register() {
    if (!this.name || !this.email || !this.password) {
      this.toastr.warning('Please fill all fields', 'Validation');
      return;
    }

    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.api.register(data).subscribe({
      next: () => {
        this.toastr.success(`${this.role} registered successfully`, 'Success');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.toastr.error(err?.error?.message || 'Registration failed', 'Error');
      }
    });
  }
}
