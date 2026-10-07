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
import { LayoutApprovedContractEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { AutoSizeMode } from "wijmo/wijmo.grid";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedcontract-editor-form',
  templateUrl: './approvedcontract-editor.component.html',
  styleUrls: ['./approvedcontract-editor.component.css']
})

export class ApprovedContractEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('grid3') grid3: wjcGrid.FlexGrid;
  @ViewChild('grid4') grid4: wjcGrid.FlexGrid;
  @ViewChild('grid5') grid5: wjcGrid.FlexGrid;
  @ViewChild('grid6') grid6: wjcGrid.FlexGrid;
  @ViewChild('grid7') grid7: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'regcontract', 'index'];
  folderName = '02.Hop_Dong_Phu_Luc';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedContractEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
  output: any;
  _errItemSets: boolean = false;
  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3, this.grid4, this.grid5, this.grid6, this.grid7];
    this.init().then(async ()=>{
  
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

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_GetDeptCodeFromEmployee', params) .toPromise().then();
      console.log (_data)
      this.output = <Array<Object>>(_data['output']);
      this._errItemSets = this.output['@_Error'];
      
      if (this._errItemSets == true) {
       console.log(this._errItemSets)
        this.grid5.isReadOnly = true;
      }
      else {
      
        this.grid5.isReadOnly = false;
      }

    });
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    // this.grid2.isReadOnly = true;
    this.grid.allowAddNew = false;
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.isReadOnly = true;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;

    this.afterViewInit();

    //this.wordWrapGrid();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any) {
    this.submit(formData, this.indexPage);
  }

  backClick() {
    this._location.back();
  }

  isLoading = false;
  async onClick(state: any) {
    if (state == '1' && this.editorFrm.controls['OperationCode'].value == 'Y' && (this.editorFrm.controls['ProcessCodeNext'].value == '' || this.editorFrm.controls['ProcessCodeNext'].value == undefined))
      alert("Yêu cầu xác định quy trình duyệt tiếp theo đối với Chuyên viên CCM");
    else 
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      this.parentData["PosReturn"] = this.selectValue;

      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'C3', this.parentData['IdBizDoc'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
  }

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_PLA)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName = this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = { 'command': _command, 'wordName': _wordName, 'folderPath': _folderPath, 'fileName': _fileName, 'id': id };
    let navigateUrl: any = ['#/main', 'documentview', 'detail', encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params)))];
    window.open(navigateUrl.join('/'));
  }

  items: any[] = [
    { id: 1, name: 'Công trường' },
    { id: 2, name: 'Chuyên viên CCM' }
  ];
  selected: number = 1;

  selectValue: any = 1;

  selectOption(id: number) {
    this.selectValue = id;
  }

}
