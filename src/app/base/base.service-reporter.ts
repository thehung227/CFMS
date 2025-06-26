import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as CryptoJS from 'crypto-js';

import { BaseService } from './base.service';

import { CryptoExtension } from './../core/extensions/crypto.extension';

@Injectable()
export class BaseReporterService extends BaseService {

    getDataEncrypt<T1>(url: string, ctor1: string, params: T1): Observable<any> {
        const _dataEncrypt = JSON.stringify(params);
        const _data = CryptoExtension.encrypt(_dataEncrypt);

        const body = { data: _data };
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        const options = new RequestOptions({ headers: headers });
        const _url = url + ctor1 //+ 'filter?parms=' + encodeURIComponent(_data);;

        return this._http.put(_url, body, options)
            .map((response: Response) =>  <any> response.json())
            .catch(this.handleError);
    }

    // filterData<T>(pzUrl: string, params: T): Observable<any> {
    //     let data = JSON.stringify(params);
    //     data = CryptoExtension.encrypt(data);
    
    //     this.headers.delete('Authorization');
    //     // this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
    
    //     const _url = pzUrl + 'filter?parms=' + encodeURIComponent(data);
    //     const options = new RequestOptions({ headers: this.headers });
    
    //     return this._http.get(_url, options)
    //         .map((response: Response) => response.json())
    //         .catch(this.handleError);
    // }

    // filterRepoter<T>(url: string, ctor1: string, params: T): Observable<any>
    // {
    //     const _zLayout = CryptoExtension.encrypt(JSON.stringify(params));
    //     const _zFilter = CryptoExtension.encrypt(_zLayout);

    //     this.headers.delete('Authorization');
    //     // this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    //     const _url = url + ctor1 + 'data?struct=' + encodeURIComponent(_zLayout) + '&filter=' + encodeURIComponent(_zFilter);

    //     return this._http.get(_url, { headers: this.headers })
    //     .map((response: Response) => <any> JSON.parse(response.text(),this.reviver)).catch(this.handleError);
    // }
}
