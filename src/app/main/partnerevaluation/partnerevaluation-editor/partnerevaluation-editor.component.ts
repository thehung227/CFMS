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
import { LayoutPartnerEvaluationEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinterWordFlow } from "../../_printerlayout/workflow/workflow-printer.data";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-partnerevaluation-editor-form',
  templateUrl: './partnerevaluation-editor.component.html',
  styleUrls: ['./partnerevaluation-editor.component.css']
})

export class PartnerEvaluationEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  @ViewChild('gridPrint') gridPrint: wjcGrid.FlexGrid;
  layoutPrintWordFlow: LayoutPrinterWordFlow = new LayoutPrinterWordFlow();

  indexPage = ['/main', 'partnerevaluation', 'index'];
  folderName = 'Danh_Gia_Doi_Tac';
  indexPage_Editor = ['/main', 'partnerevaluation', 'detail'];

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutPartnerEvaluationEditor(service, this.parentData);
    this._layoutPrinter_WordFlow = this.layoutPrintWordFlow.Layout;
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  nUserId: string;
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6];
    this.init();
    this.nUserId = localStorage.getItem(SystemConstants.CURRENT_USERID);
    console.log(this.nUserId)
    this.grid.allowAddNew = false;
    this.grid6.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    // this.grid.isReadOnly = true;

    this.dbClickCellContent2(this.grid);

    // this.dbClickCellContent(this.grid3);
    
  }

  dbClickCellContent2(flex: wjcGrid.FlexGrid) {
    let pop = this.frmPopupTooltip;

    // if (!flex.isReadOnly)
    //   return;

    let host = flex.hostElement;
    let self = this;

    host.addEventListener('dblclick', () => {
      var sel = flex.selection;

      let _content = flex.getCellData(sel.row, sel.col, true);

      this.contentPopupTooltip['nativeElement'].innerHTML = _content;

      pop.show();


    });
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
    this.grid6.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {

      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data['IsTitleRow'] == true) {
            wjcCore.setCss(e.cell, {
              color: 'blue',
              fontWeight: 'bold',
              backgroundColor: '#f8f1e6'
            });
          } else if (data['_FormatStyleKey'] == 'BOLD') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: ''
            });
          }
          else if (data['_FormatStyleKey'] == 'Subtotal0') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: '#fdf5e6'
            });
          }
          else if (data['_FormatStyleKey'] == 'GrandTotal') {
            wjcCore.setCss(e.cell, {
              fontWeight: 'bold',
              backgroundColor: '#fafad2'
            });
          }
          else {
            wjcCore.setCss(e.cell, {
              color: '',
              fontWeight: '',
              backgroundColor: ''
            });
          }
        }
      }
    });
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
      paramXML.ParameterName = this.convertParameterName('B30BizDocVBDetail');
      paramXML.ParameterValue = 'B30BizDocVBDetail';
      params.push(paramXML);

      let ds = Global.getDataSetContract(
        {
          name: 'B30BizDocVBDetail',
          collection: Global.createColection(this.grid.itemsSource)
        }
      )
      let _data = await this._service.postXML(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CFMS_PartnerEvaluation_CheckData', params, ds)
        .toPromise().then();

      this.output = <Array<Object>>(_data['output']);
      this._err = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage'];
    }
    catch (ex) {
      console.log(ex);
    }
  }

  async onSubmit(formData: any, isApproveSend?: boolean) {
    
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

        if (isApproveSend == true) {
          if (_errorSave1 == false) {
          this.checkData(formData).then(() => {
            if (this._err == false) {
              this.submit(formData, this.indexPage, isApproveSend).then(() => {
                if (this.allowSendMail) {
                  
                  this.sendMail(formData, 'O1', this.id, false, '1');
                }
              });
            } 
            else {
              alert(this._errMess);
              this.showLoading = false;
            }
    
          })
          }
          else
            alert('Mã nhân viên quy trình duyệt hoặc nhân viên được chỉ định duyệt, không được bỏ trắng giá trị');
      
        }
            // else
            //   alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
          
        
        else
          this.submit(formData, this.indexPage_Editor);
      }
      // else {
      //   alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      // }
    // else
    //   alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);


    // this.checkUniqueColGrid(this.grid2, 'ApproveGroup');
    // if (this._errorUnique == false) {
      // if (formData.controls['NumDayApprove'].value == 0) {
      //   alert('Số ngày duyệt theo HĐ phải > 0');
      // }
      // else
      // if (formData.controls['NumDayPayment'].value == 0) {
      //   alert('Số ngày thanh toán theo HĐ phải > 0');
      // }
      // else
      // if (_numEror == 0) {
      //   // if (_errorSave0 == false) {
      //     if (_errorSave2 == false) {
      //       if (isApproveSend == true) {
      //         // if (_errorSave == false) {
      //           if (_errorSave1 == false) {
      //             this.submit(formData, this.indexPage, isApproveSend).then(() => {
      //               if (this.allowSendMail) {
      //                 this.sendMail(formData, 'C2', this.id, false, '1');
      //               }
      //             });
      //           }
      //           else
      //             alert('Mã nhân viên quy trình duyệt hoặc nhân viên được chỉ định duyệt, không được bỏ trắng giá trị');
      //         // }
      //         // else
      //         //   alert('Yêu cầu đính kèm tài liệu trước khi gửi duyệt!');
      //       }
      //       else
      //         this.submit(formData, this.indexPage_Editor);
      //     }
      //     else
      //       alert('Yêu cầu khai báo đầy đủ Tab Thông tin liên lạc của đối tác.');
        // }
        // else
        //   alert('Yêu cầu khai báo % Thanh toán hàng kỳ, % Quyết toán và Thời hạn (ngày) ở Tab "Thanh toán"');
      // }
      // else {
      //   alert('Các Tab dữ liệu (Tài liệu đính kèm, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu (nếu có) hoặc điền đầy đủ thông tin.');
      // }
  //}
  //   else
  //     alert('Dữ liệu STT duyệt đang bị trùng, giá trị trùng: ' + this._valueDuplicate);
  // }

  showPrintVoucher_WorklFlow(input: any, gridForm?: wjcGrid.FlexGrid, extInput?: string) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher_WordFlow(input, 'MAU1', gridForm, extInput, 'DocCode');

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }


  exportHtmlWorkFlow(input: any, extInput?: string) {
    if (this.parentData["CompletedApprove"] == false) {
      alert('Hồ sơ chưa hoàn thiện duyệt, không thể in ấn workflow');
      return;
    }
    else
    {
      console.log(this.parentData['DocCode'])
      this.exportHtml_WorkFlow('WorkFlow_HD_CDT.docx', 'WorkFlow HD,PLHD - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
    }
  }
  // this.editorFrm.controls['ApproveSend'].setValue(true);
  // this.dfpanel.runConstraint('Evaluator_UpdateApproveSend').then();
  // window.close(); 
}