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
import { LayoutBillPaySuppEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billpaysupp-explorer/billpaysupp-printer.data";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflowTT-printer.data";
import { FormGroup } from "@angular/forms";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Popup } from "wijmo/wijmo.input";

@Component({
  selector: 'app-billpaysupp-editor-form',
  templateUrl: './billpaysupp-editor.component.html',
  styleUrls: ['./billpaysupp-editor.component.css']
})

export class BillPaySuppEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('dataPopup') dataPopup: Popup;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();
  indexPage = ['/main', 'billpaysupp', 'index'];
  folderName = '06.Thanh_Toan_TP_NCC';
  indexPage_Editor = ['/main', 'billpaysupp', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutBillPaySuppEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  isSubAdmin: string;
  employeeCode: string = '';
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6];
    this.init().then(() => this.refreshTongThanhToan3Ben());
    this.isSubAdmin = localStorage.getItem(SystemConstants.CURRENT_ISSUBADMIN);
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid4.allowAddNew = false;
    this.grid5.allowAddNew = false;
    this.grid6.allowAddNew = false;


    this.dbClickCellContent(this.grid3);
    this.employeeCode = localStorage.getItem(SystemConstants.CURRENT_EMPLOYEE);
   
    this.employeeCode = (this.employeeCode || '').toString().trim();
     console.log(this.employeeCode)
    // console.log(localStorage.getItem(SystemConstants.POSITION_EMPLOYEE))
 
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

    // Render cột HrefLink thành nút bấm mở link trên tab mới
    this.grid5.formatItem.addHandler((s: wjcGrid.FlexGrid, e: wjcGrid.FormatItemEventArgs) => {
      if (e.panel.cellType != wjcGrid.CellType.Cell) return;
      let col = s.columns[e.col];
      if (!col || col.binding != 'HrefLink') return;

      let url = (s.getCellData(e.row, e.col, false) || '').toString().trim();
      if (url) {
        e.cell.innerHTML = '<button type="button" class="btn btn-link" '
          + 'style="padding:0;color:#1565c0;text-decoration:underline;cursor:pointer;" '
          + 'onclick="event.stopPropagation();window.open(\'' + url.replace(/'/g, "\\'") + '\',\'_blank\')">'
          + 'Link</button>';
      } else {
        e.cell.innerHTML = '';
      }
    });
  }

  // Đầu phiếu: Tổng giá trị thanh toán 3 bên của Bảng KL thanh toán liên kết và Số tiền còn lại
  async refreshTongThanhToan3Ben() {
    await this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_TT3Ben');
    await this.dfpanel.runConstraint('Evaluator_Amount_ConLaiTT3Ben_Calculate');
  }

  ngOnDestroy() {
    this.destroy();
  }
  output: any;
  _err: boolean = false;
  _errMess: any;
  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[1].itemsSource.items.length == 0) || (this.gridArray[2].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }
    // if(formData instanceof FormGroup) {
    //   formData.get('ClassCode1').value;
    // console.log('###########',formData.get('ClassCode1').value)

    // }
    let _errorSave1 = false;
    let _errorSave2 = false;
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
    if(formData instanceof FormGroup) {
      if (formData.get('ClassCode1').value != 'CD01' && (formData.get('Date_Liquidation').value == '' || formData.get('Date_Liquidation').value == null || formData.get('Date_Liquidation').value == undefined)) {
        _errorSave2 = true;
      }
    }
    
    // this.checkUniqueColGrid(this.grid2, 'ApproveGroup');
    if (_errorSave2 == false) {
    // if (this._errorUnique == false) {
      if (_numEror == 0) {
        if (isApproveSend == true) {
          this.checkData(formData).then(() => {
            
            if (this._err == false) {
              
          let _errorSave = false;
          for (let item of this.grid1.itemsSource.items) {
            if (item['Attached'] == true && item['Description'] != 'Theo mẫu công ty ban hành' && (item['FilePath'] == '' || item['FilePath'] == undefined)) {
              _errorSave = true;
              break;
            }
          }
          if (_errorSave) {
            alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
          }
          else {
            // this.editorFrm.controls['ApproveSend'].setValue(true);
            // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
            // window.close();
            if (_errorSave1 == false) {
              this.submit(formData, this.indexPage, isApproveSend).then(() => {
                if (this.allowSendMail) {
                  this.sendMail(formData, 'P4', this.id, false, '1');
                }
              });
            } else
              alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
          }
        }
        else {
          alert(this._errMess);
          this.showLoading = false;
        }
      })
        }
        else
          this.submit(formData, this.indexPage_Editor);
        // this.submit(formData, this.indexPage_Editor).then(()=>{
        //   location.reload(false);
        // });
      }
      else {
        alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      }
    // }
    // else
    //   alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  }
  else 
  alert('Yêu cầu nhập Ngày tính hạn thanh toán');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

GetBillSuppCommandKey(docDate) {
    var year = new Date(docDate).getFullYear();
    return year === 2024 ? 'billsupp2024-editor' : 'billsupp-editor';
}

async checkData(formData: any) {
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('Id');
    param1.ParameterValue = this.id;
    params.push(param1);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30BizDocContactInfo');
      paramXML.ParameterValue = 'B30BizDocContactInfo';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocContactInfo',
          collection: Global.createColection(this.grid3.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_B30BizDocCCM_CheckBilPaySupp', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['output']);
      this._err = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async onClick_2(state?: any) {
    try {
      this.showDialog = false;//Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild2) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    }
    catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }

_errItemSets: boolean = false;
dataPopupContent: any = null;
async saveData(formData: any,state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('BizDocId');
    param1.ParameterValue = this.parentData['BizDocId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('nUserId');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID);
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('ProductCostId');
    param3.ParameterValue = this.editorFrm.controls['ProductCostId'].value.toString();
    params.push(param3);



    let _data: any = null;

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName('B30BizDocContactInfo');
      paramXML.ParameterValue = 'B30BizDocContactInfo';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocContactInfo',
          collection: Global.createColection(this.grid5.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_AutoCreateAccountDocument_Bill', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['data']);

      this._errItemSets = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }

    if (this._errItemSets) {
      alert(this._errMess)
      this.showLoading = true;
    }
    else
    {
      // Lấy phần tử đầu tiên nếu output là mảng
      // if (Array.isArray(output) && output.length > 0) {
      //   this.dataPopupContent = output[0]; // 👈 lấy hóa đơn đầu tiên
      // } else {
      //   this.dataPopupContent = output || _data;
      // }
      this.dataPopupContent = this.output[0];

      console.log('Data để show popup:', this.dataPopupContent);
      if (this.dataPopup) {
        this.dataPopup.show(true);
        
      }
      // location.reload()
      // console.log(this.parentData['Id'])
      // this.indexPage_Editor.push(this.parentData['Id']);
      // this.router.navigate(['main']).then(() => {
      //   this.router.navigate(this.indexPage_Editor).then(() => {
      //     if (this.indexPage_Editor.length > 3)
      //     this.indexPage_Editor.pop();
      //   })
      // });
    }
  }

  closePopup() {
    this.dataPopup.hide();     // Ẩn popup
    location.reload();         // Reload lại trang
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
    this.exportHtml_WorkFlow('WorkFlow_TT.docx', 'WorkFlow TP.NCC - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  
}
