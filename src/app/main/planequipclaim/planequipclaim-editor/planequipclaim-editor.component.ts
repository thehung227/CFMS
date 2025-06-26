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
import { LayoutPlanEquipClaimEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';
import { Console } from "console";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-planequipclaim-editor-form',
  templateUrl: './planequipclaim-editor.component.html',
  styleUrls: ['./planequipclaim-editor.component.css']
})

export class PlanEquipClaimEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;
  @ViewChild('filter') filter: wjcGridFilter.FlexGridFilter;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;

  indexPage = ['/main', 'planequipclaim', 'index'];
  folderName = 'Claim';
  indexPage_Editor = ['/main', 'planequipclaim', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPlanEquipClaimEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  output: any;
  _errItemSets: boolean = false;
  
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5];
    
    this.init().then(async() => {
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

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_GetDeptCodeFromEmployee_Claim', params) .toPromise().then();
      this.output = <Array<Object>>(_data['output']);
      this._errItemSets = this.output['@_Error'];
    
     
      if (this._errItemSets == true) {
        this.grid1.isReadOnly = true;
        this.grid2.isReadOnly = true;
      }
      else {
        this.grid1.isReadOnly = false;
        this.grid2.isReadOnly = false;
      }
      // if (this.parentData['ApproveSend'] == true) {
        
      //   this.grid1.isReadOnly = true;
        
      //   // this.grid3.isReadOnly = true;
      //   this.grid5.isReadOnly = true;
      // }
      // else {
      //   this.grid1.isReadOnly = false;
        
      //   this.grid3.isReadOnly = false;
      //   this.grid5.isReadOnly = false;
      // }
    });
   
    if (this._errItemSets == true) {
        
        this.grid1.isReadOnly = true;
        this.grid2.isReadOnly = true;
        this.grid3.isReadOnly = true;
        // this.grid3.isReadOnly = true;
        this.grid5.isReadOnly = true;
      }
      else {
        this.grid1.isReadOnly = false;
        
        this.grid3.isReadOnly = false;
        this.grid5.isReadOnly = false;
      }
   

    this.grid.isReadOnly = true;
    // this.grid1.isReadOnly = true;

    // this.grid2.allowAddNew = true;
    this.grid5.allowAddNew = false;
    this.grid3.allowAddNew = false;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid4);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

    //   if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
    //     let data = s.rows[e.row].dataItem;

    //     if (e.panel.cellType == wjcGrid.CellType.Cell) {
    //       if (data['InheritanceRowId'] == '') {
    //         wjcCore.setCss(e.cell, {
    //           color: 'red'
    //         });
    //       }
    //       else {
    //         wjcCore.setCss(e.cell, {
    //           color: '',
    //           // fontWeight: '',
    //           // backgroundColor: ''
    //         });
    //       }
    //     }
    //   }
    // });
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if (this.gridArray[3].itemsSource.items.length == 0) {
      _numEror += 1;
      // break;
    }

    if (this.gridArray[1].itemsSource.items.length == 0) {
      _numEror += 1;
      // break;
    }

    let _numEror1 = 0;
    if (this.gridArray[2].itemsSource.items.length == 0) {
      _numEror1 += 1;
      // break;
    }

    if (this.gridArray[5].itemsSource.items.length == 0) {
      _numEror += 1;
      // break;
    }
    // }

    let _errorSave1 = false;
    for (let item of this.grid3.itemsSource.items) {
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
    for (let item of this.grid5.itemsSource.items) {
      if ((item['PlanDate'] == '' || item['PlanDate'] == null || item['PlanDate'] == undefined || item['ActualDate'] == '' || item['ActualDate'] == null || item['ActualDate'] == undefined) && item['BuiltinOrder'] == 1) {
        _errorSave2 = true;
        break;
      }
    }
    if (((formData.controls['KLThiCongBCH'].value == 0) || (formData.controls['KLThiCongBCH'].value < 0)) && formData.controls['IsTamUng'].value == false) {
      alert('Yêu cầu nhập khối lượng đã TC của gói thầu (Gồm Khối lượng chưa Trình/ Chưa duyệt) - trước VAT !!!');
    }
    else
    if ((formData.controls['RemarkBCH'] == '') || (formData.controls['RemarkBCH'] == null) || (formData.controls['Remark'] == '') || (formData.controls['Remark'] == null)) {
      alert('Yêu cầu nhập đầy đủ dữ liệu (Ô Ghi chú) !!!');
    }
    else
    if ((formData.controls['MonthQuantityDate'].value == '' || formData.controls['MonthQuantityDate'].value == null || formData.controls['MonthQuantityDate'].value == undefined) && formData.controls['IsTamUng'].value == false) {
      alert('Yêu cầu nhập khối lượng tháng !!!');
    }
    else
    // if (formData.controls['OriginalWorkAmount'].value < 0 && formData.controls['IsTamUng'].value == false) {
    //   alert('Khối lượng thi công phải > 0');
    // }
    // else
    // if (formData.controls['OriginalClaimAmount1'].value < 0 || formData.controls['OriginalClaimAmount2'].value < 0) {
    //   alert('Giá trị thanh toán không được < 0');
    // }
    // else
    //   if (formData.controls['OriginalClaimAmount1'].value == 0 && formData.controls['OriginalClaimAmount'].value != 0) {
    //     alert('Giá trị thanh toán kỳ này phải > 0');
    //   }
    //   else
        if (formData.controls['OriginalClaimAmount2'].value != 0 && (formData.controls['PaymentDateKyNo'] == '' || formData.controls['PaymentDateKyNo'] == null || formData.controls['PaymentDateKyNo'] == undefined)) {
          alert('Yêu cầu nhập ngày TT kế hoạch Đ.Nợ');
        }
        else
          if (_numEror == 0) {
            if (_errorSave2 == false) {
              if (isApproveSend == true) {
                if (_numEror1 == 0) {
                  if (_errorSave1 == false) {

                    this.submit(formData, this.indexPage, isApproveSend).then(() => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, 'CL', this.id, false, '1');
                      }
                    });
                  }

                  else
                    alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
                }
                else
                  alert('Yêu cầu đính kèm trước khi gửi duyệt');
              }
              else
              // if (!this.parentData["CompletedApprove"])
                this.submit(formData, this.indexPage_Editor);
            // else
            //   this.submitNoUpdated(formData, this.indexPage_Editor).then(() => this.router.navigate(this.indexPage));
          }
              else
                alert('Yêu cầu nhập đầy đủ thông tin "LỊCH SỬ TRÌNH DUYỆT"');
            }
            
          else
            alert('Tab dữ liệu (Bước duyệt, Giá trị thực hiện, Lịch sử trình duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
      this.exportHtml_WorkFlow('WorkFlow_ClaimThanhToan.docx', 'WorkFlow Claim - {VAR=TenGoiThau} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }
}
