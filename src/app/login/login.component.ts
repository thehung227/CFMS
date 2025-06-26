import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenService } from './../core/services/authen.service';
import { BaseService } from './../base/base.service';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as wjcCore from 'wijmo/wijmo';

import { Global, FilterCommand } from './../shared/global';
import { UrlConstants } from './../core/common/url.constants';
import { BravoSiteStorage } from './../core/domain/bravo.site.storage';
import { SystemConstants } from './../core/common/system.constants';

import { CryptoExtension } from './../core/extensions/crypto.extension';
import { Subscription, ISubscription } from 'rxjs/Subscription';
import { retry } from 'rxjs/operator/retry';
// import { Config } from '../app.config';
import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Subject } from 'rxjs';


@Component({
   selector: 'app-login',
   templateUrl: './login.component.html',
   styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
   private userAuthenticated: boolean = false;


   model: any = {};
   body: HTMLBodyElement = document.getElementsByTagName('body')[0];
   branchs: wjcCore.CollectionView;
   suffixEmail: wjcCore.CollectionView;
   loading = false;
   returnUrl: string;
   defaultValue = 'N01';
   textWarningLogin: string = '';
   accessKey: string;
   useSSO: boolean;

   // private _userManager: UserManager;
   // private user: User = null;
   // private _loginChangedSubject = new Subject<boolean>();
   // public loginChanged = this._loginChangedSubject.asObservable();

   constructor(private authenService: AuthenService,
      private route: ActivatedRoute,
      private router: Router,
      private loginSrv: BaseService) {
      this.body.classList.add('login-page');
      this.subscription = new Subscription();


      if (window.location.href.includes('returnUrl')) {
         if (this.route.snapshot.queryParams['returnUrl'] != '/') {
            localStorage.removeItem(SystemConstants.RETURN_URL);
            localStorage.setItem(SystemConstants.RETURN_URL, this.route.snapshot.queryParams['returnUrl']);
         }
      }

      
      

      // if(location.href.includes('?code=')){
      //    debugger
      //    this.authenService.finishLogin().then();
      // }
      // this.authenService.loginChanged
      //    .subscribe((userAuthenticated: boolean) => {
            
      //       this.userAuthenticated = userAuthenticated;
      //    })
   }
   subscription: Subscription;

   ngOnInit() {
      this.authenService.isAuthenticated()
    .then(userAuthenticated => {
      this.userAuthenticated = userAuthenticated;
    })

      try {
         this.authenService.getConfig().toPromise().then(
            config => {
               let hostname = localStorage.getItem(SystemConstants.BRANCH_USESSO).replace(/"/gi, '');
               if (config[hostname]) {

                  let url = config[hostname]['ApiEndpoint'];
                  localStorage.removeItem(SystemConstants.API_ENDPOINT);
                  localStorage.setItem(SystemConstants.API_ENDPOINT, JSON.stringify(url));

                  let _configSSO = config[hostname]['SSO_2'] ? config[hostname]['SSO_2'] : config[hostname]['SSO'];
                  this.useSSO = _configSSO ? true : false;

                  let _ssoName = config[hostname]['SSO_2'] ? "SSO_2" : "SSO"

                  this.authenService.logout();
                  if (_configSSO) {

                     localStorage.removeItem(SystemConstants.SSO_DATA);
                     localStorage.setItem(SystemConstants.SSO_DATA, JSON.stringify(config[hostname][_ssoName]));
                     if (_ssoName == 'SSO') {
                        if (!wjcCore.isNullOrWhiteSpace(localStorage.getItem('LINKREDIRECT'))) {
                           let _linkDirec = localStorage.getItem('LINKREDIRECT');
                           let _acccecKey = _linkDirec.split('accesskey=')[1];

                           localStorage.removeItem(SystemConstants.SECRET_KEY);
                           localStorage.setItem(SystemConstants.SECRET_KEY, _configSSO['SecretKey']);

                           if (wjcCore.isNullOrWhiteSpace(this.returnUrl) && wjcCore.isNullOrWhiteSpace(_acccecKey))
                              window.location.href = (<string>_configSSO['LinkDirect']).replace("{clientId}", _configSSO['ClientId']).replace("{urlApp}", _configSSO['UrlApp']);
                           else if (!wjcCore.isNullOrWhiteSpace(this.returnUrl) && wjcCore.isNullOrWhiteSpace(_acccecKey)) {
                              window.location.href = (<string>_configSSO['LinkDirect']).replace("{clientId}", _configSSO['ClientId']).replace("{urlApp}", _configSSO['UrlApp']);
                           }
                           else {
                              if (localStorage.getItem(SystemConstants.RETURN_URL))
                                 this.returnUrl = localStorage.getItem(SystemConstants.RETURN_URL).replace(/"/gi, '');
                              const sub = this.authenService.getTokenFromSSO(_configSSO['UrlGetToken'], _acccecKey, _configSSO['ClientId'])
                                 .subscribe(async data => {

                                    this.authenService.getUserFromSSO(_configSSO['UrlGetUser'], data.accessToken)
                                       .subscribe(user => {

                                          let _branchCode = config[hostname]['BranchCode'];

                                          const sub1 = this.authenService.login(user.email, '', _branchCode, true).subscribe(async data => {
                                             localStorage.removeItem(SystemConstants.MAIL_TOKEN);
                                             localStorage.setItem(SystemConstants.MAIL_TOKEN, JSON.stringify(user.accessToken));

                                             this.authenService.getUserData(Global.DataExplorerEndpoint, 'vB00UserList_WithAdminRole', 'IsActive = 1 AND BranchCode = ' + "'" + _branchCode + "'" + ' AND Email=' + "'" + user.email + "'")
                                                .subscribe(user => {
                                                   if (user[0] !== undefined && user[0] !== null) {
                                                      localStorage.removeItem(SystemConstants.CURRENT_USERID);
                                                      localStorage.setItem(SystemConstants.CURRENT_USERID, JSON.stringify(user[0]['Id']));
                                                      localStorage.removeItem(SystemConstants.CURRENT_USERFULLNAME);
                                                      localStorage.setItem(SystemConstants.CURRENT_USERFULLNAME, JSON.stringify(user[0]['FullName']));
                                                      localStorage.removeItem(SystemConstants.CURRENT_EMPLOYEE);
                                                      localStorage.setItem(SystemConstants.CURRENT_EMPLOYEE, JSON.stringify(user[0]['Ma_CbNv']));
                                                      localStorage.removeItem(SystemConstants.CURRENT_USERISADMIN);
                                                      localStorage.setItem(SystemConstants.CURRENT_USERISADMIN, JSON.stringify(user[0]['IsAdmin']));
                                                      localStorage.removeItem(SystemConstants.CURRENT_ISSYSADMIN);
                                                      localStorage.setItem(SystemConstants.CURRENT_ISSYSADMIN, JSON.stringify(user[0]['IsSysAdmin']));
                                                      localStorage.removeItem(SystemConstants.CURRENT_ISSUBADMIN);
                                                      localStorage.setItem(SystemConstants.CURRENT_ISSUBADMIN, JSON.stringify(user[0]['IsSubAdmin']));
                                                      localStorage.removeItem(SystemConstants.MODULE_ALLOW);
                                                      localStorage.setItem(SystemConstants.MODULE_ALLOW, JSON.stringify(user[0]['Module']));
                                                      localStorage.removeItem(SystemConstants.POSITION_EMPLOYEE);
                                                      localStorage.setItem(SystemConstants.POSITION_EMPLOYEE, JSON.stringify(user[0]['PositionCode']));

                                                      let _arrFilter: Array<FilterCommand> = [];
                                                      if (localStorage.getItem(SystemConstants.FILTER_DATA) || localStorage.getItem(SystemConstants.FILTER_DATA) == undefined) {
                                                         localStorage.removeItem(SystemConstants.FILTER_DATA);
                                                         localStorage.setItem(SystemConstants.FILTER_DATA, JSON.stringify(_arrFilter));
                                                      }

                                                      this.authenService.getPermissionData(Global.DataExplorerEndpoint, 'vB00PermissionWeb', 'UserId=' + localStorage.getItem(SystemConstants.CURRENT_USERID))
                                                         .subscribe(permision => {
                                                            localStorage.removeItem(SystemConstants.PERMISSION_DATA);
                                                            localStorage.setItem(SystemConstants.PERMISSION_DATA, JSON.stringify(permision));
                                                            if (this.returnUrl != '' && this.returnUrl != '/' && this.returnUrl != null && this.returnUrl != undefined) {
                                                               let _urlParams = atob(this.returnUrl);
                                                               this.router.navigateByUrl(_urlParams);
                                                            }
                                                            else {
                                                               this.router.navigate(['/main', 'notifications', 'index']);
                                                            }
                                                         });
                                                   }
                                                });
                                          })
                                          this.subscription.add(sub1);
                                       });
                                    this.subscription.add(sub);
                                 })

                           }
                        }
                     }
                     else if (_ssoName == 'SSO_2') {
                        if (!this.userAuthenticated) {
                           this.authenService._userManager.signinRedirect();
                        }
                        else {
                           if (localStorage.getItem(SystemConstants.RETURN_URL)){
                              this.returnUrl = localStorage.getItem(SystemConstants.RETURN_URL).replace(/"/gi, '');
                              if(this.returnUrl == "/logout") this.returnUrl = ""
                           }
                                 
                           this.authenService._userManager.getUser().then(_user => {
                              let _branchCode = config[hostname]['BranchCode'];

                              localStorage.removeItem(SystemConstants.MAIL_TOKEN);
                              localStorage.setItem(SystemConstants.MAIL_TOKEN, JSON.stringify(_user.access_token));
                              localStorage.removeItem(SystemConstants.TOKEN_EXPIRES_AT);
                              localStorage.setItem(SystemConstants.TOKEN_EXPIRES_AT, _user.expires_at.toString());
                              
                              const sub1 = this.authenService.login(_user.profile.email, '', _branchCode, true).subscribe(async data => {

                                 this.authenService.getUserData(Global.DataExplorerEndpoint, 'vB00UserList_WithAdminRole', 'IsActive = 1 AND BranchCode = ' + "'" + _branchCode + "'" + ' AND Email=' + "'" + _user.profile.email + "'")
                                 .subscribe(user => {
                                    if (user[0] !== undefined && user[0] !== null) {
                                       localStorage.removeItem(SystemConstants.CURRENT_USERID);
                                       localStorage.setItem(SystemConstants.CURRENT_USERID, JSON.stringify(user[0]['Id']));
                                       localStorage.removeItem(SystemConstants.CURRENT_USERFULLNAME);
                                       localStorage.setItem(SystemConstants.CURRENT_USERFULLNAME, JSON.stringify(user[0]['FullName']));
                                       localStorage.removeItem(SystemConstants.CURRENT_EMPLOYEE);
                                       localStorage.setItem(SystemConstants.CURRENT_EMPLOYEE, JSON.stringify(user[0]['Ma_CbNv']));
                                       localStorage.removeItem(SystemConstants.CURRENT_USERISADMIN);
                                       localStorage.setItem(SystemConstants.CURRENT_USERISADMIN, JSON.stringify(user[0]['IsAdmin']));
                                       localStorage.removeItem(SystemConstants.CURRENT_ISSYSADMIN);
                                       localStorage.setItem(SystemConstants.CURRENT_ISSYSADMIN, JSON.stringify(user[0]['IsSysAdmin']));
                                       localStorage.removeItem(SystemConstants.CURRENT_ISSUBADMIN);
                                       localStorage.setItem(SystemConstants.CURRENT_ISSUBADMIN, JSON.stringify(user[0]['IsSubAdmin']));
                                       localStorage.removeItem(SystemConstants.MODULE_ALLOW);
                                       localStorage.setItem(SystemConstants.MODULE_ALLOW, JSON.stringify(user[0]['Module']));
                                       localStorage.removeItem(SystemConstants.POSITION_EMPLOYEE);
                                       localStorage.setItem(SystemConstants.POSITION_EMPLOYEE, JSON.stringify(user[0]['PositionCode']));

                                       let _arrFilter: Array<FilterCommand> = [];
                                       if (localStorage.getItem(SystemConstants.FILTER_DATA) || localStorage.getItem(SystemConstants.FILTER_DATA) == undefined) {
                                          localStorage.removeItem(SystemConstants.FILTER_DATA);
                                          localStorage.setItem(SystemConstants.FILTER_DATA, JSON.stringify(_arrFilter));
                                       }

                                       this.authenService.getPermissionData(Global.DataExplorerEndpoint, 'vB00PermissionWeb', 'UserId=' + localStorage.getItem(SystemConstants.CURRENT_USERID))
                                          .subscribe(permision => {
                                             localStorage.removeItem(SystemConstants.PERMISSION_DATA);
                                             localStorage.setItem(SystemConstants.PERMISSION_DATA, JSON.stringify(permision));
                                             if (this.returnUrl != '' && this.returnUrl != '/' && this.returnUrl != null && this.returnUrl != undefined) {
                                                // let _urlParams = atob(this.returnUrl);
                                                let _urlParams = "";
                                                if (this.isEncoded(_urlParams))
                                                   _urlParams = atob(this.returnUrl);
                                                else
                                                   _urlParams = this.returnUrl
                                                this.router.navigateByUrl(_urlParams);
                                             }
                                             else {
                                                this.router.navigate(['/main', 'notifications', 'index']);
                                             }
                                          });
                                    }
                                 });
                              })
                              this.subscription.add(sub1);
                           })
                        }
                     }
                  }
                  else {
                     localStorage.removeItem(SystemConstants.SSO_DATA);

                     this.returnUrl = this.route.snapshot.queryParams['returnUrl'];// || UrlConstants.HOME;
                     const sub = this.loginSrv.getLookupLogin(Global.LookupEndpoint, 'Branchlist', '', !hostname.includes('muahang.coteccons') ? "Ma_Dvcs IN ('B01','N01')" : "Ma_Dvcs IN ('N01')", '')
                        // const sub = this.loginSrv.getLookupLogin(Global.LookupEndpoint, 'Branchlist', '', "Ma_Dvcs IN ('A01')", '')
                        .subscribe(data => {
                           const branchTmp: any = [];
                           // tslint:disable-next-line:forin
                           let i = 0;
                           let id = 0;
                           for (const item in data) {

                              const branch = {
                                 htmlDisplay: '<b>' + data[item].ValueMember + '</b>' + ': '
                                    + data[item].DisplayMember,
                                 value: data[item].ValueMember
                              };

                              branchTmp.push(branch);

                              if (branch.value == this.defaultValue)
                                 id = i;
                              i++;
                           }

                           this.branchs = new wjcCore.CollectionView(branchTmp);
                           this.branchs._idx = id;
                        });
                     this.subscription.add(sub);
                  }
               }
            });
      }
      catch (err) {
         console.log(err);
         throw 'Xảy ra lỗi trong chứng thực SSO! Liên hệ administrator';
      }
   }

   ngAfterViewInit() {
   }

   login() {
      this.loading = true;
      // this.authenService.loginbyEmail(this.model.username, this.model.password)
      //     .subscribe(data => {
      //         this.router.navigate([UrlConstants.HOME]);
      //     });
      let hostname = localStorage.getItem(SystemConstants.BRANCH_USESSO).replace(/"/gi, '');
      if ((hostname.includes('muahang.coteccons')) && (this.model.username.includes("@coteccons.vn") || !this.model.username.includes("@"))) {
         alert('User hiện thời không có quyền truy cập hệ thống.');
         return;
      }

      const sub = this.authenService.login(this.model.username, this.model.password, this.model.branchcode)
         .subscribe(async data => {
            // // this.router.navigate([UrlConstants.HOME]);
            // this.router.navigate(['/main', 'widget', 'view']);
            this.authenService.getUserData(Global.DataExplorerEndpoint, 'vB00UserList_WithAdminRole', 'ParentId <> 4420 AND IsActive = 1 AND BranchCode = ' + "'" + this.model.branchcode + "'" + ' AND Email=' + "'" + this.model.username + "'")
               .subscribe(user => {
                  if (user[0] !== undefined && user[0] !== null) {
                     localStorage.removeItem(SystemConstants.CURRENT_USERID);
                     localStorage.setItem(SystemConstants.CURRENT_USERID, JSON.stringify(user[0]['Id']));
                     localStorage.removeItem(SystemConstants.CURRENT_USERFULLNAME);
                     localStorage.setItem(SystemConstants.CURRENT_USERFULLNAME, JSON.stringify(user[0]['FullName']));
                     localStorage.removeItem(SystemConstants.CURRENT_EMPLOYEE);
                     localStorage.setItem(SystemConstants.CURRENT_EMPLOYEE, JSON.stringify(user[0]['Ma_CbNv']));
                     localStorage.removeItem(SystemConstants.CURRENT_USERISADMIN);
                     localStorage.setItem(SystemConstants.CURRENT_USERISADMIN, JSON.stringify(user[0]['IsAdmin']));
                     localStorage.removeItem(SystemConstants.CURRENT_ISSYSADMIN);
                     localStorage.setItem(SystemConstants.CURRENT_ISSYSADMIN, JSON.stringify(user[0]['IsSysAdmin']));
                     localStorage.removeItem(SystemConstants.CURRENT_ISSUBADMIN);
                     localStorage.setItem(SystemConstants.CURRENT_ISSUBADMIN, JSON.stringify(user[0]['IsSubAdmin']));
                     localStorage.removeItem(SystemConstants.MODULE_ALLOW);
                     localStorage.setItem(SystemConstants.MODULE_ALLOW, JSON.stringify(user[0]['Module']));
                     localStorage.removeItem(SystemConstants.POSITION_EMPLOYEE);
                     localStorage.setItem(SystemConstants.POSITION_EMPLOYEE, JSON.stringify(user[0]['PositionCode']));

                     let _arrFilter: Array<FilterCommand> = [];
                     if (localStorage.getItem(SystemConstants.FILTER_DATA) || localStorage.getItem(SystemConstants.FILTER_DATA) == undefined) {
                        localStorage.removeItem(SystemConstants.FILTER_DATA);
                        localStorage.setItem(SystemConstants.FILTER_DATA, JSON.stringify(_arrFilter));
                     }

                     this.authenService.getPermissionData(Global.DataExplorerEndpoint, 'vB00PermissionWeb', 'UserId=' + localStorage.getItem(SystemConstants.CURRENT_USERID))
                        .subscribe(permision => {
                           localStorage.removeItem(SystemConstants.PERMISSION_DATA);
                           localStorage.setItem(SystemConstants.PERMISSION_DATA, JSON.stringify(permision));
                           if (this.returnUrl != '' && this.returnUrl != '/' && this.returnUrl != null && this.returnUrl != undefined) {
                              let _urlParams = atob(this.returnUrl);
                              this.router.navigateByUrl(_urlParams);
                           }
                           else {
                              this.router.navigate(['/main', 'notifications', 'index']);
                           }
                        });
                  }
               });

         });
      this.subscription.add(sub);

      setTimeout(() => {
         if (this.authenService.statusOk && document.getElementById('warningLogin') != null) {
            this.textWarningLogin = '';
            document.getElementById('warningLogin').style.visibility = 'hidden';
         }
         else if (!this.authenService.statusOk && document.getElementById('warningLogin') != null) {
            document.getElementById('warningLogin').style.visibility = 'visible';
            this.textWarningLogin = 'Tài khoản hoặc mật khẩu không đúng! Vui lòng kiểm tra lại...';
         }
      }, 7000)
   }

   isEncoded(uri) {
      uri = uri || '';
    
      return uri !== decodeURIComponent(uri);
    }
    
   b64DecodeUnicode(str) {
      return decodeURIComponent(atob(str).split('').map(function (c) {
         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
   }

   ngOnDestroy(): void {
      if (this.subscription)
         this.subscription.unsubscribe();
   }

   capLock(e) {
      let kc = e.keyCode ? e.keyCode : e.which;

      let sk = e.shiftKey ? e.shiftKey : ((kc == 16) ? true : false);
      if (((kc >= 65 && kc <= 90) && !sk) || ((kc >= 97 && kc <= 122) && sk)) {
         document.getElementById('warningLogin').style.visibility = 'visible';
         this.textWarningLogin = 'Caps lock is on!'
      }
      else
         document.getElementById('warningLogin').style.visibility = 'hidden';
   }

}
