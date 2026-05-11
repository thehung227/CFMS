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
import { LayoutSolPOConcreteEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-solpoconcrete-editor-form',
  templateUrl: './solpoconcrete-editor.component.html',
  styleUrls: ['./solpoconcrete-editor.component.css']
})

export class SolPOConcreteEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'solpoconcrete', 'index'];
  indexPage_Editor = ['/main', 'solpoconcrete', 'detail'];
  folderName = 'Don_Hang_Mua';
  folderNameSendMail = 'Don_Hang_Mua'

  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSolPOConcreteEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
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

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '1' && i != '2' && i != '3') {
        _errorSave0 = true;
        break;
      }
    }

    let _errorSave1: boolean = false;
    // for (let item of this.grid1.itemsSource.items) {
    //   if (item['EmployeeCode'] == '') {
    //     _errorSave1 = true;
    //     break;
    //   }
    //   else
    //     if (item['EmployeeCode'].toString().indexOf(',') > 0 && item['EmployeeCodeReal'] == '') {
    //       _errorSave1 = true;
    //       break;
    //     }
    // }

    let _errorSave2 = false;
    // for (let item of this.grid2.itemsSource.items) {
    //   if (item['Description'] == '' || item['Description'] == undefined || item['FilePath'] == '' || item['FilePath'] == undefined) {
    //     _errorSave2 = true;
    //     break;
    //   }
    // }
    
    if (isApproveSend == true) {
      let r = confirm("Bạn có xác nhận vẫn gửi duyệt ?");
    if (r == true) {
      if (_errorSave0 == false) {
        if (_errorSave1 == false) {
          if (_errorSave2 == false) {
            
            this.checkKhoiLuong_KeHoach_PO(formData).then(() => {
              if (this._errBCTC == false) {
                this.submit(formData, this.indexPage, isApproveSend).then(() => {
                  if (this.allowSendMail) {
                    this.sendMail(formData, 'PO', this.id, true, '1');
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
            alert('Tài liệu đính kèm không được bỏ trống.');
        }
        else
          alert('Không được bỏ trống nhân sự duyệt hồ sơ.');
      }
      else
        alert('Dữ liệu (Chi tiết đơn hàng, Thông tin NCC) cần ít nhất 1 dòng để thực hiện.');
    }
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

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDoc_CheckData_Betong', params)
      .toPromise().then();

    this.output = <Array<Object>>(_data['output']);
    this._errBCTC = this.output['@_Error'];
    this._errMess = this.output['@_ErrorMessage'];
  }
}
