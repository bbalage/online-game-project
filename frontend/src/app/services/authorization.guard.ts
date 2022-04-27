import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const expires_at = localStorage.getItem('expires_at');
    
    if (expires_at == null || new Date() > new Date(expires_at)) {
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}
