
import { Injectable, Inject, inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { state } from '@angular/animations';

export const CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  } else {
    // Navigate to login page with a query parameter 'message'
    router.navigate(['/login'], { queryParams: { message: 'You need to login to access this page' } });
    return false;
  }
};


