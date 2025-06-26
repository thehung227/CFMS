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
import { LayoutSolPPEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-solpp-editor-form',
  templateUrl: './solpp-editor.component.html',
  styleUrls: ['./solpp-editor.component.css']
})

export class SolPPEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'solpp', 'index'];
  indexPage_Editor = ['/main', 'solpp', 'detail'];
  folderName = 'De_Nghi_Mua_Hang';
  folderNameSendMail = 'De_Nghi_Mua_Hang'

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSolPPEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
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

  output: any;
  _err: boolean = false;
  _errMess: any;

  async checkData(formData: any) {
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);
  
    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30BizDocDetail');
      paramXML.ParameterValue = 'B30BizDocDetail';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocDetail',
          collection: Global.createColection(this.grid.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_New_CheckDeNghiDatHang', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['output']);
      this._err = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }
  }
  
  onSubmit(formData: any, isApproveSend?: boolean) {
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '0' && i != '2' && i != '3') {
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
      if (item['Description'] == '' || item['Description'] == undefined || item['FilePath'] == '' || item['FilePath'] == undefined) {
        _errorSave2 = true;
        break;
      }
    }

    if (_errorSave0 == false) {
      if (_errorSave2 == false) {
        if (isApproveSend == true) {
          this.checkData(formData).then(() => {
            if (this._err == false) {
          if (_errorSave1 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'PP', this.id, false, '1');
              }
            });
          }
          else
            alert('Không được bỏ trống nhân sự duyệt hồ sơ.');
          }
          else {
            alert(this._errMess);
            this.showLoading = false;
          }
        });
      }
        else
          this.submit(formData, this.indexPage_Editor);
      }
      else
        alert('Tài liệu đính kèm không được bỏ trống.');
    }
    else
      alert('Dữ liệu Tab Chi tiết đơn hàng, Bước duyệt cần ít nhất 1 dòng để lưu');
  }
}
