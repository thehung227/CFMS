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
import { LayoutExAuxiliarySuppliesEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: "app-exauxiliarysupplies-editor-form",
  templateUrl: "./exauxiliarysupplies-editor.component.html",
  styleUrls: ["./exauxiliarysupplies-editor.component.css"],
})
export class ExAuxiliarySuppliesEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("grid1") grid1: wjcGrid.FlexGrid;
  @ViewChild("grid2") grid2: wjcGrid.FlexGrid;
  @ViewChild("grid3") grid3: wjcGrid.FlexGrid;
  @ViewChild("grid4") grid4: wjcGrid.FlexGrid;
  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;

  indexPage = ["/main", "exauxiliarysupplies", "index"];
  indexPage_Editor = ["/main", "exauxiliarysupplies", "detail"];
  folderName = "Phieu_Xuat_Kho";
  output: Array<Object>;
  _errBCTC: boolean = false;
  _errMess: string;

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
    this._layoutDeclare = new LayoutExAuxiliarySuppliesEditor(
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
    this.grid2.allowAddNew = false;
    this.grid3.allowAddNew = false;
    this.grid.allowAddNew = false;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid4);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();

    this.grid.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let column = e.panel.columns[e.col].binding;
        let data = s.rows[e.row].dataItem;

       
        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (column == 'Quantity9' && data["IsTitleRow"] == false) {
                      wjcCore.setCss(e.cell, {
                        color: 'red',
                        fontWeight: 'bold',
                        backgroundColor: ''
                      });
                    }
          else
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "blue",
              fontWeight: "bold",
            });
          } else
           {
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

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean, closePO?: boolean) {
    let _errDes: Boolean = false;
    let _errorSave1: Boolean = false;
    let _numEror = 0;

    if (this.grid1.itemsSource.items.length > 0) {
      for (let item of this.grid1.itemsSource.items) {
        if (!item["Description"] || !item["FilePath"]) {
          _errDes = true;
          break;
        }
      }
    }

    for (let item of this.grid3.itemsSource.items) {
      if (item["EmployeeCode"] == "") {
        _errorSave1 = true;
        break;
      } else if (
        item["EmployeeCode"].toString().indexOf(",") > 0 &&
        item["EmployeeCodeReal"] == ""
      ) {
        _errorSave1 = true;
        break;
      }
    }

    if (this.gridArray[0].itemsSource.items.length == 0) {
      _numEror += 1;
    }

    let _errorTonKho = false;
    for (let item of this.grid.itemsSource.items) {
      if (
        item["Quantity1"] < item["Quantity2"] + item["Quantity9"] &&
        item["IsTitleRow"] == false
      ) {
        _errorTonKho = true;
        break;
      }
    }

    console.log("_errorTonKho", _errorTonKho);
    if (_numEror == 0) {
      if (_errorTonKho == false) {
        if (isApproveSend == true) {
          this.checkNhapLieu(formData).then(() => {
            if (this._errBCTC == false) {
              if (_errDes == false) {
                if (_errorSave1 == false) {
                  this.submit(formData, this.indexPage, isApproveSend).then(
                    () => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, "X3", this.id, false, "1");
                      }
                    },
                  );
                } else
                  alert(
                    "Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị",
                  );
              } else alert("Tài liệu đính kèm cần có dữ liệu để lưu.");
            } else {
              alert(this._errMess);
              this.showLoading = false;
            }
          });
        } else this.submit(formData, this.indexPage_Editor);
      } else alert("Khối lượng tồn kho không đủ để xuất.");
    } else alert("Chi tiết xuất hàng cần có liệu để lưu.");
  }

  async checkNhapLieu(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName("ProductCostId");
    param1.ParameterValue = formData.value["ProductCostId"];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName("BranchCode");
    param2.ParameterValue = localStorage
      .getItem(SystemConstants.CURRENT_BRANCH)
      .replace(/"/gi, "");
    params.push(param2);

    param3.ParameterName = Global.convertParameterName("Id");
    param3.ParameterValue = this.id;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName("UserId");
    param4.ParameterValue = localStorage
      .getItem(SystemConstants.CURRENT_USERID)
      .replace(/"/gi, "");
    params.push(param4);

    let _data = await this._service
      .getDataOutput(
        Global.DATA_ENDPOINT,
        BravoCtorEnum.StoreProcedure,
        "usp_CTC_CheckPhieuXuatKho",
        params,
      )
      .toPromise()
      .then();

    this.output = <Array<Object>>_data["output"];
    this._errBCTC = this.output["@_Error"];
    this._errMess = this.output["@_ErrorMessage"];
  }

  showDocumentInNewTab(bizdocid: string) {
    let id = bizdocid.substring(3, bizdocid.length - 2);
    let _command = "usp_B30BizDoc_VoucherForm";
    let _wordName = "BM-F006a-Rev01 Don Dat Hang.docx";
    let _folderPath = "/3.Mau_In/{VAR=Branch.Ma_Dvcs}/";
    let _fileName = "Đơn hàng mua";

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
