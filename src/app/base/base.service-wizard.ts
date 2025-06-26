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
export class BaseWizardService extends BaseService {

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
}
