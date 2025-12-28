import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {

  // Base URL - empty string for production (uses relative paths with nginx proxy)
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /* ================= COMMON ================= */

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  getImageUrl(filename?: string | null): string {
    if (!filename) {
      return `${this.baseUrl}/static/images/placeholder.svg`;
    }
    if (filename.startsWith('http')) {
      return filename;
    }
    return `${this.baseUrl}/static/images/${filename}`;
  }

  /* ================= AUTH ================= */

  login(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, data);
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, data);
  }

  /* ================= RESIDENT APIs ================= */

  getResidentUnits(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/units`,
      { headers: this.authHeaders() }
    );
  }

  bookUnit(unitId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bookings`,
      { unit_id: unitId },
      { headers: this.authHeaders() }
    );
  }

  myBookings(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/bookings/my`,
      { headers: this.authHeaders() }
    );
  }

  getResidentAmenities(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/amenities`,
      { headers: this.authHeaders() }
    );
  }

  /* ================= ADMIN APIs ================= */

  getAdminDashboard(): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/admin/dashboard`,
      { headers: this.authHeaders() }
    );
  }

  /* ----- Towers ----- */
  getTowers(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/towers`,
      { headers: this.authHeaders() }
    );
  }

  createTower(name: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/admin/towers`,
      { name },
      { headers: this.authHeaders() }
    );
  }

  updateTower(id: number, name: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admin/towers/${id}`,
      { name },
      { headers: this.authHeaders() }
    );
  }

  deleteTower(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/admin/towers/${id}`,
      { headers: this.authHeaders() }
    );
  }

  /* ----- Units ----- */
  getAdminUnits(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/units`,
      { headers: this.authHeaders() }
    );
  }

  createUnit(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/admin/units`,
      data,
      { headers: this.authHeaders() }
    );
  }

  updateUnit(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admin/units/${id}`,
      data,
      { headers: this.authHeaders() }
    );
  }

  deleteUnit(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/admin/units/${id}`,
      { headers: this.authHeaders() }
    );
  }

  /* ----- Bookings ----- */
  getAdminBookings(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/bookings`,
      { headers: this.authHeaders() }
    );
  }

  updateBooking(id: number, status: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admin/bookings/${id}`,
      { status },
      { headers: this.authHeaders() }
    );
  }

  /* ----- Amenities ----- */
  getAdminAmenities(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/amenities`,
      { headers: this.authHeaders() }
    );
  }

  addAmenity(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/admin/amenities`,
      data,
      { headers: this.authHeaders() }
    );
  }

  updateAmenity(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admin/amenities/${id}`,
      data,
      { headers: this.authHeaders() }
    );
  }

  deleteAmenity(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/admin/amenities/${id}`,
      { headers: this.authHeaders() }
    );
  }

  /* ----- Leases ----- */
  getLeases(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/admin/leases`,
      { headers: this.authHeaders() }
    );
  }

  createLease(data: any): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/admin/leases`,
      data,
      { headers: this.authHeaders() }
    );
  }

  updateLease(id: number, data: any): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/admin/leases/${id}`,
      data,
      { headers: this.authHeaders() }
    );
  }

  deleteLease(id: number): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}/admin/leases/${id}`,
      { headers: this.authHeaders() }
    );
  }
}
