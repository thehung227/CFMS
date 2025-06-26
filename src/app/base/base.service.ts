import { Injectable } from '@angular/core';

import { Http, Response, Headers, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

import { BravoCtorEnum } from './../core/enum/type.enum';

import { CryptoExtension } from './../core/extensions/crypto.extension';
import { AuthenService } from './../core/services/authen.service';
import { Global } from '../shared/global';
import { SystemConstants } from '../core/common/system.constants';
import { DataSetContract } from '../contracts/dataset.contract';
import { LoggedInUser } from '../core/domain/loggedin.user';

@Injectable()
export class BaseService {
    protected headers: Headers;
    constructor(protected _http: Http, protected _authenService: AuthenService) {
        try {
            this.downloadProgress = Observable.create(observer => {
                this.downloadProgressObserver = observer
            }).share();

            this.uploadProgress = Observable.create(observer => {
                this.uploadProgressObserver = observer
            }).share();
        }
        catch (ex) {

        }
        this.headers = new Headers();
        this.headers.append('Content-Type', 'application/json');

        let today = new Date();
        var current_at = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() - 7, today.getMinutes(), today.getSeconds())).getTime()/1000;
        var token_expires_at = parseInt(localStorage.getItem(SystemConstants.TOKEN_EXPIRES_AT));
        if(current_at >= token_expires_at) {
            this._authenService.renewToken().then(u => {
                console.log('Acess token expiring event renew success');
            });
        }


    }

    public getdata(url: string, ctor1: string, filter: string) {

        filter = Global.convertConfig(filter);

        const _zFilter = CryptoExtension.encrypt(filter);
        const _url = url + ctor1 + '?filter=' + encodeURIComponent(_zFilter);

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        // console.log(this.headers);

        return this._http.get(_url, new RequestOptions({ headers: this.headers }))
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    // public getData<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
    //     console.log(params);
    //     ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
    //     const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

    //     this.headers.delete('Authorization');
    //     this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    //     const options = new RequestOptions({ headers: this.headers });
    //     const _url = url + 'getdata' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
    //     return this._http.get(_url, options)
    //         .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
    //         .catch(this.handleError);
    // }

    public getData<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
        const options = new RequestOptions({ headers: this.headers });

        if (ctor1.length + ctor2.length > 200) {
            const _url = url + 'postdata' + '?ctor1=' + ctor1 + '&type=' + type;
            return this._http.post(_url, params, options)
                .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
                .catch(this.handleError);
        }
        else {
            const _url = url + 'getdata' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
            return this._http.get(_url, options)
                .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
                .catch(this.handleError);
        }

    }

    public postData<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'postdata' + '?ctor1=' + ctor1 + '&type=' + type;
        return this._http.post(_url, params, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }

    public getDataWithFilter<T1>(url: string, type: BravoCtorEnum, ctor1: string, filter: string, params: T1): Observable<any> {
        const body = JSON.stringify(params);

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + ctor1 + '?type=' + type;

        return this._http.put(_url, body, options)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    public getDataOutput<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'getdataoutput' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
        return this._http.get(_url, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }

    public getMultiDataOutput<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'getmultidataoutput' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
        return this._http.get(_url, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }

    getLookupLogin(url: string, lookupKey: string, term: string, filter: string, cols: string): Observable<any> {
        if (!filter) { filter = ''; }
        const _url = url + 'login?key=' + encodeURIComponent(lookupKey) + '&term=' + encodeURIComponent(CryptoExtension.encrypt(term)) + '&filter=' + encodeURIComponent(CryptoExtension.encrypt(filter)) + '&cols=' + encodeURIComponent(CryptoExtension.encrypt(cols));
        // const _url = url + 'login?key=' + encodeURIComponent(lookupKey) + '&term=' + encodeURIComponent(term) + '&filter=' + encodeURIComponent(filter) + '&cols=' + encodeURIComponent(cols);

        return this._http.get(_url)
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    getLookupNew(url: string, lookupKey: string, term: string, filter: string, cols: string, maxRow: number = 10): Observable<any> {
        if (!filter) { filter = ''; }
        filter = Global.convertConfig(filter);

        const _url = url + 'data?key=' + encodeURIComponent(lookupKey) + '&term=' + encodeURIComponent(term) + '&filter=' + encodeURIComponent(filter) + '&cols=' + encodeURIComponent(cols) + '&maxrow=' + encodeURIComponent(maxRow.toString());

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        return this._http.get(_url, { headers: this.headers })
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    dowload(key: string, parentId: string, name: string): Observable<any> {

        let type = "";
        if (name.toUpperCase().endsWith("PDF"))
            type = "application/pdf";
        else if (name.toUpperCase().endsWith("PNG"))
            type = "image/png";
        else if (name.toUpperCase().endsWith("JPG"))
            type = "image/jpg";
        else if (name.toUpperCase().endsWith("JPEG"))
            type = "image/jpeg";
        else if (name.toUpperCase().endsWith("GIF"))
            type = "image/gif";
        else type = "application/octet-stream";

        const downloadURL = Global.UploadEndpoint + 'Download?key=' + encodeURIComponent(key) + '&parentId=' + encodeURIComponent(parentId) + '&name=' + encodeURIComponent(name);

        return this.downloadFileRequest(downloadURL, type);
    }

    upLoad(fileList: File[], key: string, parentId: string): Observable<any> {
        if (fileList)
            if (fileList.length > 0) {
                const formData: FormData = new FormData();

                for (let i in fileList) {
                    formData.append('uploadFile' + i, fileList[i], fileList[i].name);
                }

                const headers = new Headers();

                headers.delete('Authorization');
                headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

                const options = new RequestOptions({ headers: headers });
                const uploadURL = Global.UploadEndpoint + 'Upload?key=' + key + '&parentId=' + parentId;
                return this._http.post(uploadURL, formData, options)
                    .map(res => res.json())
                    .catch(error => Observable.throw(error));
            }
    }

    upLoadNew(fileList: File[], key: string, parentId: string): Observable<any> {
        if (fileList)
            if (fileList.length > 0) {
                const formData: FormData = new FormData();

                for (let i in fileList) {
                    formData.append('uploadFile' + i, fileList[i], fileList[i].name);
                }
                const uploadURL = Global.UploadEndpoint + 'UploadProgress?key=' + key + '&parentId=' + parentId;

                return this.uploadFileRequest(uploadURL, formData);
            }
    }

    upLoadImage(fileList: File[], key: string): Observable<any> {
        if (fileList)
            key = '4.img/' + key;
        if (fileList.length > 0) {
            const formData: FormData = new FormData();

            for (let i in fileList) {
                formData.append('uploadImage' + i, fileList[i], fileList[i].name);
            }

            const headers = new Headers();

            headers.delete('Authorization');
            headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

            const options = new RequestOptions({ headers: headers });
            const uploadURL = Global.UploadEndpoint + 'UploadImage?key=' + key;
            return this._http.post(uploadURL, formData, options)
                .map(res => res.json())
                .catch(error => Observable.throw(error));
        }
    }

    protected handleError(error: Response) {
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }

    protected reviver(key, value): any {
        return Global.displayReviver(value);
    }

    getConfig() {
        return this._http.get('./assets/config.json').map(data => <any>data.json()).catch(this.handleError);
    }
    // public initialBaseService(url: string) {
    //   console.log(url + 'initialize');
    //   this.headers.delete('Authorization');
    //   return this._http.get(url + 'initialize', new RequestOptions({ headers: this.headers }))
    //       .map((response: Response) =>  <any> response.json())
    //       .catch(this.handleError);
    // }

    // exportWord(folder: string, name: string, output: any): Observable<any> {
    //     let type = name.endsWith('pdf') ? 'application/pdf' : 'application/octet-stream';
    //     let headers = new Headers({
    //         'Content-Type': 'application/json',
    //         'Accept': type
    //     });

    //     headers.delete('Authorization');
    //     headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    //     let options = new RequestOptions({ headers: headers });
    //     // Ensure you set the responseType to Blob.
    //     options.responseType = ResponseContentType.Blob;
    //     const downloadURL = Global.UploadEndpoint + 'ExportWord?folder=' + encodeURIComponent(folder) + '&name=' + encodeURIComponent(name);
    //     return this._http.post(downloadURL, output, options)
    //         .map(response => {
    //             if (response.status == 400) {
    //                 return "FAILURE";
    //             } else if (response.status == 200) {
    //                 var contentType = type;
    //                 var blob = new Blob([(<any>response)._body], { type: contentType });
    //                 return blob;
    //             }
    //         })

    // }


    exportWord(folder: string, name: string, output: any): Observable<any> {
        folder = Global.convertConfig(folder);
        let type = name.endsWith('pdf') ? 'application/pdf' : 'application/octet-stream';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': type
        });

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        let options = new RequestOptions({ headers: headers });
        // Ensure you set the responseType to Blob.
        options.responseType = ResponseContentType.Blob;
        const downloadURL = Global.UploadEndpoint + 'ExportWord?folder=' + encodeURIComponent(folder) + '&name=' + encodeURIComponent(name);
        return this._http.post(downloadURL, output, options)
            .map(response => {
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {
                    var contentType = type;
                    var blob = new Blob([(<any>response)._body], { type: contentType });
                    return blob;
                }
            })

    }
    exportExcel(folder: string, name: string, output: any): Observable<any> {
        folder = Global.convertConfig(folder);
        let type = name.endsWith('pdf') ? 'application/pdf' : 'application/octet-stream';
        let headers = new Headers({
            'Content-Type': 'application/json',
            'Accept': type
        });

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        let options = new RequestOptions({ headers: headers });
        // Ensure you set the responseType to Blob.
        options.responseType = ResponseContentType.Blob;
        const downloadURL = Global.UploadEndpoint + 'ExportExcel?folder=' + encodeURIComponent(folder) + '&name=' + encodeURIComponent(name);
        return this._http.post(downloadURL, output, options)
            .map(response => {
                if (response.status == 400) {
                    return "FAILURE";
                } else if (response.status == 200) {
                    var contentType = type;
                    var blob = new Blob([(<any>response)._body], { type: contentType });
                    return blob;
                }
            })

    }
    public exportHtml(sourcePath: string, output: any): Observable<any> {
        sourcePath = Global.convertConfig(sourcePath);
        sourcePath = encodeURIComponent(CryptoExtension.encrypt(sourcePath));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = Global.UploadEndpoint + 'ExportHtml' + '?sourcePath=' + sourcePath;
        return this._http.post(_url, output, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }

    public postXML<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1, data: DataSetContract): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));
        let _body = data;
        // console.log(data);
        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'postXML' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
        return this._http.post(_url, _body, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }



    public getPermissionData<T1>(url: string, type: BravoCtorEnum, ctor1: string, params: T1): Observable<any> {
        // console.log(params);
        ctor1 = encodeURIComponent(CryptoExtension.encrypt(ctor1));
        const ctor2 = encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)));

        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'getdata' + '?ctor1=' + ctor1 + '&type=' + type + '&ctor2=' + ctor2;
        return this._http.get(_url, options)
            .map((response: Response) => <any>JSON.parse(response.text(), this.reviver))
            .catch(this.handleError);
    }


    sendMail(url: string, body: any): Observable<any> {
        const headers = new Headers();

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'sendasync';
        return this._http.post(_url, body, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));
    }

    sendMailApi(url: string, body: any): Observable<any> {
        const headers = new Headers();

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        let _sso_data = JSON.parse(localStorage.getItem(SystemConstants.SSO_DATA));

        let _url = url;
        if (_sso_data)
            _url = _url + 'callApiSSO';
        else
            _url = _url + 'callApi';
console.log(body)
        return this._http.post(_url, body, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));

    }

    sendMailNotAuthen(url: string, body: any): Observable<any> {
        const headers = new Headers();

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'sendasync2';
        return this._http.post(_url, body, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));
    }

    sendMailToMulti(url: string, body: any): Observable<any> {
        const headers = new Headers();

        headers.delete('Authorization');
        headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const options = new RequestOptions({ headers: this.headers });
        const _url = url + 'sendmuiltiasync';
        return this._http.post(_url, body, options)
            .map(res => res.json())
            .catch(error => Observable.throw(error));
    }

    downloadProgress: Observable<any>;
    downloadProgressObserver: any;
    uploadProgress: Observable<any>;
    uploadProgressObserver: any;

    public downloadFileRequest(url: string, type: string): Observable<any> {
        return Observable.create(observer => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        // console.log([(<any>xhr.response)]);
                        var blob = new Blob([(<any>xhr.response)], { type: type });
                        observer.next(blob);
                        observer.complete();

                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.onprogress = (event) => {
                try {
                    this.downloadProgressObserver.next((event.loaded / event.total) * 100);
                }
                catch (ex) { }
            };
            xhr.open('get', url, true);
            xhr.responseType = "blob";
            xhr.setRequestHeader('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
            xhr.send();
        });
    }

    public uploadFileRequest(url: string, data: any): Observable<any> {
        return Observable.create(observer => {
            let xhr: XMLHttpRequest = new XMLHttpRequest();

            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        observer.next(xhr.response);
                        observer.complete();

                    } else {
                        observer.error(xhr.response);
                    }
                }
            };

            xhr.onprogress = (event) => {
                try {
                    this.uploadProgressObserver.next((event.loaded / event.total) * 100);
                }
                catch (ex) { }
            };
            xhr.open('post', url, true);
            xhr.responseType = "blob";
            xhr.setRequestHeader('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
            xhr.send(data);
        });
    }

    //////////////////  inv XML
    public readUploadedFileAsText(inputFile): Promise<string> {
        const temporaryFileReader = new FileReader();

        return new Promise((resolve, reject) => {
            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject('error');
            };

            temporaryFileReader.onload = () => {
                resolve(temporaryFileReader.result.toString().split(',')[1]);
            };

            temporaryFileReader.readAsDataURL(inputFile);
        });
    }


    public saveInv(folderName: string, fileName: string, body: string) {
        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const _url = Global.InvEndPoint + 'saveXML?folderName=' + encodeURIComponent(folderName) + '&filename=' + encodeURIComponent(fileName);
        return this._http.post(_url, JSON.stringify(body), new RequestOptions({ headers: this.headers }))
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    public getTaxCodeInv(folderName: string, fileName: string) {
        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const _url = Global.InvEndPoint + 'getTaxCode?folderName=' + encodeURIComponent(folderName) + '&filename=' + encodeURIComponent(fileName);
        return this._http.get(_url, new RequestOptions({ headers: this.headers }))
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }

    public acceptInv(folderName: string, fileName: string) {
        this.headers.delete('Authorization');
        this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

        const _url = Global.InvEndPoint + 'acceptXML?folderName=' + encodeURIComponent(folderName) + '&filename=' + encodeURIComponent(fileName);
        return this._http.get(_url, new RequestOptions({ headers: this.headers }))
            .map((response: Response) => <any>response.json())
            .catch(this.handleError);
    }
}
