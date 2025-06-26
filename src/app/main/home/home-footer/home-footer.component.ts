import { Component, OnInit } from '@angular/core'
import { SystemConstants } from '../../../core/common/system.constants';
import { Global } from '../../../shared/global';
import { BravoCtorEnum } from '../../../core/enum/type.enum';
import { ParameterContract } from '../../../contracts/parameter.contract';
import { BaseEditorService } from '../../../base/base.service-editor';

@Component({
    selector: 'app-home-footer',
    templateUrl: './home-footer.component.html',
    styleUrls: ['./home-footer.component.css']
})

export class HomeFooterComponent implements OnInit {

    constructor(protected _service: BaseEditorService) {
    }

    ngOnInit() {

    }

    convertParameterName(pzName: string) {
        const DbParamPrefixOld = '@_';
        const DbParamPrefix = '@';

        return pzName.startsWith(DbParamPrefixOld) || pzName.startsWith(DbParamPrefix) ?
            pzName : DbParamPrefixOld + pzName;
    }

    get getbranchCode(): any {
        let branchInfo;
        // let params = new Array<ParameterContract>();
        // const param1 = new ParameterContract();
        // param1.ParameterName = this.convertParameterName('BranchCode');
        // param1.ParameterValue = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH));
        // params.push(param1);

        // this._service.getData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CTC_GetBranchInfo', params).toPromise().then(data => {
        //     if (data[0] != undefined) {
        //         branchInfo = JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) + ' - ' + data[0]['IsAttachFile'];
        //     }
        // });

        if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'A01')
            branchInfo = 'A01 - Công Ty Cổ Phần Đầu Tư Xây Dựng Ricons'
        else
            if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'B01')
                branchInfo = 'B01 - Công ty TNHH Đầu Tư Xây Dựng Unicons'
            else
                if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'N01')
                    branchInfo = 'N01 - Công ty Cổ Phần Đầu Tư Xây Dựng Newtecons'
                else
                    branchInfo = ''

        return branchInfo;
    }
}