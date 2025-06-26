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
import { BravoCtorEnum, DataRowState } from '../core/enum/type.enum';
import { ParameterContract } from '../contracts/parameter.contract';
import { TableContract } from '../contracts/table.contract';
import { ColumnContract } from '../contracts/column.contract';
import { RowContract } from '../contracts/row.contract';

@Injectable()
export class BaseEditorService extends BaseService {
  private _puchaseUrl = Global.DataEditorEndpoint;

  initialize(pzUrl: string, pLayout: any) {
    const _zLayout = CryptoExtension.encrypt(JSON.stringify(pLayout));
    const _url = pzUrl + 'init?struct=' + encodeURIComponent(_zLayout);


    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    return this._http.get(_url, { headers: this.headers })
      .map((response: Response) => <any>response.json())
      .catch(this.handleError);
  }

  // //backup cũ, Get
  // fetchData(pzUrl: string, pLayout: any, pzFilter: string) {

  //   pzFilter = Global.convertConfig(pzFilter); //pzFilter.replace('{VAR=Branch.Ma_Dvcs}',JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)));


  //   const _zLayout = CryptoExtension.encrypt(JSON.stringify(pLayout));
  //   const _zFilter = CryptoExtension.encrypt(pzFilter);

  //   this.headers.delete('Authorization');
  //   this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

  //   const _url = pzUrl + 'data?struct=' + encodeURIComponent(_zLayout) + '&filter=' + encodeURIComponent(_zFilter);

  //   return this._http.get(_url, { headers: this.headers })
  //     .map((response: Response) => <any>JSON.parse(response.text(), this.reviver)).catch(this.handleError);
  // }
  
  fetchData(pzUrl: string, pLayout: any, pzFilter: string) {

    pzFilter = Global.convertConfig(pzFilter); //pzFilter.replace('{VAR=Branch.Ma_Dvcs}',JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)));


    const _zLayout = CryptoExtension.encrypt(JSON.stringify(pLayout));
    const _zFilter = CryptoExtension.encrypt(pzFilter);

    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    const _url = pzUrl + 'data';
    let layout = {"struct":_zLayout,"filter":_zFilter};
    return this._http.post(_url,layout, { headers: this.headers })
      .map((response: Response) => <any>JSON.parse(response.text(), this.reviver)).catch(this.handleError);
  }

  getDefaultSchema(pzUrl: string, pLayout: any, tableName: string) {
    const _zLayout = CryptoExtension.encrypt(JSON.stringify(pLayout));

    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);

    const _url = pzUrl + 'defaultschema?struct=' + encodeURIComponent(_zLayout) + '&TableName=' + encodeURIComponent(tableName);

    return this._http.get(_url, { headers: this.headers })
      .map((response: Response) => <any>JSON.parse(response.text(), this.reviver)).catch(this.handleError);
  }

  // post(model: any): Observable<any> {
  //   const _url = this._puchaseUrl;
  //   let _body = JSON.stringify(model);
  //   _body = Global.convertConfig(_body);
  //   const headers = new Headers({ 'Content-Type': 'application/json' });
  //   headers.delete('Authorization');
  //   headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
  //   const options = new RequestOptions({ headers: headers });

  //   return this._http.post(_url + 'save', _body, options)
  //     .map((response: Response) => <any>response.json())
  //     .catch(this.handleError);
  // }

  //Dương replace post 1305
  post(model: any, useXML: boolean = false, id: number = -1): Observable<any> {
    const _url = this._puchaseUrl;
    let _body = JSON.stringify(model);
    _body = Global.convertConfig(_body);
    const headers = new Headers({ 'Content-Type': 'application/json' });
    headers.delete('Authorization');
    headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);
    const options = new RequestOptions({ headers: headers });

    if (useXML) {
      let params = new Array<ParameterContract>();

      let param1 = new ParameterContract();
      param1.ParameterName = '@_TableName';
      let names: string = Global.convertViewName(model.Layout.Parent.Name);
      for (let i of model.Layout.Child) {
        names = names + ',' + Global.convertViewName(i.Name);
      }

      param1.ParameterValue = names;
      params.push(param1);

      let param3 = new ParameterContract();
      param3.ParameterName = '@_ViewName';
      let views: string = model.Layout.Parent.Name;
      for (let i of model.Layout.Child) {
        views = views + ',' + i.Name;
      }

      param3.ParameterValue = views;
      params.push(param3);

      let param2 = new ParameterContract();
      param2.ParameterName = '@_Id';
      param2.ParameterValue = id;
      params.push(param2);

      let paramXML = new ParameterContract();
      paramXML.ParameterName = '@_XmlData';
      paramXML.ParameterValue = 'NewDataSet';
      params.push(paramXML);


      let paramStruct = new ParameterContract();
      paramStruct.ParameterName = '@_XmlStruct';
      params.push(paramStruct);
      let xmlstruct = `<NewDataSet>\n
      <XmlStruct>
        <Name>`+ Global.convertViewName(model.Layout.Parent.Name) + `</Name>
        <ColParentKey></ColParentKey>
        <ColChildKey></ColChildKey>
      </XmlStruct>\n`;

      for (let i of model.Layout.Child) {
        xmlstruct = xmlstruct + `<XmlStruct>
        <Name>`+ Global.convertViewName(i.Name) + `</Name>
        <ColParentKey>`+ i.ParentKey + `</ColParentKey>
        <ColChildKey>`+ i.ChildKey + `</ColChildKey>
      </XmlStruct>`
      }
      xmlstruct += '\n</NewDataSet>';
      paramStruct.ParameterValue = xmlstruct;

      console.log(params);
      return this.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_sys_DataCRUD0', params, model.EditorData);

    } else {
      return this._http.post(_url + 'save', _body, options)
        .map((response: Response) => <any>response.json())
        .catch(this.handleError);
    }
  }

  //kit: 25/01/2018: xử lý lưới con explorer
  fetchDataChild(pzUrl: string, pzDataSourceName: string, filter: string) {

    filter = Global.convertConfig(filter);

    const _url = pzUrl + 'datachild?sourceName=' + pzDataSourceName + '&filterKey=' + encodeURIComponent(filter);

    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);


    return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.handleError);
  }

  fetchDataSelect(pzUrl: string, pzDataSourceName: string, filter: string, zPageNumber: number, zRowspPage: number, zOrderby: string) {
    filter = Global.convertConfig(filter);

    const _url = pzUrl + 'dataselect?TableName=' + pzDataSourceName + '&filter=' + encodeURIComponent(filter) + '&PageNumber=' + zPageNumber + '&RowspPage=' + zRowspPage + '&OrderBy=' + zOrderby;

    this.headers.delete('Authorization');
    this.headers.append('Authorization', 'bearer ' + this._authenService.getLoggedInUser().access_token);


    return this._http.get(_url, { headers: this.headers }).map((response: Response) => <any>response.json()).catch(this.handleError);
  }


  async import(fileList: File[], key: string, table: string, productCostId: string, userName: string, branchCode: string) {
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
        const uploadURL = Global.UploadEndpoint + 'Import?key=' + encodeURIComponent(key) + '&table=' + encodeURIComponent(table) + '&productCostId=' + encodeURIComponent(productCostId) + '&userName=' + encodeURIComponent(userName) + '&branchCode=' + encodeURIComponent(branchCode);
        await this._http.post(uploadURL, formData, options)
          .map(res => res.json())
          .catch(error => Observable.throw(error))
          .toPromise();
      }
  }

}
