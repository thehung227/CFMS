import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from '../core/services/authen.service';
import { BaseService } from '../base/base.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as wjcCore from 'wijmo/wijmo';

import { Global, FilterCommand } from '../shared/global';
import { UrlConstants } from '../core/common/url.constants';
import { BravoSiteStorage } from '../core/domain/bravo.site.storage';
import { SystemConstants } from '../core/common/system.constants';

import { CryptoExtension } from '../core/extensions/crypto.extension';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { retry } from 'rxjs/operator/retry';
// import { Config } from '../app.config';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Subject } from 'rxjs';


@Component({
   selector: 'app-logout',
   templateUrl: './logout.component.html',
   styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnDestroy {

   constructor(private authenService: AuthenService,
      private route: ActivatedRoute,
      private router: Router) {
   }

   ngOnInit() {
      if(window.location.href.includes('?expried=1')){

         let today = new Date();
         var current_at = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() - 7, today.getMinutes(), today.getSeconds())).getTime()/1000;
         var token_expires_at = parseInt(localStorage.getItem(SystemConstants.TOKEN_EXPIRES_AT));
        
         if(current_at >= token_expires_at) {
               
               // this.authenService._userManager.events.addAccessTokenExpiring(x => {
               //     console.log('Acess token expiring event');
               //     this.authenService.renewToken().then(u => {
               //         console.log('Acess token expiring event renew success');
               //     });
               // });

               this.authenService.renewToken().then(u => {
                  console.log('Acess token expiring event renew success');
                  this.authenService.logoutSSO_2();
               });
         }
         else
         this.authenService.logoutSSO_2();

      }
      else {
         this.authenService.finishLogout()
         .then(_ => {
         this.router.navigate(['/'], { replaceUrl: true });
         })
      }
   }

   ngOnDestroy(): void {
   }
}
