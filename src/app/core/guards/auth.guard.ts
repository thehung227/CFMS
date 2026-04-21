import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenService } from '../services/authen.service';
import { SystemConstants } from '../common/system.constants';
import { UrlConstants } from '../common/url.constants';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private auth: AuthenService) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // 1) Ưu tiên check theo OIDC (Keycloak)
    const isOidc = await this.auth.isAuthenticated(); // dùng UserManager.getUser()
    if (isOidc) return true;

   

    // 2) Fall back: check login nội bộ cũ (CURRENT_USER)
    const legacy = localStorage.getItem(SystemConstants.CURRENT_USER);
    if (legacy) return true;

     this.router.navigate(['/login'], {
      queryParams: { returnUrl: state.url }   // bỏ btoa()
    });

    // 3) Chưa có gì -> về màn Login; màn Login sẽ gọi signinRedirect nếu SSO_2
    this.router.navigate([UrlConstants.LOGIN], { queryParams: { returnUrl: state.url } });
    return false;

    
  }
}
