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
import { LayoutImAuxiliarySuppliesEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: "app-imauxiliarysupplies-editor-form",
  templateUrl: "./imauxiliarysupplies-editor.component.html",
  styleUrls: ["./imauxiliarysupplies-editor.component.css"],
})
export class ImAuxiliarySuppliesEditorComponent
  extends BaseEditorComponent
  implements OnInit, OnDestroy
{
  @ViewChild("grid") grid: wjcGrid.FlexGrid;
  @ViewChild("grid1") grid1: wjcGrid.FlexGrid;
  @ViewChild("grid2") grid2: wjcGrid.FlexGrid;
  @ViewChild("grid3") grid3: wjcGrid.FlexGrid;
  @ViewChild("grid4") grid4: wjcGrid.FlexGrid;
  @ViewChild("dfpanel") _dfpanel: DynamicFormPanelComponent;

  indexPage = ["/main", "imauxiliarysupplies", "index"];
  indexPage_Editor = ["/main", "imauxiliarysupplies", "detail"];
  folderName = "Phieu_Nhap_Kho";

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
    this._layoutDeclare = new LayoutImAuxiliarySuppliesEditor(
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
    this.grid1.allowAddNew = false;
    this.grid2.allowAddNew = false;
    this.grid3.allowAddNew = false;
    this.grid4.isReadOnly = true;

    this.dbClickCellContent(this.grid4);
  }

  ngAfterViewInit() {
    this.dfpanel = this._dfpanel;
    this.afterViewInit();
  }

  backClick() {
    this._location.back();
  }

  ngOnDestroy() {
    this.destroy();
  }

  onSubmit(formData: any, isApproveSend?: boolean, closePO?: boolean) {
    let _errDanhGia: Boolean = false;
    let _errRemark: Boolean = false;
    let _errDes: Boolean = false;
    let _errorSave1: Boolean = false;
    let _errorSave: Boolean = false;
    let _numEror = 0;

    for (let item of this.grid2.itemsSource.items) {
      if (
        item["Bad"] == false &&
        item["Star2"] == false &&
        item["Normal"] == false &&
        item["Star4"] == false &&
        item["Good"] == false
      ) {
        _errDanhGia = true;
        break;
      }
    }

    for (let item of this.grid2.itemsSource.items) {
      if (
        (item["Bad"] == true || item["Star2"] == true) &&
        item["Normal"] == false &&
        item["Star4"] == false &&
        item["Good"] == false &&
        (item["Remark"] == "" || item["Remark"] == undefined)
      ) {
        _errRemark = true;
        break;
      }
    }

    if (this.grid1.itemsSource.items.length == 0) {
      _errDes = true;
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

    if (_numEror == 0) {
      if (isApproveSend == true) {
        this.checkNhapLieu(formData).then(() => {
          if (this._errBCTC == false) {
            if (_errDes == false) {
              if (_errorSave1 == false) {
                if (_errRemark == false) {
                  for (let item of this.grid1.itemsSource.items) {
                    if (
                      item["Attached"] == true &&
                      (item["FilePath"] == "" || item["FilePath"] == undefined)
                    ) {
                      _errorSave = true;
                      break;
                    }
                  }
                  if (_errorSave) {
                    alert("Yêu cầu đính kèm tài liệu trước khi gửi duyệt!");
                  } else {
                    this.submit(formData, this.indexPage, isApproveSend).then(
                      () => {
                        if (this.allowSendMail) {
                          this.sendMail(formData, "N3", this.id, false, "1");
                        }
                      },
                    );
                  }
                } else
                  alert("Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao");
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
    } else alert("Chi tiết nhập hàng cần có liệu để lưu.");
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
        "usp_CTC_CheckPhieuNhapKho",
        params,
      )
      .toPromise()
      .then();

    this.output = <Array<Object>>_data["output"];
    this._errBCTC = this.output["@_Error"];
    this._errMess = this.output["@_ErrorMessage"];
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
