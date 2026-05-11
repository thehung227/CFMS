import { Component, ViewChild, OnInit, OnDestroy, ElementRef, HostListener } from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from 'wijmo/wijmo.angular2.grid';
import { WjInputModule } from 'wijmo/wijmo.angular2.input';

import * as wjcCore from 'wijmo/wijmo';
import * as wjcGrid from 'wijmo/wijmo.grid';
import * as wjcInput from 'wijmo/wijmo.angular2.input';
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutAuxiliaryMaterialsOrderEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Expression } from "../../../shared/expression";
import { Global } from "../../../shared/global";
import { MailForm } from "../../../ui/mail-form/mail-form";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-auxiliarymaterialsorder-editor-form',
  templateUrl: './auxiliarymaterialsorder-editor.component.html',
  styleUrls: ['./auxiliarymaterialsorder-editor.component.css']
})

export class AuxiliaryMaterialsOrderEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'auxiliarymaterialsorder', 'index'];
  indexPage_Editor = ['/main', 'auxiliarymaterialsorder', 'detail'];
  folderName = 'Don_Hang_Mua';
  folderNameSendMail = 'Don_Hang_Mua'
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(private service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutAuxiliaryMaterialsOrderEditor(service, this.parentData);
    
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];
    this.init();

    this.grid1.allowAddNew = false;
    this.grid3.isReadOnly = true;
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  async sendMailEdit(mailForm: MailForm, flex: wjcGrid.FlexGrid) {
   
    if (this._layoutDeclare.layout.Mail) {
      let _eval = Expression.translateParameter(this._layoutDeclare.layout.Mail.Expr, flex.selectedItems[0]);
      if (eval(_eval)) {
        // let _webConfig = JSON.parse(localStorage.getItem(SystemConstants.WEB_CONFIG));

        let _configMail = await this.service.fetchDataSelect(Global.DataEditorEndpoint, "vB00HrmEmailProfile", this._layoutDeclare.layout.Mail.ProfileFilter, 1, 1, 'Id').toPromise();

        mailForm.loadConfigurationMail(_configMail[0], this._layoutDeclare.layout.Mail || null, flex.selectedItems[0]);

        mailForm.show();
      }
      else
      {
        
        alert(this._layoutDeclare.layout.Mail.Message);
      }
        
    }
    else
      alert('Chưa khai báo thông tin gửi mail.');
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '3' && i != '5' && i != '2') {
        _errorSave0 = true;
        break;
      }
    }

    let _errorSave1: boolean = false;
    for (let item of this.grid1.itemsSource.items) {
      if (item['EmployeeCode'] == '') {
        _errorSave1 = true;
        break;
      }
      else
        if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
          _errorSave1 = true;
          break;
        }
    }

    let _errorSave2 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (item['Attached'] == true && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        _errorSave2 = true;
        break;
      }
    }

    let _errorSave3 = false;
    for (let item of this.grid3.itemsSource.items) {
      if (item['ContactName'] == '' || item['JobTitleName'] == '' || item['PhoneNo'] == '' || item['Email'] == '') {
        _errorSave3 = true;
        break;
      }
    }

    if (isApproveSend == true) {
      if (_errorSave0 == false) {
        if (_errorSave1 == false) {
          if (_errorSave2 == false) {
            if (_errorSave3 == false) {
              this.checkKhoiLuong_KeHoach_PO(formData).then(() => {
                if (this._errBCTC == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'P8', this.id, false, '1');
              }
            });
          }
          else {
            alert(this._errMess);
            this.showLoading = false;
          }
        });
          }
          else
            alert('Tab "Thông tin NCC" không được để trống dữ liệu.');
          }
          else
            alert('Tài liệu đính kèm không được bỏ trống.');
        }
        else
          alert('Không được bỏ trống nhân sự duyệt hồ sơ.');
      }
      else
        alert('Dữ liệu (Chi tiết đơn hàng, Bước duyệt, Thông tin NCC) cần ít nhất 1 dòng để thực hiện.');
    }
    else
      this.submit(formData, this.indexPage_Editor);
  }

  async checkKhoiLuong_KeHoach_PO(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDoc_CheckData', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errBCTC = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];
  }
}
