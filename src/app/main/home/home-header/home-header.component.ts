import { Component, OnInit, OnDestroy } from '@angular/core'
import { SystemConstants } from '../../../core/common/system.constants';
import { Subscription } from 'rxjs';
import { saveAs as importedSaveAs } from "file-saver";
import { BaseService } from '../../../base/base.service';
import { Global } from '../../../shared/global';
import { BaseExplorerService } from '../../../base/base.service-explorer';
import { ParameterContract } from '../../../contracts/parameter.contract';
import { BravoCtorEnum } from '../../../core/enum/type.enum';
import { HomeSidebarComponent } from '../home-sidebar/home-sidebar.component';
import { Router } from '@angular/router';
import { AuthenService } from '../../../core/services/authen.service';

declare var $: any;

@Component({
    selector: 'app-home-header',
    templateUrl: './home-header.component.html',
    styleUrls: ['./home-header.component.css']
})

export class HomeHeaderComponent implements OnInit, OnDestroy {

    listProduct: Array<Object>;
    sidebar = new HomeSidebarComponent();

    constructor(private _service: BaseExplorerService, private router: Router, private authenService: AuthenService) {
        this.subscription = new Subscription();
    }
    subscription: Subscription;

    productSelect: string;

    isMobile: boolean;

    ngOnInit() {
        this.getProductList();
        this.isMobile = this.isMobileMenu();
    }


    get showUserName() {
        return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERNAME));
    }

    get showUserFullName() {
        return JSON.parse(localStorage.getItem(SystemConstants.CURRENT_USERFULLNAME));
    }

    get getLogoPath(): any {
        let logoPath;

        if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'N01')
            logoPath = 'assets/img/Logo_Coteccons.png';
        else
            if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'B01')
                logoPath = 'assets/img/Logo_Unicons.png';
            else
                if (JSON.parse(localStorage.getItem(SystemConstants.CURRENT_BRANCH)) == 'A01')
                    logoPath = 'assets/img/Logo_Ricons.png';
                else
                    logoPath = ''

        return logoPath;
    }

    get getLogoMiniPath(): any {
        let logoPath;
        logoPath = 'assets/img/newtecons.ico';
        return logoPath;
    }

    myFunction() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    filterFunction() {
        var input, filter, ul, li, option, i;
        input = document.getElementById("myInput");
        filter = input.value.toUpperCase();
        let div = document.getElementById("myDropdown");
        option = div.getElementsByTagName("input");
        for (i = 0; i < option.length; i++) {
            if (option[i].value.toUpperCase().indexOf(filter) > -1) {
                option[i].style.display = "block";
            } else {
                option[i].style.display = "none";
            }
        }
    }

    get getProductName() {
        return localStorage.getItem(SystemConstants.PRODUCTNAME.toString());
    }

    onChange(event) {

        let productName: string = event.target.value;


        productName = productName.substring(13, productName.length);
        localStorage.setItem(SystemConstants.PRODUCTNAME, productName);

        let _value = event.target.name;
        let _indexSep = _value.indexOf('|');
        let _value1 = _value.substring(0, _indexSep);
        let _value2 = _value.substring(_indexSep + 1, _value.length);

        if (_value != null && _value != undefined && _value != '') {
            localStorage.setItem(SystemConstants.PRODUCTCOSTID, _value1);
            localStorage.setItem(SystemConstants.PRODUCTCOSTID_PARENT, _value2);

            const params = new Array<ParameterContract>();
            const param = new ParameterContract();
            const param1 = new ParameterContract();
            const param2 = new ParameterContract();

            param.ParameterName = Global.convertParameterName('ProductCostId');
            param.ParameterValue = _value1;
            params.push(param);

            param1.ParameterName = Global.convertParameterName('nUserId');
            param1.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
            params.push(param1);

            param2.ParameterName = Global.convertParameterName('BranchCode');
            param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
            params.push(param2);
            console.log(params);
            this._service.getPermissionData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_Ctc_GetPositionCode_Permission', params)
                .toPromise().then(data => {
                    localStorage.removeItem(SystemConstants.PERMISSION_DATA_POSITION);
                    localStorage.setItem(SystemConstants.PERMISSION_DATA_POSITION, JSON.stringify(data));
                    this.sidebar.ngOnInit();
                    location.reload();
                });
        }
        else
            localStorage.setItem(SystemConstants.PRODUCTCOSTID, "");
    }


    async getProductList() {
        let filter = "IsClosed = 0 AND ProductType NOT IN ('0','2') AND IsActive = 1 AND ISNULL(BranchCode,'') = '{VAR=Branch.Ma_Dvcs}' AND ('{VAR=User.IsAdmin}'='True' OR RowId IN (SELECT RowId FROM dbo.ufn_Coteccons_GoiThau_Theo_NhanVien('{VAR=User.Ma_CbNv}')))";

        let _data = await this._service.fetchDataSelect(Global.DataExplorerEndpoint, 'vB20Product', filter, 1, 100000, 'Name')
            .toPromise().then();

        this.listProduct = _data;
    }

    downloadFile(folder: string, name: string) {
        if (name) {
            const sub = this._service.dowload(folder, '', name).subscribe(blob => {
                if (name.toUpperCase().endsWith('PDF') == false)
                    importedSaveAs(blob, name);
                else {
                    let url = window.URL.createObjectURL(blob);
                    window.open(url);
                }
            });
            this.subscription.add(sub);
        }
    }

    openWindow(navigateUrl: string) {
        window.open(navigateUrl);
    }

    isMobileMenu() {
        if ($(window).width() < 991) {
            return false;
        }
        return true;
    }

    logout() {
        this._service.getConfig().toPromise().then(
            config => {
                let hostname = localStorage.getItem(SystemConstants.BRANCH_USESSO).replace(/"/gi, '');

                let _ssoName = config[hostname]['SSO_2'] ? "SSO_2" : "SSO"

                if (_ssoName == 'SSO') {
                    localStorage.removeItem(SystemConstants.RETURN_URL);
                    localStorage.removeItem(SystemConstants.CURRENT_USER);
                    localStorage.removeItem(SystemConstants.CURRENT_BRANCH);
                    localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
                    localStorage.removeItem(SystemConstants.PERMISSION_DATA);
                    localStorage.removeItem(SystemConstants.MODULE_ALLOW);
                    localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
                    localStorage.removeItem(SystemConstants.PRODUCTCOSTID);
                    localStorage.removeItem(SystemConstants.PRODUCTNAME);
                    localStorage.removeItem(SystemConstants.PERMISSION_DATA_POSITION);
                    localStorage.setItem(SystemConstants.LINKREDIRECT, '');
                    window.location.href = (<string>config[hostname]["SSO"]['Logout']).replace("{clientId}", config[hostname]["SSO"]['ClientId']).replace("{urlApp}", config[hostname]["SSO"]['UrlApp']);
                }
                if (_ssoName == 'SSO_2') {
                    for (let i = 0; i < localStorage.length; i++) {
                        if(localStorage.key(i).startsWith('oidc.'))
                        {
                            localStorage.removeItem(localStorage.key(i))
                        }
                        
                    }
                    
                    //window.location.href = (<string>config[hostname]["SSO_2"]['Logout']).replace("{urlApp}", config[hostname]["SSO_2"]['UrlApp']);

                        localStorage.removeItem(SystemConstants.RETURN_URL);
                        localStorage.removeItem(SystemConstants.CURRENT_USER);
                        localStorage.removeItem(SystemConstants.CURRENT_BRANCH);
                        localStorage.removeItem(SystemConstants.EXPLORER_PARRENTKEY_VALUE);
                        localStorage.removeItem(SystemConstants.PERMISSION_DATA);
                        localStorage.removeItem(SystemConstants.MODULE_ALLOW);
                        localStorage.removeItem(SystemConstants.PARAMETER_LINKREPORT);
                        localStorage.removeItem(SystemConstants.PRODUCTCOSTID);
                        localStorage.removeItem(SystemConstants.PRODUCTNAME);
                        localStorage.removeItem(SystemConstants.PERMISSION_DATA_POSITION);
                        localStorage.setItem(SystemConstants.LINKREDIRECT, '');

                        let today = new Date();
                        var current_at = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() - 7, today.getMinutes(), today.getSeconds())).getTime()/1000;
                        var token_expires_at = parseInt(localStorage.getItem(SystemConstants.TOKEN_EXPIRES_AT));
                        if(current_at >= token_expires_at) {
                            
                            // this.authenService._userManager.events.addAccessTokenExpiring(x => {
                            //     console.log('Acess token expiring event');
                            //     this.authenService.renewToken().then(u => {
                            //         console.log('Acess token expiring event renew success');
                            //     });
                            // });

                            this.authenService.renewToken().then(u => {
                                console.log('Acess token expiring event renew success');
                                this.authenService.logoutSSO_2();
                            });
                        }
                        else {
                            this.authenService.logoutSSO_2();
                        }

                    //this.authenService.logoutSSO_2();
                        

                }
                else {
                    this.router.navigate(['/login']);
                }
                
            });
    }
    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}