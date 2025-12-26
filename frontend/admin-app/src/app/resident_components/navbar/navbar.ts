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

ngOnInit() {
  this.currentRoute = this.router.url;
}

navigate(route: string) {
  this.currentRoute = route;
  this.router.navigate([route]);
}
  

  logout() {
    localStorage.clear();
    this.router.navigate(['/']);
  }
}
