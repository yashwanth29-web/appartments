import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { RouterModule } from '@angular/router';
import { Navbar } from '../navbar/navbar';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  stats: any = {};

  statsArray: any[] = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.api.getAdminDashboard().subscribe((res: any) => {
      this.stats = res || {};

      this.statsArray = [
        {
          title: 'Total Towers',
          value: 0,
          finalValue: this.stats.totalTowers || 12,
          suffix: '',
          change: '+2 this month',
          positive: true,
          negative: false,
          trending: 'Hot',
          image: 'https://img.icons8.com/fluency/96/000000/skyscrapers.png',
          bg: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
          highlight: true
        },
        {
          title: 'Active Units',
          value: 0,
          finalValue: this.stats.totalUnits || 156,
          suffix: '',
          change: '92% occupancy',
          positive: true,
          negative: false,
          trending: 'Stable',
          image: 'https://img.icons8.com/fluency/96/000000/apartment.png',
          bg: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'
        },
        {
          title: 'Pending Bookings',
          value: 0,
          finalValue: this.stats.pendingBookings || 9,
          suffix: '',
          change: 'Requires attention',
          attention: true,
          positive: false,
          negative: false,
          trending: 'Critical',
          image: 'https://img.icons8.com/fluency/96/000000/calendar.png',
          bg: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'
        },
        {
          title: 'Occupied Units',
          value: 0,
          finalValue: this.stats.occupiedUnits || 0,
          suffix: '',
          change: 'Currently rented',
          positive: true,
          negative: false,
          trending: 'Growing',
          image: 'https://img.icons8.com/fluency/96/000000/money.png',
          bg: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80'
        },
        {
          title: 'Active Leases',
          value: 0,
          finalValue: this.stats.activeLeases || 0,
          suffix: '',
          change: 'Running contracts',
          positive: true,
          negative: false,
          trending: 'Stable',
          image: 'https://img.icons8.com/fluency/96/000000/signing-a-document.png',
          bg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80'
        },
        {
          title: 'Total Amenities',
          value: 0,
          finalValue: this.stats.totalAmenities || 0,
          suffix: '',
          change: 'Premium facilities',
          positive: true,
          negative: false,
          trending: 'Growing',
          image: 'https://img.icons8.com/fluency/96/000000/swimming-pool.png',
          bg: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80'
        }
      ];

      this.statsArray.forEach(stat => {
        this.animateCount(stat);
      });
    });
  }

  animateCount(stat: any, duration: number = 1200) {
    let start = 0;
    const end = stat.finalValue;
    const step = Math.max(1, Math.floor(end / (duration / 16)));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        stat.value = end;
        clearInterval(timer);
      } else {
        stat.value = start;
      }
    }, 16);
  }
}
