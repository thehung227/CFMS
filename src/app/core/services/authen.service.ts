import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { SystemConstants } from './../common/system.constants';
import { LoggedInUser } from './../domain/loggedin.user';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Global } from './../../shared/global';
import { locale } from 'moment';
import { Jsonp } from '@angular/http/src/http';
import { CryptoExtension } from '../extensions/crypto.extension';

import { UserManager, UserManagerSettings, User } from 'oidc-client';
import { Subject } from 'rxjs';

@Injectable()
export class AuthenService {
    protected headers: Headers;
    flagError: boolean = false;
    statusOk: boolean;

    public _userManager: UserManager;
    public _user: User | null = null;

    private _loginChangedSubject = new Subject<boolean>();
    public loginChanged = this._loginChangedSubject.asObservable();
    
    constructor(private _http: Http) {
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');
        this._userManager = new UserManager(this.idpSettings);
        this._userManager.events.addAccessTokenExpired(_ => {
            this._loginChangedSubject.next(false);
          });
    }

    loginbyEmail(username: string, password: string) {


        let body = "\{'Username': '" + username + "','Password': '" + password + "'\}";

        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        headers.append('Content-Length', body.length.toString());
        let options = new RequestOptions({ headers: headers });

        return this._http.post("https://hrm.coteccons.vn/auth/LdapAuthService.svc/LoginJSON", body, options)
            .map((response: Response) => response.json());
    }

    login(username: string, password: string, branchcode: string, sso?: boolean) {
        
        let body = "username=" + encodeURIComponent(username) +
            "&password=" + encodeURIComponent(password) +
            "&branchcode=" + encodeURIComponent(branchcode) +
            "&sso=" + encodeURIComponent(sso ? 'true' : 'false') +
            "&grant_type=password"

        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");
        let options = new RequestOptions({ headers: headers });

        return this._http.post(Global.MainEndPoint + '/token', body, options)
            .map((response: Response) => {
                let user: LoggedInUser = response.json();
                user.usc = CryptoExtension.encrypt(password);
                if (user && user.access_token) {
                    this.flagError = true;

                    localStorage.removeItem(SystemConstants.CURRENT_USER);
                    localStorage.setItem(SystemConstants.CURRENT_USER, JSON.stringify(user));
                    localStorage.removeItem(SystemConstants.CURRENT_BRANCH);
                    localStorage.setItem(SystemConstants.CURRENT_BRANCH, JSON.stringify(branchcode));
                    localStorage.removeItem(SystemConstants.CURRENT_USERNAME);
                    localStorage.setItem(SystemConstants.CURRENT_USERNAME, JSON.stringify(user.userName));
                    if (!sso) {
                        localStorage.removeItem(SystemConstants.MAIL_TOKEN);
                        localStorage.setItem(SystemConstants.MAIL_TOKEN, JSON.stringify(user.mailToken));
                    }
                    //vB00PermissionWeb vB00WebRoleData
                }
            })
            .catch((err: Response) => {
                // The err.statusText is empty if server down (err.type === 3)
                //console.log((err.statusText || "Can't join the server."));
                this.statusOk = err.ok;
                // Really usefull. The app can't catch this in "(err)" closure
                // This return is required to compile but unuseable in your app
                return Observable.throw(err);
            });
    }

    logout() {

        localStorage.removeItem(SystemConstants.CURRENT_USER);
        localStorage.removeItem(SystemConstants.CURRENT_BRANCH);
        localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
        localStorage.removeItem(SystemConstants.PERMISSION_DATA);
        localStorage.removeItem(SystemConstants.MODULE_ALLOW);
        localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
        localStorage.removeItem(SystemConstants.PRODUCTCOSTID);
        localStorage.removeItem(SystemConstants.PRODUCTNAME);
        localStorage.removeItem(SystemConstants.PERMISSION_DATA_POSITION);
        
    }

    public logoutSSO_2 = () => {
        this._userManager.signoutRedirect();
      }
      
      public finishLogout = () => {
        this._user = null;
        this._loginChangedSubject.next(false);
        return this._userManager.signoutRedirectCallback();
      }

    
    isUserAuthenticated(): boolean {
        
        let user = localStorage.getItem(SystemConstants.CURRENT_USER);
        if (user != null)
            return true;

        return false;
    }

    getLoggedInUser(): LoggedInUser {
        
        let user: LoggedInUser;

        if (this.isUserAuthenticated()) {
            var userData = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USER));
            if (userData != null)
                user = new LoggedInUser(userData.access_token, userData.username, userData.fullName, userData.email, userData.avatar, userData.ConfigSession);
        }
        else {
            user = null;
        }

        return user;
    }

    protected handleError(error: Response) {
        
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    protected reload() {
        location.reload();
        return '';
    }

    getPermissionData(pzUrl: string, pzDataSourceName: string, filter: string) {
        

        filter = Global.convertConfig(filter);

        const _url = pzUrl + 'datachild?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter);

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this.getLoggedInUser().access_token);

        return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.handleError);
    }

    getUserData(pzUrl: string, pzDataSourceName: string, filter: string) {

        
        filter = Global.convertConfig(filter);

        const _url = pzUrl + 'datachild?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter);

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this.getLoggedInUser().access_token);

        return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.handleError);
    }

    getConfig() {
        return this._http.get('./assets/config.json').map(data => <any>data.json()).catch(this.handleError);
    }

    getTokenFromSSO(url: string, accessKey: string, clientId: string) {

        const _url = url + '?accessKey=' + accessKey + '&clientId=' + clientId;
        return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.reload);

    }
    getUserFromSSO(url: string, token: string) {

        const _url = url;

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'Bearer ' + token);

        return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.handleError);

    }


    public isAuthenticated = (): Promise<boolean> => {
        
        return this._userManager.getUser()
            .then(user => {
                if (this._user !== user) {
                    this._loginChangedSubject.next(this.checkUser(user));
                }

                this._user = user;
                return this.checkUser(user);
       })
    }

    private checkUser = (user: User | null): boolean => {
        return !!user && !user.expired;
    }

    public finishLogin = (): Promise<User> => {
        
        return this._userManager.signinRedirectCallback()
        .then(user => {
          this._user = user;
          this._loginChangedSubject.next(this.checkUser(user));
          return user;
        })
      }

      public renewToken() {
        return this._userManager.signinSilent().then(u => {
            this._user = u;
            localStorage.removeItem(SystemConstants.TOKEN_EXPIRES_AT);
            localStorage.setItem(SystemConstants.TOKEN_EXPIRES_AT, u.expires_at.toString());
        }).catch(er => {
            console.log(er);
        });
    }

    // private get idpSettings(): UserManagerSettings {
    //     return {
    //         authority: "https://auth.newtecons.vn",
    //         client_id: "5ebb890b-a43d-4643-ad7f-6dd42d287ed1",
    //         redirect_uri: "https://cfms.newtecons.vn/#/auth",
    //         scope: "openid profile email api",
    //         response_type: "code",
    //         post_logout_redirect_uri: "https://cfms.newtecons.vn/#/logout",
    //         automaticSilentRenew: true,
    //         silent_redirect_uri: "https://cfms.newtecons.vn/assets/refresh.html",
    //     }
    // }

    private get idpSettings(): UserManagerSettings {
        return {
            authority: "https://auth.newtecons.vn",
            client_id: "5ebb890b-a43d-4643-ad7f-6dd42d287ed1",
            redirect_uri: "http://localhost:4200/#/auth",
            scope: "openid profile email api",
            response_type: "code",
            post_logout_redirect_uri: "http://localhost:4200/#/logout",
            automaticSilentRenew: true,
            silent_redirect_uri: "http://localhost:4200/assets/refresh.html",
        }
    }
}
