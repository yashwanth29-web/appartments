import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../navbar/navbar';
import { ApiService } from '../../services/api.service';
import { OnInit } from '@angular/core';
import {  RouterModule } from '@angular/router';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Navbar,RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {

  stats: any = {};

  // Dynamic array for the 6 quick stats cards (uses API data)
  statsArray: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAdminDashboard().subscribe((res: any) => {
      this.stats = res;

      // Map API data to our 6 cards (adjust keys based on your real API response)
      this.statsArray = [
        {
          title: 'Total Towers',
          value: this.stats.totalTowers || '12',
          change: '+2 this month',
          positive: true,
          image: 'https://img.icons8.com/fluency/96/000000/skyscrapers.png',
          highlight: true
        },
        {
          title: 'Active Units',
          value: this.stats.activeUnits || '156',
          change: '92% occupancy',
          positive: true,
          image: 'https://img.icons8.com/fluency/96/000000/apartment.png'
        },
        {
          title: 'Pending Bookings',
          value: this.stats.pendingBookings || '9',
          change: 'Requires attention',
          attention: true,
          image: 'https://img.icons8.com/fluency/96/000000/calendar.png'
        },
        {
          title: 'Monthly Revenue',
          value: this.stats.monthlyRevenue || '$248K',
          change: '+18% vs last',
          positive: true,
          image: 'https://img.icons8.com/fluency/96/000000/money.png'
        },
        {
          title: 'Total Tenants',
          value: this.stats.totalTenants || '384',
          change: '+14 this month',
          positive: true,
          image: 'https://img.icons8.com/fluency/96/000000/group.png'
        },
        {
          title: 'Occupancy Rate',
          value: this.stats.occupancyRate || '94%',
          change: 'All-time high',
          positive: true,
          image: 'https://img.icons8.com/fluency/96/000000/percentage.png'
        }
      ];
    });
  }
}