import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { BaseService } from './base.service';
import { Global } from '../shared/global';
import { BravoCtorEnum } from '../core/enum/type.enum';
import { ParameterContract } from '../contracts/parameter.contract';
import { SystemConstants } from '../core/common/system.constants';

@Injectable()
export class PermissionResolve implements Resolve<any> {

  constructor(private service: BaseService) { }

  resolve(route: ActivatedRouteSnapshot) {
    let _value;
      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();

    if (localStorage.getItem(SystemConstants.PRODUCTCOSTID) != null && localStorage.getItem(SystemConstants.PRODUCTCOSTID) != undefined) {
      _value = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');

      param.ParameterName = Global.convertParameterName('ProductCostId');
      param.ParameterValue = _value;
      params.push(param);

      param1.ParameterName = Global.convertParameterName('nUserId');
      param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param1);

      param2.ParameterName = Global.convertParameterName('BranchCode');
      param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param2);

      return this.service.getPermissionData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Ctc_GetPositionCode_Permission', params);
    }
    else{
      _value = '';

      param.ParameterName = Global.convertParameterName('ProductCostId');
      param.ParameterValue = _value;
      params.push(param);

      param1.ParameterName = Global.convertParameterName('nUserId');
      param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param1);

      param2.ParameterName = Global.convertParameterName('BranchCode');
      param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param2);

      return this.service.getPermissionData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Ctc_GetPositionCode_Permission', params);
    }
  }

}