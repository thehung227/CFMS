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
import { Title } from "@angular/platform-browser";
import * as wjcGridFilter from "wijmo/wijmo.grid.filter";
import { LayoutCcmAuxiliaryMaterialsBugetEditor } from "../Layout";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { BaseExplorerService } from "../../../base/base.service-explorer";

const MSG_MUST_LOAD =
  'Gói thầu đã có Kế hoạch vật tư phụ được duyệt. Yêu cầu nhấn "Tải dữ liệu" để lấy dữ liệu version trước khi nhập liệu.';

@Component({
  selector: "app-ccmauxiliarymaterialsbuget-editor-form",
  templateUrl: "./ccmauxiliarymaterialsbuget-editor.component.html",
  styleUrls: ["./ccmauxiliarymaterialsbuget-editor.component.css"],
})
export class CcmAuxiliaryMaterialsBugetEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("grid1") grid1: wjcGrid.FlexGrid;
  @ViewChild("grid2") grid2: wjcGrid.FlexGrid;
  @ViewChild("grid3") grid3: wjcGrid.FlexGrid;
  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;
  @ViewChild("filter") filter: wjcGridFilter.FlexGridFilter;

  @ViewChild("gridPrint") gridPrint: wjcGrid.FlexGrid;

  indexPage = ["/main", "ccmauxiliarymaterialsbuget", "index"];
  folderName = "Ke_Hoach_Mua_Hang";
  indexPage_Editor = ["/main", "ccmauxiliarymaterialsbuget", "detail"];
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;
  // Gói thầu đã có ít nhất 1 version được duyệt → version kế tiếp phải "Tải dữ liệu" trước khi nhập liệu
  hasApprovedVersion: boolean = false;

  constructor(
    service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _explorerService: BaseExplorerService,
  ) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutCcmAuxiliaryMaterialsBugetEditor(
      service,
      this.parentData,
    );
  }

  @HostListener("window:resize", [])
  onWindowResize() {
    // this.resizeWidthControls();
  }

  ngOnInit() {
    this.gridArray = [this.grid, this.grid1, this.grid2, this.grid3];
    this.init().then(() => {
      this.checkApprovedVersion().catch((ex) => console.log(ex));
      this.editorFrm
        .get("ProductCostId")
        .valueChanges.subscribe(() =>
          this.checkApprovedVersion().catch((ex) => console.log(ex)),
        );
    });
    //this.grid1.isReadOnly = true;
    this.grid1.allowAddNew = false;
    this.grid2.isReadOnly = true;

    // Chặn nhập liệu lưới chi tiết khi bắt buộc "Tải dữ liệu" mà chưa tải
    const guardInput = (s, e: wjcGrid.CellRangeEventArgs) => {
      if (this.mustLoadBeforeInput()) {
        e.cancel = true;
        alert(MSG_MUST_LOAD);
      }
    };
    this.grid.beginningEdit.addHandler(guardInput);
    this.grid.pasting.addHandler(guardInput);

    this.dbClickCellContent(this.grid2);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "blue",
              fontWeight: "bold",
            });
          } else {
            if (data["IsLink"] == false) {
              wjcCore.setCss(e.cell, {
                color: "red",
                fontWeight: "",
              });
            } else {
              wjcCore.setCss(e.cell, {
                color: "",
                fontWeight: "",
                // fontWeight: '',
                // backgroundColor: ''
              });
            }
          }
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  // CCM: luu truc tiep. Da bo cac rule chan cua ban goc (bat buoc cac tab co du
  // lieu, bat buoc cot ma nhom hang / ma hang, kiem tra khoi luong ke hoach so
  // voi PO) va bo nhanh gui duyet - man hinh CCM khong co nut Gui duyet.
  onSubmit(formData: any) {
    this.submit(formData, this.indexPage_Editor);
  }

  async checkKhoiLuong_KeHoach_PO(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName("Id");
    param1.ParameterValue = this.id;
    params.push(param1);

    param2.ParameterName = Global.convertParameterName("ProductCostId");
    param2.ParameterValue = formData.value["ProductCostId"];
    params.push(param2);

    param3.ParameterName = Global.convertParameterName("ProcessCode");
    param3.ParameterValue = formData.value["ProcessCode"];
    params.push(param3);

    param4.ParameterName = Global.convertParameterName("BranchCode");
    param4.ParameterValue = localStorage
      .getItem(SystemConstants.CURRENT_BRANCH)
      .replace(/"/gi, "");
    params.push(param4);

    let _data = await this._service
      .getDataOutput(
        Global.DATA_ENDPOINT,
        BravoCtorEnum.StoreProcedure,
        "usp_NEW_CheckAuxiliaryMaterialsBuget",
        params,
      )
      .toPromise()
      .then();

    this.output = <Array<Object>>_data["output"];
    this._errBCTC = this.output["@_Error"];
    this._errMess = this.output["@_ErrorMessage"];
  }

  // Các rule chặn Lưu / Gửi duyệt; trả về thông báo lỗi, rỗng = được lưu
  async validateBeforeSave(): Promise<string> {
    // Chưa có version được duyệt → lưu bình thường, không cần "Tải dữ liệu"
    await this.checkApprovedVersion();
    if (this.mustLoadBeforeInput()) return MSG_MUST_LOAD;

    let errs: string[] = [];
    let customers = await this.codesNotInCatalog("CustomerCode");
    if (customers.length > 0)
      errs.push("Mã đối tượng không có trong danh mục: " + customers.join(", "));
    let itemGroups = await this.codesNotInCatalog("ItemGroupCode");
    if (itemGroups.length > 0)
      errs.push("Mã nhóm hàng không có trong danh mục: " + itemGroups.join(", "));
    return errs.join("\n");
  }

  // Mã trên lưới chi tiết không tra được trong danh mục (cùng lookupKey + lookupfilter của cột)
  async codesNotInCatalog(binding: string): Promise<string[]> {
    let col = this._layoutDeclare.childColumns.find((c) => c.binding == binding);
    let cv = this.grid.collectionView;
    let codes: string[] = [];
    for (let item of cv ? cv.sourceCollection : []) {
      let code = item && item[binding] ? item[binding].toString().trim() : "";
      if (code && item["IsTitleRow"] != true && codes.indexOf(code) < 0) codes.push(code);
    }

    let found: string[] = [];
    // Chia lô để không vượt số dòng tối đa lookup trả về
    for (let i = 0; i < codes.length; i += 30) {
      let batch = codes.slice(i, i + 30);
      let filter =
        "(" + col.lookupfilter + ") AND Code IN (" +
        batch.map((c) => "N'" + c.replace(/'/g, "''") + "'").join(",") + ")";
      let data: any[] = await this._service
        .getLookupNew(Global.LookupEndpoint, col.lookupKey, "", filter, "", batch.length)
        .toPromise();
      for (let d of data || []) found.push((d["ValueMember"] + "").trim().toUpperCase());
    }
    return codes.filter((c) => found.indexOf(c.toUpperCase()) < 0);
  }

  // Gói thầu đã có ít nhất 1 Kế hoạch vật tư phụ hoàn thiện duyệt (khác phiếu đang mở)?
  async checkApprovedVersion() {
    let productCostId = this.editorFrm.get("ProductCostId").value;
    if (!productCostId) {
      this.hasApprovedVersion = false;
      return;
    }

    let id = Number(this.id) > 0 ? Number(this.id) : -1;
    let filter =
      "ProductCostId = '" + productCostId.toString().replace(/'/g, "''") + "'" +
      " AND BranchCode = '{VAR=Branch.Ma_Dvcs}' AND DocCode = 'L2' AND BudgetTypeCode = '6'" +
      " AND IsActive = 1 AND CompletedApprove = 1 AND Id <> " + id;

    let count = await this._explorerService
      .getCountData(Global.DataExplorerEndpoint, "vB30Budget", filter)
      .toPromise();
    this.hasApprovedVersion = Number(count) > 0;
  }

  // Bắt buộc "Tải dữ liệu": đã có version duyệt nhưng lưới chi tiết chưa có dòng tải từ version trước (IsLink)
  mustLoadBeforeInput(): boolean {
    if (!this.hasApprovedVersion || this.taidulieu) return false;

    let cv = this.grid.collectionView;
    let rows: any[] = cv ? cv.sourceCollection : [];
    return !rows.some((r) => r && r["IsLink"] == true);
  }

  protected deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    if (flex) {
      // get list of selected items
      var selected = [];
      let _skipLink = false;

      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;
        for (var i = 0; i < flex.rows.length; i++) {
          if (i == _idrowdel) {
            let data = flex.rows[i].dataItem;
            // Không xóa những dòng là tiêu đề
            if (
              data &&
              (data["IsPO"] == true || data["IsPO"] == 1 || data["IsPO"] == 1)
            ) {
              continue;
            }
            // Không xóa những dòng tải từ version đã duyệt
            if (data && data["IsLink"] == true) {
              _skipLink = true;
              continue;
            }
            selected.push(data);
            break;
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }

      if (_skipLink)
        alert("Không được xóa các dòng dữ liệu được tải ra từ version đã duyệt (Link).");
    }
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open(
      "",
      "_blank",
      "top=0,left=0,height=100%,width=auto",
    );
    let html = this.printVoucher(input);

    html.then((data) => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }
}
