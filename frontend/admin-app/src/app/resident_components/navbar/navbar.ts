import { Component , HostListener} from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,  
  imports: [CommonModule,RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  currentRoute: string = '';
  mobileMenuOpen: boolean = false;

  ngOnInit() {
    this.currentRoute = this.router.url;
  }

  navigate(route: string) {
    this.currentRoute = route;
    this.closeMobileMenu();
    this.router.navigate([route]);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
  }

  logout() {
    this.closeMobileMenu();
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
