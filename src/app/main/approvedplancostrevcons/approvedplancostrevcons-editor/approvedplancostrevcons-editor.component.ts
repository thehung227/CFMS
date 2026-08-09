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
import { LayoutApprovedPlanCostRevConsEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { Global } from "../../../shared/global";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: 'app-approvedplancostrevcons-editor-form',
  templateUrl: './approvedplancostrevcons-editor.component.html',
  styleUrls: ['./approvedplancostrevcons-editor.component.css']
})

export class ApprovedPlanCostRevConsEditorComponent extends BaseEditorComponent implements OnInit, OnDestroy {

  @ViewChild('grid') grid: wjcGrid.FlexGrid;
  @ViewChild('grid1') grid1: wjcGrid.FlexGrid;
  @ViewChild('grid2') grid2: wjcGrid.FlexGrid;
  @ViewChild('dfpanel') _dfpanel: DynamicFormPanelComponent;

  indexPage = ['/main', 'plancostrevcons', 'index'];
  folderName = '01.Ke_Hoach_DoanhThu_ChiPhi';

  constructor(service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router, titleService: Title,
    private _location: Location) {
    super(service, route, pcs, elRef, router, titleService)
    this._layoutDeclare = new LayoutApprovedPlanCostRevConsEditor(service, this.parentData);
  }

  @HostListener('window:resize', [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;

    this.dbClickCellContent(this.grid1);
  }
  ngAfterViewInit() {
    this.dfpanel = this._dfpanel; this.afterViewInit();

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
 output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;
  
  async onClick(state: any) {
    if (Global.convertConfig('{VAR=User.Ma_CbNv}') != this.parentData['EmployeeCode'])
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      this.isLoading = true;
      this.parentData["ApproveStatus"] = state;
      this.parentData["ApproveStatusWeb"] = state;
      // await this.dfpanel.runConstraint('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(()=>{
      //   setTimeout(() => {
      //     window.close();
      //   }, 1000);
      // });
       this.showLoading = true;
      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param2 = new ParameterContract();
      const param3 = new ParameterContract();
      const param4 = new ParameterContract();
      const param5 = new ParameterContract();
  
      param1.ParameterName = Global.convertParameterName('ProductCostId');
      param1.ParameterValue = this.editorFrm.controls['ProductCostId'].value.toString();
      params.push(param1);
  
      param2.ParameterName = Global.convertParameterName('BranchCode');
      param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
      params.push(param2);
  
      param3.ParameterName = Global.convertParameterName('Id');
      param3.ParameterValue = this.id;
      params.push(param3);
  
      param4.ParameterName = Global.convertParameterName('UserId');
      param4.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_USERID).replace(/"/gi, '');
      params.push(param4);
      
      param5.ParameterName = Global.convertParameterName('State');
      param5.ParameterValue = state.toString();
      params.push(param5);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CTC_CheckHopDongKhongDuTruBCTC_Approved', params)
        .toPromise().then();
  
      this.output = <Array<Object>>(_data['output']);
      this._errBCTC = this.output['@_Error'];
      this._errMess = this.output['@_ErrorMessage']; 

       if (this._errMess) {
        alert(this._errMess)
        this.showLoading = true;
      }
      else
      {
      this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
        this.sendMail(this.editorFrm, 'K2', this.parentData['IdCCMBudget'], false, state).then(() => {
          this.router.navigate(['/main', 'notifications', 'index']);
        });
      });
    }
    }
      // this.backClick();
    }
  }
 
