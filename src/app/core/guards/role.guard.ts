import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'];
    
    if (!requiredRole) {
      return true;
    }

    if (requiredRole === 'admin' && this.authService.isAdmin()) {
      return true;
    }

    if (requiredRole === 'organization' && this.authService.isOrganizationUser()) {
      return true;
    }

    this.router.navigate(['/dashboard']);
    return false;
  }
}