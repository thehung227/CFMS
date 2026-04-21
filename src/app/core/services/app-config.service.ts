import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AppConfigService {
  constructor(private http: HttpClient) {}

  load(): Promise<void> {
    const host = window.location.host;                       // ví dụ: 'localhost:4200' hoặc 'cfms-test.newtecons.vn'
    const key  = host.indexOf('localhost') >= 0 ? 'localhost' : host;

    return this.http.get<any>('assets/config.json').toPromise()
      .then(cfg => {
        const sso = (cfg && cfg[key] && cfg[key].SSO_2) || {};
        // Quan trọng: phải có ClientId
        if (!sso.ClientId) {
          console.error('SSO_DATA missing ClientId for key:', key, sso);
        }
        localStorage.setItem('SSO_DATA', JSON.stringify(sso));
      })
      .catch(err => {
        console.error('Load assets/config.json failed:', err);
        localStorage.removeItem('SSO_DATA');
      });
  }
}
