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
import { LayoutSafePunishEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { SystemConstants } from "../../../core/common/system.constants";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-safepunish-editor-form',
  templateUrl: './safepunish-editor.component.html',
  styleUrls: ['./safepunish-editor.component.css']
})

export class SafePunishEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {
  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'safepunish', 'index'];
  indexPage_Editor = ['/main', 'safepunish', 'detail'];
  folderName = 'De_Nghi_Phat_An_Toan';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutSafePunishEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init();
    this.grid1.isReadOnly = false;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _numEror = 0;
    // for (let i in this.gridArray) {
    if ((this.gridArray[0].itemsSource.items.length == 0) || (this.gridArray[1].itemsSource.items.length == 0)) {
      _numEror += 1;
    }
    // }

    let _errorSave = false;
    for (let item of this.grid.itemsSource.items) {
      if (!item['FilePath']) {
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
    if(formData instanceof FormGroup) {
      if (formData.get('StartDate').value == '' || formData.get('StartDate').value == null || formData.get('StartDate').value == undefined) {
        _errorSave2 = true;
      }
    }
    
    // for (let item of this.grid.itemsSource.items) {
    //   if (!item['DocumentCode'] || !item['Description']) {
    //     _errorSave2 = true;
    //     break;
    //   }
    // }

    if (_numEror == 0) {
      if (_errorSave2 == false) {
      if (isApproveSend == true) {
        if (_errorSave == false) {
          if (_errorSave1 == false) {
            this.submit(formData, this.indexPage, isApproveSend).then(() => {
              if (this.allowSendMail) {
                this.sendMail(formData, 'V6', this.id, false, '1');
              }
            });
          }
          else
            alert('Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị');
        }
        else
          alert('Yêu cầu đính kèm biên bản vi phạm trước khi gửi duyệt');
      }
      else
        this.submit(formData, this.indexPage_Editor);
      }
      else
        alert('Ngày lập biên bản không được bỏ trống.');
    }
    else
      alert('Các Tab dữ liệu (Đính kèm biên bản phạt, Bước duyệt) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    let html = this.printVoucher(input);

    html.then(data => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  async replaceSign(formData: any) {
    let _numEror = 0;
    if (this.gridArray[0].itemsSource.items.length == 0) {
      _numEror += 1;
    }

    let _errorSave2 = false;
    for (let item of this.grid.itemsSource.items) {
      if (!item['FilePath'] || !item['DocumentCode'] || !item['Description']) {
        _errorSave2 = true;
        break;
      }
    }

    if (_numEror == 0) {
      if (_errorSave2 == false) {
        // await this.submitNoUpdated(formData, this.indexPage_Editor).then();
        //gửi mail nhắc Khởi tạo
        this.showLoading = true;
        const params = new Array<ParameterContract>();
        const param1 = new ParameterContract();
        const param2 = new ParameterContract();
        const param3 = new ParameterContract();
        const param4 = new ParameterContract();
        const param5 = new ParameterContract();
        const param6 = new ParameterContract();

        param1.ParameterName = Global.convertParameterName('Id');
        param1.ParameterValue = this.id;
        params.push(param1);

        // param2.ParameterName = Global.convertParameterName('DocCode');
        // param2.ParameterValue = this.parentData['DocCode'];
        // params.push(param2);

        // param3.ParameterName = Global.convertParameterName('nUserId');
        // param3.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID).replace(/"/gi, '');
        // params.push(param3);

        // param4.ParameterName = Global.convertParameterName('BranchCode');
        // param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
        // params.push(param4);

        param5.ParameterName = Global.convertParameterName('State');
        param5.ParameterValue = -1;
        params.push(param5);

        param6.ParameterName = Global.convertParameterName('IsGetTemplate');
        param6.ParameterValue = 0;
        params.push(param6);

        let _data = await this._service.postData(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_SOL_EmailXuLyVBNB', params)
          .toPromise().then();

        alert('Thông báo gửi mail: ' + _data[0]['Column1']);
        this.showLoading = true;
        this.router.navigate(['/main', 'safepunish', 'index']);
      }
      else
        alert('File Trình duyệt, Số văn bản, Tên văn bản không được bỏ trắng giá trị');
    }
    else
      alert('Tab dữ liệu (Tài liệu đính kèm) cần có dữ liệu để Lưu. Yêu cầu cập nhật đầy đủ thông tin');
  }

  exportHtmlWorkFlow(input: any, extInput?: string) {
    this.exportHtml_WorkFlow('WorkFlow_VBQLNB.docx', 'WorkFlow VBQLNB - {VAR=TenGoiThau} - {VAR=CustomerName} - {VAR=DocNo}', '/3.Mau_In/{VAR=Branch.Ma_Dvcs}/', input, extInput, 'DocCode');
  }

  ngOnDestroy() {
    this.destroy();
  }
}
