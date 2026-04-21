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
import { LayoutTenderSelectionEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { UploadInput } from "../../../ui/input/UploadInput";

@Component({
  selector: 'app-tenderselection-editor-form',
  templateUrl: './tenderselection-editor.component.html',
  styleUrls: ['./tenderselection-editor.component.css']
})

export class TenderSelectionEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'tenderselection', 'index'];
  indexPage_Editor = ['/main', 'tenderselection', 'detail'];
  folderName = 'So_Sanh_Chon_Thau';
  folderNameSendMail = 'So_Sanh_Chon_Thau';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutTenderSelectionEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4];
    this.init().then(async () => {
      if (this.parentData['ApproveSend'] == true) {
        this.grid1.isReadOnly = true;
        this.grid2.isReadOnly = true;
      }
      else {
        this.grid1.isReadOnly = false;
        this.grid2.isReadOnly = false;
      }
    });
    this.grid1.isReadOnly = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
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
      paramXML.ParameterName = this.convertParameterName('B30BizDocVBDetail3');
      paramXML.ParameterValue = 'B30BizDocVBDetail3';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocVBDetail3',
          collection: Global.createColection(this.grid.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_TenderSelection_CheckData', params, ds)
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
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[0].itemsSource.items.length == 0) || (this.gridArray[1].itemsSource.items.length == 0) || (this.gridArray[4].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (item['Attached'] == true && !item['FilePath']) {
        _errorSave = true;
        break;
      }
    }

    let _errorSave1 = false;
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
    if (formData.get('ClassCode3').value != '01' && (formData.get('ParentBizDocId').value == null || formData.get('ParentBizDocId').value == ''))
      _errorSave2 = true

    if (isApproveSend == true) {
      this.checkData(formData).then(() => {
        if (this._err == false) {
          if (_numEror == 0) {
            if (formData.get('TotalRate').value == 1) {
              if (_errorSave2 == false) {
                if (_errorSave == false) {
                  if (_errorSave1 == false) {
                    this.submit(formData, this.indexPage, isApproveSend).then(() => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, 'A5', this.id, false, '1');
                      }
                    });
                  }
                  else
                    alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
                }
                else
                  alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt');
              }
              else
                alert('Yêu cầu chọn Version.');
            }
            else
              alert('Tổng % giao thầu phải bằng 100% !');
          }
          else
            alert('Các Tab dữ liệu (NTP/ NCC chọn, Đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin');
        }
        else {
          alert(this._errMess);
          this.showLoading = false;
        }

      })
    }
    else
      // if (!this.parentData["CompletedApprove"])
      this.submit(formData, this.indexPage_Editor);
    // else
    //   this.submitNoUpdated(formData, this.indexPage_Editor).then(() => this.router.navigate(this.indexPage));
  }


  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_SSG.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }
}
