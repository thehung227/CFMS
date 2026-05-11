import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  ElementRef,
  HostListener,
} from "@angular/core";
import { BaseEditorComponent } from "../../_baseform/base-editor.component";
import { WjGridModule } from "wijmo/wijmo.angular2.grid";
import { WjInputModule } from "wijmo/wijmo.angular2.input";

import * as wjcCore from "wijmo/wijmo";
import * as wjcGrid from "wijmo/wijmo.grid";
import * as wjcInput from "wijmo/wijmo.angular2.input";
import { DynamicFormPanelComponent } from "../../../ui/form/dynamic-form-panel.component";
import { BaseEditorService } from "../../../base/base.service-editor";
import { ActivatedRoute, Router } from "@angular/router";
import { PanelControlService } from "../../../ui/panel/PanelControlService";
import { LayoutSettlementRecordsEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { data } from "jquery";

@Component({
  selector: "app-settlementrecords-editor-form",
  templateUrl: "./settlementrecords-editor.component.html",
  styleUrls: ["./settlementrecords-editor.component.css"],
})
export class SettlementRecordsEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("grid1") grid1: wjcGrid.FlexGrid;
  @ViewChild("grid2") grid2: wjcGrid.FlexGrid;
  @ViewChild("grid3") grid3: wjcGrid.FlexGrid;
  @ViewChild("grid4") grid4: wjcGrid.FlexGrid;
  @ViewChild("grid5") grid5: wjcGrid.FlexGrid;

  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;
  indexPage = ["/main", "settlementrecords", "index"];
  indexPage_Editor = ["/main", "settlementrecords", "detail"];
  folderName = "Ho_So_Quyet_Toan";

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
    this._layoutDeclare = new LayoutSettlementRecordsEditor(
      service,
      this.parentData,
    );
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.resizeWidthControls();
  }
 output1: any;
  _errItemSets1: boolean = false;
  ngOnInit() {
    this.gridArray = [
      this.grid,
      this.grid1,
      this.grid2,
      this.grid3,
      this.grid4,
      this.grid5,
    ];
    this.init().then(async () => {

      let _value;
      const params = new Array<ParameterContract>();
      const param1 = new ParameterContract();

      _value = localStorage.getItem(SystemConstants.PRODUCTCOSTID).replace(/"/gi, '');

      param1.ParameterName = Global.convertParameterName('ProductCostId');
      param1.ParameterValue = _value;
      params.push(param1);

      let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_HSQT_CheckVersion', params).toPromise().then();
      this.output1 = <Array<Object>>(_data['output']);
      this._errItemSets1 = this.output1['@_Error'];

      if (this._errItemSets1  == true) {
        this.grid.allowAddNew = false;
        this.grid.isReadOnly = true;
      }
      else {
        this.grid.allowAddNew = true;
        this.grid.isReadOnly = false;
      }

    });
    this.grid2.allowAddNew = false;
    this.grid3.allowAddNew = false;
    this.grid4.allowAddNew = false;
  }

    output: any;
  _errItemSets: boolean = false;
  _errMess: any;

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();

    // Apply group by 'Gói thầu' for subtotals on grid2
    this.grid2.itemsSourceChanged.addHandler(() => {
      this.applyGroupGrid2();
    });

    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let column = e.panel.columns[e.col].binding;
        let data = s.rows[e.row].dataItem;

        // if (e.panel.cellType == wjcGrid.CellType.Cell) {
        //           if (data["IsTitleRow"] == true) {
        //             wjcCore.setCss(e.cell, {
        //               color: "red",
        //               fontWeight: "",
        //               backgroundColor: "",
        //             });
        //           } else {
        //             wjcCore.setCss(e.cell, {
        //               color: "",
        //               fontWeight: "",
        //               backgroundColor: "",
        //             });
        //           }
        //         }

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (column == "TongGiaTriDuKienQT_ChuaVAT") {
            wjcCore.setCss(e.cell, {
              color: "blue",
              fontWeight: "bold",
              backgroundColor: "",
            });
          } else if (column == "TongDoanhThuDaXacNhan_ChuaVAT") {
            wjcCore.setCss(e.cell, {
              color: "blue",
              fontWeight: "bold",
              backgroundColor: "",
            });
          } else if (
            column == "DoanhThuConLai_TrucTiep_ChuaVAT" ||
            column == "DoanhThuConLai_NSC_ChuaVAT" ||
            column == "PhaiThuConLai_TrucTiep_ChuaVAT" ||
            column == "PhaiThuConLai_NSC_ChuaVAT" ||
            column == "TongGiaTriDuKienQT_GomVAT" ||
            column == "CDTThanhToan_GomVAT" ||
            column == "PhaiThuConLai_TrucTiep_GomVAT" ||
            column == "PhaiThuConLai_NSC_GomVAT" ||
            column == "TongDoanhThuConLai_ChuaVAT" ||
            column == "PhaiThuConLai_GomVAT"
          ) {
            wjcCore.setCss(e.cell, {
              color: "blue",
              fontWeight: "bold",
              backgroundColor: "",
            });
          } else {
            wjcCore.setCss(e.cell, {
              color: "",
              fontWeight: "",
              backgroundColor: "",
            });
          }
        }
      }
    });
  }

  applyGroupGrid2() {
    var cv = this.grid2.collectionView;
    if (cv != null) {
      cv.beginUpdate();
      cv.groupDescriptions.clear();
      var groupDesc = new wjcCore.PropertyGroupDescription("GoiThau");
      cv.groupDescriptions.push(groupDesc);
      cv.endUpdate();
    }
    this.grid2.groupHeaderFormat = "<b>{value}</b> ({count:n0} mục)";
  }

  onSubmit(formData: any, isApproveSend?: boolean) {
    let _errorSave0: boolean = false;
    for (let i in this.gridArray) {
      if (this.gridArray[i].itemsSource.items.length == 0 && i != "4") {
        _errorSave0 = true;
        break;
      }
    }

    if (isApproveSend == true) {
      let r = confirm("Bạn có xác nhận vẫn gửi duyệt ?");
      if (r == true) {
        if (_errorSave0 == false) {
           this.checkNhapLieu(formData).then(() => {
            if (this._errItemSets == false) {
          this.submit(formData, this.indexPage, isApproveSend).then(() => {
            if (this.allowSendMail) {
              this.sendMail(formData, 'S1', this.id, false, '1');
            }
          });
           }
                  else {
                    alert(this._errMess);
                    this.showLoading = false;
                  
        }
        });
      } 
        else {
          alert("Không thể gửi duyệt. Vui lòng kiểm tra lại dữ liệu.");
        }
      }
    } else {
      this.submit(formData, this.indexPage_Editor);
    }
  }

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }


  async checkNhapLieu(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName("Id");
    param1.ParameterValue = this.id;
    params.push(param1);

    let _data = await this._service
      .getDataOutput(
        Global.DATA_ENDPOINT,
        BravoCtorEnum.StoreProcedure,
        "usp_HSQT_CheckData",
        params,
      )
      .toPromise()
      .then();

    this.output = <Array<Object>>_data["output"];
    this._errItemSets = this.output["@_Error"];
    this._errMess = this.output["@_ErrorMessage"];
  }

  async onClick_2(state?: any) {
    try {
      this.showDialog = false; //Thêm dialog

      if (this.editorFrm.valid) {
        this.showLoading = true;
        this.taidulieu = true;
      }

      for (let command of this._layoutDeclare.buttonLoadChild2) {
        if (this.editorFrm.valid)
          await this.dfpanel.runConstraint(command).then();
      }

      this.showLoading = false;
    } catch (ex) {
      alert("Xảy ra lỗi trong quá trình thực hiện");
      console.log(ex);
      this.showLoading = false;
    }
  }
  showDocumentInNewTab(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
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
