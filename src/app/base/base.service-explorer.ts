import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { BaseService } from './../base/base.service';
import { CryptoExtension } from '../core/extensions/crypto.extension';
import { Global } from '../shared/global';
import { SystemConstants } from '../core/common/system.constants';
import { BravoCtorEnum } from '../core/enum/type.enum';

@Injectable()
export class BaseExplorerService extends BaseService {

  initialize(pzUrl: string, pzDataSourceName: string, filter: string) {
    //filter = filter.replace('{VAR=Branch.Ma_Dvcs}',JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)));
    filter = Global.convertConfig(filter);

    filter = CryptoExtension.encrypt(filter);
    const _url = pzUrl + 'init?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter);

    
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    return this._http.get(_url, { headers: this.headers })
        .map((response: Response) =>  <any> response.json())
        .catch(this.handleError);
}

fetchData(pzUrl: string, pzDataSourceName: string, filter: string, zPageNumber: number, zRowspPage: number, fieldOrderBy: string) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
    filter = Global.convertConfig(filter);

    filter = CryptoExtension.encrypt(filter);
    return this._http.get(pzUrl+'data?sourceName=' + pzDataSourceName +'&zPageNumber=' + zPageNumber +'&zRowspPage='+ zRowspPage + '&zOrderByLst=' + fieldOrderBy+ '&filterKey=' + encodeURIComponent(filter), { headers: this.headers })
        .map((response: Response) =>  <any> JSON.parse(response.text(),this.reviver)).catch(this.handleError);
}

getCountData(pzUrl: string,pzDataSourceName: string, filter: string) {
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
    filter = Global.convertConfig(filter);

    filter = CryptoExtension.encrypt(filter);
    return this._http.get(pzUrl+'getcount?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter), { headers: this.headers })
        .map((response: Response) =>  <any> JSON.parse(response.text(),this.reviver)).catch(this.handleError);
}

//kit: 25/01/2018: xử lý lưới con explorer
fetchDataChild(pzUrl: string,pzDataSourceName: string, filter: string) {
    
    filter = Global.convertConfig(filter);
    
    const _url = pzUrl + 'datachild?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter);

    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);


    return this._http.get(_url, { headers: this.headers }).map((response: Response) =>  <any> response.json()).catch(this.handleError);
}

fetchDataSelect(pzUrl: string,pzDataSourceName: string, filter: string, zPageNumber: number, zRowspPage: number, zOrderby: string) {
    filter = Global.convertConfig(filter);

    const _url = pzUrl + 'dataselect?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter) + '&zPageNumber=' + zPageNumber + '&zRowspPage=' + zRowspPage + '&zOrderByLst=' + zOrderby;
  
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
  
  
    return this._http.get(_url, { headers: this.headers })
        .map((response: Response) =>  <any> JSON.parse(response.text(),this.reviver)).catch(this.handleError);
        // .map((response: Response) =>  <any> response.json()).catch(this.handleError);
    
  }

filterData<T>(pzUrl: string,pzDataSourceName: string, filter: string, params: T): Observable<any> {
    let data = JSON.stringify(params);
    data = Global.convertConfig(data);
    data = CryptoExtension.encrypt(data);
    filter = Global.convertConfig(filter);
    filter = CryptoExtension.encrypt(filter);
    
    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    const _url = pzUrl + 'filter?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter)+'&parms=' + encodeURIComponent(data);
    //const options = new RequestOptions({ headers: this.headers });

    return this._http.get(_url, { headers: this.headers })
        .map((response: Response) =>  <any> JSON.parse(response.text(),this.reviver)).catch(this.handleError);
}

}
