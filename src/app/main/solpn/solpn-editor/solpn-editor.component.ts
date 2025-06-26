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
import { LayoutSolPNEditor } from "../Layout";
import { Title } from "@angular/platform-browser";
import { Location } from "../../../../../node_modules/@angular/common";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { ParameterContract } from "../../../contracts/parameter.contract";
import { Global } from "../../../shared/global";
import { BravoCtorEnum } from "../../../core/enum/type.enum";

@Component({
  selector: "app-solpn-editor-form",
  templateUrl: "./solpn-editor.component.html",
  styleUrls: ["./solpn-editor.component.css"],
})
export class SolPNEditorComponent
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

  indexPage = ["/main", "solpn", "index"];
  indexPage_Editor = ["/main", "solpn", "detail"];
  folderName = "Phieu_Nhap_Kho";

  constructor(
    service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title,
    private _location: Location
  ) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutSolPNEditor(service, this.parentData);
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
      this.grid5,
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

  output: any;
  _err: boolean = false;
  _errMess: any;

  async checkData(formData: any) {
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName("Id");
    param1.ParameterValue = this.id;
    params.push(param1);

    try {
      let paramXML = new ParameterContract();
      paramXML.ParameterName = this.convertParameterName(
        "B30BizDocContactInfo"
      );
      paramXML.ParameterValue = "B30BizDocContactInfo";
      params.push(paramXML);

      let ds = Global.getDataSetContract({
        name: "B30BizDocContactInfo",
        collection: Global.createColection(this.grid3.itemsSource),
      });
      let _data = await this._service
        .postXML(
          Global.DATA_ENDPOINT,
          BravoCtorEnum.StoreProcedure,
          "usp_B30AccDocEquip_CheckBilPaySupp",
          params,
          ds
        )
        .toPromise()
        .then();

      this.output = <Array<Object>>_data["output"];
      this._err = this.output["@_Error"];
      this._errMess = this.output["@_ErrorMessage"];
    } catch (ex) {
      console.log(ex);
    }
  }

  onSubmit(formData: any, isApproveSend?: boolean, closePO?: boolean) {
    let _errDanhGia: Boolean = false;
    let _errRemark: Boolean = false;
    let _errDes: Boolean = false;
    let _errorSave1: Boolean = false;
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

    if (_numEror == 0) {
      if (isApproveSend == true) {
        if (_errDes == false) {
          if (_errorSave1 == false) {
            if (_errRemark == false) {
              this.checkData(formData).then(() => {
                if (this._err == false) {
                  this.submit(formData, this.indexPage, isApproveSend).then(
                    () => {
                      if (this.allowSendMail) {
                        this.sendMail(formData, "N3", this.id, false, "1");
                      }
                    }
                  );
                } else {
                  alert(this._errMess);
                  this.showLoading = false;
                }
              });
            } else
              alert("Yêu cầu nhập Diễn giải khi đánh giá 1 sao hoặc 2 sao");
          } else
            alert("Mã nhân viên quy trình duyệt, không được bỏ trắng giá trị");
        } else alert("Tài liệu đính kèm cần có dữ liệu để lưu.");
      } else this.submit(formData, this.indexPage_Editor);
    } else alert("Chi tiết nhập hàng cần có liệu để lưu.");
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
