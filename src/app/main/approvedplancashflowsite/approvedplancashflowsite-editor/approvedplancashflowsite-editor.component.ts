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
import { LayoutApprovedPlanCashFlowSiteEditor } from "../Layout";
import { timeout } from "q";
import { Title } from "@angular/platform-browser";
import { Location } from "@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { SystemConstants } from "../../../core/common/system.constants";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import * as wjcGridFilter from 'wijmo/wijmo.grid.filter';

@Component({
  selector: "app-approvedplancashflowsite-editor-form",
  templateUrl: "./approvedplancashflowsite-editor.component.html",
  styleUrls: ["./approvedplancashflowsite-editor.component.css"],
})
export class ApprovedPlanCashFlowSiteEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("grid1") grid1: wjcGrid.FlexGrid;
  @ViewChild("grid2") grid2: wjcGrid.FlexGrid;
  @ViewChild("grid3") grid3: wjcGrid.FlexGrid;
  @ViewChild("grid4") grid4: wjcGrid.FlexGrid;
  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;

  indexPage = ["/main", "plansigncon", "index"];
  folderName = "Ke_Hoach_Dong_Tien";
  folderNameSendMail = "Ke_Hoach_Dong_Tien";

  output: any;
  _errItemSets: boolean = false;
  _errMess: any;

  constructor(
    service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _location: Location,
  ) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutApprovedPlanCashFlowSiteEditor(
      service,
      this.parentData,
    );
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [
      this.grid,
      this.grid1,
      this.grid2,
      this.grid3,
      this.grid4,
    ];
    this.init();
    this.grid.isReadOnly = true;
    this.grid1.isReadOnly = true;
    this.grid2.isReadOnly = true;
    this.grid.allowSorting = true;

    this.dbClickCellContent(this.grid1);
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
    if (
      Global.convertConfig("{VAR=User.Ma_CbNv}") !=
      this.parentData["EmployeeCode"]
    )
      alert("User đăng nhập không đúng với người duyệt!!!");
    else {
      let txt;
      if (state == 0) txt = "Trả lại";
      else if (state == 1) txt = "Duyệt";
      else if (state == 3) txt = "Đề xuất trả";

      let r = confirm("Xác nhận thao tác: " + txt.toUpperCase());

      this.showLoading = true;
      let params = new Array<ParameterContract>();
      const param1 = new ParameterContract();
      const param5 = new ParameterContract();
      const param6 = new ParameterContract();

      // let _value = formData.value['DocDate'];
      // if (_value instanceof Date) {
      //   _value = _value.toISOString();
      //   param1.ParameterName = Global.convertParameterName('DocDate');
      //   param1.ParameterValue = _value;
      //   params.push(param1);
      // }
      param1.ParameterName = Global.convertParameterName("IdCCMBudget");
      param1.ParameterValue =
        this.editorFrm.controls["IdCCMBudget"].value.toString();
      params.push(param1);

      param5.ParameterName = Global.convertParameterName("PositionCode");
      param5.ParameterValue =
        this.editorFrm.controls["PositionCode"].value.toString();
      params.push(param5);

      param6.ParameterName = Global.convertParameterName("State");
      param6.ParameterValue = state.toString();
      params.push(param6);

      try {
        let paramXML2 = new ParameterContract();
        paramXML2.ParameterName = this.convertParameterName(
          "B30CCMBudgetDetail1",
        );
        paramXML2.ParameterValue = "B30CCMBudgetDetail1";
        params.push(paramXML2);

        let ds = Global.getDataSetContract({
          name: "B30CCMBudgetDetail1",
          collection: Global.createColection(this.grid4.itemsSource),
        });

        let _data = await this._service
          .postXML(
            Global.DATA_ENDPOINT,
            BravoCtorEnum.StoreProcedure,
            "usp_B30CCMBudget_UpdateInfo_WhenApprove_K6",
            params,
            ds,
          )
          .toPromise()
          .then();

        this.output = <Array<Object>>_data["output"];

        this._errItemSets = this.output["@_Error"];
        this._errMess = this.output["@_ErrorMessage"];
      } catch (ex) {
        console.log(ex);
      }

      if (this._errItemSets) {
        alert(this._errMess);
        this.showLoading = true;
      } else {
        if (r == true) {
          this.showLoading = true;
          this.parentData["ApproveStatus"] = state;
          this.parentData["ApproveStatusWeb"] = state;
          location.reload()
          this.dfpanel
            .runConstraintVer2(
              "Evaluator_ServerUpdating_UpdateStatusByApproveStatus",
            )
            .then(() => {
              this.sendMail(
                this.editorFrm,
                "K6",
                this.parentData["IdCCMBudget"],
                false,
                state,
              ).then(() => {
                this.router.navigate(["/main", "notifications", "index"]);
              });
            });
          this.backClick();
        }
        else
          this.dfpanel.runConstraintVer2('Evaluator_ServerUpdating_UpdateStatusByApproveStatus').then(() => {
            this.sendMail(this.editorFrm, 'K9', this.parentData['IdCCMBudget'], false, state).then(() => {
              this.router.navigate(['/main', 'notifications', 'index']);
            });
          });
      }
    }
  }

  async saveData(formData: any, state: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();
    const param6 = new ParameterContract();

    // let _value = formData.value['DocDate'];
    // if (_value instanceof Date) {
    //   _value = _value.toISOString();
    //   param1.ParameterName = Global.convertParameterName('DocDate');
    //   param1.ParameterValue = _value;
    //   params.push(param1);
    // }

    param1.ParameterName = Global.convertParameterName("IdCCMBudget");
    param1.ParameterValue =
      this.editorFrm.controls["IdCCMBudget"].value.toString();
    params.push(param1);

    param5.ParameterName = Global.convertParameterName("PositionCode");
    param5.ParameterValue =
      this.editorFrm.controls["PositionCode"].value.toString();
    params.push(param5);

    param6.ParameterName = Global.convertParameterName("State");
    param6.ParameterValue = state.toString();
    params.push(param6);

    try {
      let paramXML2 = new ParameterContract();
      paramXML2.ParameterName = this.convertParameterName(
        "B30CCMBudgetDetail1",
      );
      paramXML2.ParameterValue = "B30CCMBudgetDetail1";
      params.push(paramXML2);

      let ds = Global.getDataSetContract({
        name: "B30CCMBudgetDetail1",
        collection: Global.createColection(this.grid4.itemsSource),
      });

      let _data = await this._service
        .postXML(
          Global.DATA_ENDPOINT,
          BravoCtorEnum.StoreProcedure,
          "usp_B30CCMBudget_UpdateInfo_WhenApprove_K6",
          params,
          ds,
        )
        .toPromise()
        .then();

      this.output = <Array<Object>>_data["output"];

      this._errItemSets = this.output["@_Error"];
      this._errMess = this.output["@_ErrorMessage"];
    } catch (ex) {
      console.log(ex);
    }

    if (this._errItemSets) {
      alert(this._errMess);
      this.showLoading = true;
    } else {
      location.reload();
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

  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.IdCCMBudget)
    let _command = this._layoutDeclare.layout.PrintDocument.Command;
    let _wordName =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].WordName;
    let _folderPath =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FolderPath;
    let _fileName =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[0].FileName;

    let params = {
      command: _command,
      wordName: _wordName,
      folderPath: _folderPath,
      fileName: _fileName,
      id: id,
    };
    let navigateUrl: any = [
      "#/main",
      "documentview",
      "detail",
      encodeURIComponent(CryptoExtension.encrypt(JSON.stringify(params))),
    ];
    window.open(navigateUrl.join("/"));
  }
}
