import { Injectable } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationGuard implements CanActivate {
  constructor(private router: Router, private userService: UserService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const expires_at = sessionStorage.getItem('expires_at');

    if (!expires_at || new Date() > new Date(expires_at)) {
      this.router.navigateByUrl('/');
      return false;
    }

    let success = true;
    if (route.url[0].path == 'admin') {
      success = this.userService.checkAdmin();
      if(!success){
        this.router.navigateByUrl('/');
      }
    }

    return success;
  }
}
