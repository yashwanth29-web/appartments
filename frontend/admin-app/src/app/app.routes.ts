import { Routes } from '@angular/router';

/* 🔐 Guards */
import { authGuard, adminAuthGuard } from './guards/auth.guard';

/* 🔑 Shared */
import { LoginComponent } from './admin_components/login/login.component';

/* 👤 Resident Components */
import { HomeComponent } from './resident_components/home/home';
import { UnitsComponent as ResidentUnits } from './resident_components/units/units.component';
import { BookingsComponent as ResidentBookings } from './resident_components/bookings/bookings.component';
import { Amenities as ResidentAmenities } from './resident_components/amenities/amenities';

/* 🛡️ Admin Components */
import { Home as AdminHome } from './admin_components/home/home';
import { Dashboard } from './admin_components/dashboard/dashboard';
import { TowersComponent } from './admin_components/towers/towers.component';
import { UnitsComponent as AdminUnits } from './admin_components/units/units.component';
import { BookingsComponent as AdminBookings } from './admin_components/bookings/bookings.component';
import { Amenities as AdminAmenities } from './admin_components/amenities/amenities';
import { Leases } from './admin_components/leases/leases';
import { Register } from './admin_components/register/register';

export const routes: Routes = [

  /* ================= PUBLIC ================= */
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  /* ================= RESIDENT ================= */
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'units', component: ResidentUnits, canActivate: [authGuard] },
  { path: 'bookings', component: ResidentBookings, canActivate: [authGuard] },
  { path: 'amenities', component: ResidentAmenities, canActivate: [authGuard] },

  /* ================= ADMIN ================= */
  { path: 'admin/home', component: AdminHome, canActivate: [adminAuthGuard] },
  { path: 'admin/dashboard', component: Dashboard, canActivate: [adminAuthGuard] },
  { path: 'admin/towers', component: TowersComponent, canActivate: [adminAuthGuard] },
  { path: 'admin/units', component: AdminUnits, canActivate: [adminAuthGuard] },
  { path: 'admin/bookings', component: AdminBookings, canActivate: [adminAuthGuard] },
  { path: 'admin/amenities', component: AdminAmenities, canActivate: [adminAuthGuard] },
  { path: 'admin/leases', component: Leases, canActivate: [adminAuthGuard] },
  { path: 'admin/register', component: Register },

  /* ================= FALLBACK ================= */
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
