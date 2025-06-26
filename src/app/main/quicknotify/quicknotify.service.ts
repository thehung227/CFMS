import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import * as CryptoJS from 'crypto-js';

import { BaseService } from './../../base/base.service';

import { CryptoExtension } from './../../core/extensions/crypto.extension';

@Injectable()
export class QuickNotifyService extends BaseService {
    get(data: string) {
        const _url = 'http://localhost:8888/api/baseapi?id=' + encodeURIComponent(data);

        console.log(_url);

        return this._http.get(_url)
            .map((response: Response) =>  <any> response.json())
            .catch(this.handleError);
    }

    getDataEncrypt<T1>(url: string, ctor1: string, params: T1): Observable<any> {
        const _dataEncrypt = JSON.stringify(params);

        // var key = CryptoJS.enc.Utf8.parse('808080808080abcd8080808080808080');
        // var iv = CryptoJS.enc.Utf8.parse('03@#5005adef%&05');

        // // Encrypt
        // var ciphertext = CryptoJS.AES.encrypt(_dataEncrypt, key, {
        //     keySize: 256 / 8,
        //     iv: iv,
        //     mode: CryptoJS.mode.CBC,
        //     padding: CryptoJS.pad.Pkcs7
        // });
        const _data = CryptoExtension.encrypt(_dataEncrypt);

        const body = { data: _data };
        const headers = new Headers({
            'Content-Type': 'application/json'
        });

        const options = new RequestOptions({ headers: headers });
        const _url = url + ctor1;

        const _url1 = 'http://localhost:8888/api/baseapi?data=' + encodeURIComponent(_data);
        this._http.get(_url1).subscribe(data => {
            console.log(data);
        });

        return this._http.put(_url, body, options)
            .map((response: Response) =>  <any> response.json())
            .catch(this.handleError);
    }
}
