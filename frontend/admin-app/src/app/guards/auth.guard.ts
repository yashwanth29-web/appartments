import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

/* 🔐 Common login check (User + Admin) */
export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  router.navigate(['/']);
  return false;
};

/* 🛡️ Admin-only check */
export const adminAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (token && role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
