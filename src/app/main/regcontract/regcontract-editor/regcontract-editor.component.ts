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
import { LayoutRegContractEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-regcontract-editor-form',
  templateUrl: './regcontract-editor.component.html',
  styleUrls: ['./regcontract-editor.component.css']
})

export class RegContractEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('grid7') grid7: wjcGrid.FlexGrid;

  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'regcontract', 'index'];
  folderName = '02.Hop_Dong_Phu_Luc';
  indexPage_Editor = ['/main', 'regcontract', 'detailc3'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutRegContractEditor(service, this.parentData);
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  output: any;
  _errItemSets: boolean = false;
  ngOnInit() {
     console.log(localStorage.getItem(SystemConstants.POSITION_EMPLOYEE))
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6, this.grid7];
    this.init().then(async () => {

      let _value;
      const params = new Array<ParameterContract>();
      const param = new ParameterContract();
      const param1 = new ParameterContract();

      param.ParameterName = Global.convertParameterName('nUserId');
      param.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
      params.push(param);

      _value = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');

      param1.ParameterName = Global.convertParameterName('ProductCostId');
      param1.ParameterValue = _value;
      params.push(param1);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_GetDeptCodeFromEmployee', params).toPromise().then();
      this.output = <Array<Object>>(_data['output']);
      this._errItemSets = this.output['@_Error'];

      if (this._errItemSets == true) {

        this.grid5.isReadOnly = true;
      }
      else {

        this.grid5.isReadOnly = false;
      }

    });
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;

   
    this.dbClickCellContent(this.grid3);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

  }

  ngOnDestroy() {
    this.destroy();
  }

  async onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != '3' && i != '5' && i != '6' && i != '7') {
        _numEror += 1;
        break;
      }
    }

    let _errorSave = false;
    for (let item of this.grid1.itemsSource.items) {
      if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
        _errorSave = true;
        break;
      }
    }

    let _errorSave0 = false;
    for (let item of this.grid.itemsSource.items) {
      if ((item['ClassCode1'] == '03' && item['PayPercent'] == 0) || (item['ClassCode1'] == '05' && item['PayPercent'] == 0) ||
        (item['ClassCode1'] == '03' && item['NumberOfDay'] == 0) || (item['ClassCode1'] == '05' && item['NumberOfDay'] == 0)) {
        _errorSave0 = true;
        break;
      }
    }

    let _errorSave1 = false;
    for (let item of this.grid2.itemsSource.items) {
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
    for (let item of this.grid4.itemsSource.items) {
      if (item['ContactName'] == '' || item['JobTitleName'] == '' || item['PhoneNo'] == '' || item['Email'] == '' || item['Address'] == '' || item['ContactName'] == undefined || item['PhoneNo'] == undefined || item['JobTitleName'] == undefined || item['Email'] == undefined || item['Address'] == undefined) {
        _errorSave2 = true;
        break;
      }
    }

    let _numEror1 = 0;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i == '6' && formData.controls['IsDiscount'].value == true) {
        _numEror1 += 1;
        break;
      }
    }

    // this.checkUniqueColGrid(this.grid2, 'ApproveGroup');
    // if (this._errorUnique == false) {

      if (_numEror == 0) {
        if (_numEror1 == 0) {
          if (_errorSave0 == false) {
            if (_errorSave2 == false) {
              if (isApproveSend == true) {
                if (_errorSave == false) {
                  if (_errorSave1 == false) {
                    this.submit(formData, this.indexPage, isApproveSend).then(() => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, 'C3', this.id, false, '1');
                      }
                    });
                  }
                  else
                    alert('Mã nhân viên quy trình duyệt hoặc nhân viên được chỉ định duyệt, không được bỏ trắng giá trị');
                }
                else
                  alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
              }
              else
                this.submit(formData, this.indexPage_Editor);
            }
            else
              alert('Yêu cầu khai báo đầy đủ Tab Thông tin liên lạc của đối tác.');
          }
          else
            alert('Yêu cầu khai báo % Thanh toán hàng kỳ, % Quyết toán và Thời hạn (ngày) ở Tab "Thanh toán"');
        }
        else {
          alert('Hợp đồng có chiết khấu phải khai báo thông tin ở tab CHIẾT KHẤU');
        }
      }
      else {
        alert('Các Tab dữ liệu (Thanh toán, Tài liệu đính kèm, Bước duyệt, Thông tin liên lạc) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      }
    // }
    // else
    //   alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  }

  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_HD.docx', 'WorkFlow HD,PLHD - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
  // this.editorFrm.controls['ApproveSend'].setValue(true);
  // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
  // window.close();
}