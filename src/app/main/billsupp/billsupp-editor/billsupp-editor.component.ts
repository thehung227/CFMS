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
import { LayoutBillSuppEditor } from "../DeclareLayout";
import { Title } from "@angular/platform-browser";
import { LayoutPrinter } from "../billsupp-explorer/billsupp-printer.data";
import { CryptoExtension } from "../../../core/extensions/crypto.extension";
import { BravoCtorEnum } from "../../../core/enum/type.enum";
import { Global } from "../../../shared/global";
import { SystemConstants } from "../../../core/common/system.constants";
import { ParameterContract } from "../../../contracts/parameter.contract";

@Component({
  selector: "app-billsupp-editor-form",
  templateUrl: "./billsupp-editor.component.html",
  styleUrls: ["./billsupp-editor.component.css"],
})
export class BillSuppEditorComponent
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

  @ViewChild("gridPrint") gridPrint: wjcGrid.FlexGrid;
  layoutPrint: LayoutPrinter = new LayoutPrinter();

  indexPage = ["/main", "billsupp", "index"];
  indexPage_Editor = ["/main", "billsupp", "detail"];

  constructor(
    service: BaseEditorService,
    route: ActivatedRoute,
    pcs: PanelControlService,
    elRef: ElementRef,
    router: Router,
    titleService: Title
  ) {
    super(service, route, pcs, elRef, router, titleService);
    this._layoutDeclare = new LayoutBillSuppEditor(service, this.parentData);
    this._layoutPrinter = this.layoutPrint.Layout;
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
    this.init().then(() => this.refreshTongThanhToan3Ben());
    this.grid3.allowAddNew = false;
    this.initGridThanhToan3Ben();
  }

  // Tab "Thanh toán 3 bên": dữ liệu nạp từ hợp đồng, chỉ được nhập "Thanh toán kỳ này", không thêm/xóa dòng
  initGridThanhToan3Ben() {
    this.grid5.allowAddNew = false;
    this.grid5.allowDelete = false;

    // Giữ giá trị trước khi sửa/dán để trả lại khi nhập vượt giới hạn
    let _oldPayAmount = 0;
    const _beginEdit = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
      if (s.columns[e.col].binding != "PayAmount") { e.cancel = true; return; }
      let _item = s.rows[e.row] ? s.rows[e.row].dataItem : null;
      _oldPayAmount = _item ? Number(_item["PayAmount"] || 0) : 0;
    };
    this.grid5.beginningEdit.addHandler(_beginEdit);
    this.grid5.pastingCell.addHandler(_beginEdit);

    const _calcPayAmount = (s: wjcGrid.FlexGrid, e: wjcGrid.CellRangeEventArgs) => {
      if (s.columns[e.col].binding == "PayAmount") this.calcPayAmountThanhToan3Ben(e.row, _oldPayAmount);
    };
    this.grid5.cellEditEnded.addHandler(_calcPayAmount);
    this.grid5.pastedCell.addHandler(_calcPayAmount);
  }

  // Đầu phiếu: Tổng giá trị thanh toán 3 bên (= tổng "Thanh toán kỳ này" của tab 3 bên) và Số tiền còn lại
  async refreshTongThanhToan3Ben() {
    await this.dfpanel.runConstraint("Evaluator_Amount_TT3Ben_Calculate");
    await this.dfpanel.runConstraint("Evaluator_Amount_ConLaiTT3Ben_Calculate");
  }

  // Thanh toán kỳ này: nhập trực tiếp. Tổng "Thanh toán kỳ này" của tab 3 bên không được vượt
  // Giá trị đề nghị thanh toán (gồm VAT) của Bill -> vượt thì trả lại giá trị cũ.
  // Tổng cộng = kỳ trước + kỳ này. Server tính lại lũy kế kỳ trước sau khi lưu.
  calcPayAmountThanhToan3Ben(row: number, oldValue: number) {
    let _item = this.grid5.rows[row] ? this.grid5.rows[row].dataItem : null;
    if (!_item) return;

    let _isVND = this.editorFrm.get("CurrencyCode").value == "VND";
    let _amount = Number(_item["PayAmount"] || 0);
    let _value = _isVND ? Math.round(_amount) : Math.round(_amount * 100) / 100;

    if (_value != oldValue) {
      let _limit = Number(this.editorFrm.get("Amount_DeNghiTT").value || 0);
      let _others = this.sumPayAmountThanhToan3Ben(_item);
      if (_others + _value > _limit) {
        alert(
          'Tổng "Thanh toán kỳ này" của tab Thanh toán 3 bên (' + this.formatAmountThanhToan3Ben(_others + _value) +
          ") không được lớn hơn Giá trị đề nghị thanh toán (gồm VAT) của Bill (" + this.formatAmountThanhToan3Ben(_limit) +
          ").\nDòng này được nhập tối đa: " + this.formatAmountThanhToan3Ben(Math.max(_limit - _others, 0))
        );
        _value = oldValue;
      }
    }

    this.grid5.setCellData(row, this.grid5.columns.getColumn("PayAmount").index, _value);
    this.grid5.setCellData(row, this.grid5.columns.getColumn("PayAmountTotal").index, Number(_item["PayAmountPrev"] || 0) + _value);
    this.refreshTongThanhToan3Ben();
  }

  // Tổng "Thanh toán kỳ này" của tab 3 bên (bỏ qua dòng exclude nếu có), làm tròn 2 số lẻ để tránh sai số cộng số thực
  sumPayAmountThanhToan3Ben(exclude?: any): number {
    let _sum = 0;
    let _items = this.grid5.itemsSource ? this.grid5.itemsSource.items : [];
    for (let item of _items) {
      if (item !== exclude) _sum += Number(item["PayAmount"] || 0);
    }
    return Math.round(_sum * 100) / 100;
  }

  formatAmountThanhToan3Ben(value: number): string {
    return wjcCore.Globalize.format(value, this.editorFrm.get("CurrencyCode").value == "VND" ? "n0" : "n2");
  }

  // Chặn lưu khi tổng "Thanh toán kỳ này" của tab 3 bên > Giá trị đề nghị thanh toán (gồm VAT):
  // đầu phiếu có thể bị sửa (giảm) sau khi đã nhập tab 3 bên nên kiểm tra lúc nhập là chưa đủ
  checkTongThanhToan3Ben(): boolean {
    let _limit = Number(this.editorFrm.get("Amount_DeNghiTT").value || 0);
    let _total = this.sumPayAmountThanhToan3Ben();
    if (_total <= _limit || _limit < 0) return true;

    alert(
      'Tổng "Thanh toán kỳ này" của tab Thanh toán 3 bên (' + this.formatAmountThanhToan3Ben(_total) +
      ") đang lớn hơn Giá trị đề nghị thanh toán (gồm VAT) của Bill (" + this.formatAmountThanhToan3Ben(_limit) +
      ").\nĐiều chỉnh lại tab Thanh toán 3 bên trước khi lưu."
    );
    return false;
  }

  async loadThanhToan3Ben() {
    this.showLoading = true;
    try {
      await this.dfpanel.runConstraint("Evaluator_ServerConstraint_Load_TT3Ben");
    } finally {
      this.showLoading = false;
    }
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
              color: "",
              fontWeight: "bold",
              backgroundColor: "#CCF381",
            });
          } else if (data["NoChangeInBill"] == false) {
            wjcCore.setCss(e.cell, {
              color: "red",
              fontWeight: "",
              // fontWeight: '',
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
    this.grid1.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "",
              fontWeight: "bold",
              backgroundColor: "#CCF381",
            });
          } else if (data["NoChangeInBill"] == false) {
            wjcCore.setCss(e.cell, {
              color: "red",
              fontWeight: "",
              // fontWeight: '',
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
    this.grid2.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "",
              fontWeight: "bold",
              backgroundColor: "#CCF381",
            });
          } else if (data["NoChangeInBill"] == false) {
            wjcCore.setCss(e.cell, {
              color: "red",
              fontWeight: "",
              // fontWeight: '',
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
    this.grid3.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "",
              fontWeight: "bold",
              backgroundColor: "#CCF381",
            });
          } else if (data["NoChangeInBill"] == false) {
            wjcCore.setCss(e.cell, {
              color: "red",
              fontWeight: "",
              // fontWeight: '',
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
    this.grid4.formatItem.addHandler((s, e: wjcGrid.FormatItemEventArgs) => {
      if (s.rows[e.row] != undefined && s.rows[e.row]._data != undefined) {
        let data = s.rows[e.row].dataItem;

        if (e.panel.cellType == wjcGrid.CellType.Cell) {
          if (data["IsTitleRow"] == true) {
            wjcCore.setCss(e.cell, {
              color: "",
              fontWeight: "bold",
              backgroundColor: "#CCF381",
            });
          } else if (data["NoChangeInBill"] == false) {
            wjcCore.setCss(e.cell, {
              color: "red",
              fontWeight: "",
              // fontWeight: '',
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

  onSubmit(formData: any) {
    if (!this.checkTongThanhToan3Ben()) return;

    this.showLoading = true;
    //if (this.taidulieu == true || this.id > 0) {
    let _errorSave1 = false;
    for (let item of this.grid.itemsSource.items) {
      if (
        (item["PartNo"] == "R8100" || item["PartNo"] == "R8101") &&
        item["CustomerCode"] == ""
      ) {
        _errorSave1 = true;
        break;
      }
    }

    let _errorSave2 = false;
    for (let item of this.grid2.itemsSource.items) {
      if (
        (item["PartNo"] == "" ||
          item["CustomerCode"] == "" ||
          item["BizDocId_C1"] == "") &&
        item["IsTitleRow"] == false
      ) {
        _errorSave2 = true;
        break;
      }
    }

    this.checkUniqueColGrid(this.grid, "ItemNo");
    if (_errorSave1 == false) {
      if (_errorSave2 == false) {
        if (this._errorUnique == false) {
          this.submit(formData, this.indexPage_Editor);
        } else
          alert(
            "Số thứ tự không được trùng hoặc bỏ trống, giá trị: " +
              this._valueDuplicate
          );
      } else
        alert(
          'Yêu cầu nhập đầy đủ Mã Quản lý KL, mã Đội (+/-), Id hợp đồng ở Tab "+ Bill"'
        );
    } else alert("Yêu cầu nhập đầy đủ mã Đội (+/-)");
    //}
    //else
    //  alert('Yêu cầu "Tải dữ liệu" trước khi lập chi tiết khối lượng thanh toán');
  }

  showPrintVoucher(input: any) {
    let popupWin = window.open(
      "",
      "_blank",
      "top=0,left=0,height=100%,width=auto"
    );
    let html = this.printVoucher(input);

    html.then((data) => {
      popupWin.document.write(data);
      popupWin.document.close();
    });
  }

  ngOnDestroy() {
    this.destroy();
  }

  async loadAmountBill() {
    if (this._layoutDeclare.serverUpdating)
      for (let command of this._layoutDeclare.serverUpdating) {
        await this.dfpanel.runConstraint(command).then();
      }
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_KHKK_BCTC').then();
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Amount_HDPL').then();
  }

  deleteSelectedRows(flex: wjcGrid.FlexGrid) {
    this.dfpanel
      .runConstraint("Evaluator_ServerConstraint_Check_ApproveSent_NotChange")
      .then();
    if (flex) {
      var selected = [];
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          let _id = flex.selectedRows[k].dataItem["Id"];
          let _ktrow = flex.selectedRows[k].dataItem["NoChangeInBill"];

          for (var i = 0; i < flex.rows.length; i++) {
            if (
              i == _idrowdel &&
              (_ktrow == false || _ktrow == null || _ktrow == undefined)
            ) {
              //(_id < 0 || _id == null || _id == undefined) &&
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
    }
  }

  deleteSelectedRows1(flex: wjcGrid.FlexGrid) {
    // this.dfpanel.runConstraint('Evaluator_ServerConstraint_Check_ApproveSent_NotChange').then();
    if (flex) {
      var selected = [];
      console.log(selected);
      for (let k in flex.selectedRows) {
        let _idrowdel = flex.selectedRows[k]._idx;

        if (flex.selectedRows[k].dataItem != undefined) {
          let _id = flex.selectedRows[k].dataItem["Id"];
          let _ktrow = flex.selectedRows[k].dataItem["NoChangeInBill"];

          for (var i = 0; i < flex.rows.length; i++) {
            if (i == _idrowdel) {
              //(_id < 0 || _id == null || _id == undefined) &&
              selected.push(flex.rows[i].dataItem);
              break;
            }
          }
        }
      }

      for (var i = 0; i < selected.length; i++) {
        flex.itemsSource.remove(selected[i]);
      }
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
    console.log(navigateUrl.join("/"))
  }

  showDocumentInNewTab2(id: any) {
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
    console.log(navigateUrl.join("/"))
  }

  showDocumentInNewTab1(id: any) {
    //exportHtml(layoutPrint.WordName,layoutPrint.FileName, layoutPrint.FolderPath, parentData?.Id_TT)
    let _command = this._layoutDeclare.layout.PrintDocument.Command_TongHop;

    let _wordName =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].WordName;
    let _folderPath =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].FolderPath;
    let _fileName =
      this._layoutDeclare.layout.PrintDocument.LayoutPrint[3].FileName;
    console.log(_wordName);
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

  output1: Array<Object>;
  _errCheck: boolean = false;
  _errMess1: string;

  async checkQuanLyKhoiLuong(formData: any) {
    this.showLoading = true;
    let params = new Array<ParameterContract>();
    const param1 = new ParameterContract();
    const param2 = new ParameterContract();
    const param3 = new ParameterContract();
    const param4 = new ParameterContract();
    const param5 = new ParameterContract();
    const param6 = new ParameterContract();

    param1.ParameterName = Global.convertParameterName('ProductCostId');
    param1.ParameterValue = formData.value['ProductCostId'];
    params.push(param1);

    param2.ParameterName = Global.convertParameterName('BranchCode');
    param2.ParameterValue = localStorage.getItem(SystemConstants.CURRENT_BRANCH).replace(/"/gi, '');
    params.push(param2);

    param3.ParameterName = Global.convertParameterName('Id');
    param3.ParameterValue = this.id;
    params.push(param3);

    param4.ParameterName = Global.convertParameterName('ParentBizDocId');
    param4.ParameterValue = this.parentData['ParentBizDocId'];
    params.push(param4);

    param5.ParameterName = Global.convertParameterName('DocCode');
    param5.ParameterValue = this.parentData['DocCode'];
    params.push(param5);

    param6.ParameterName = Global.convertParameterName('IsCheckSave');
    param6.ParameterValue = 1;
    params.push(param6);

    let _data = await this._service.getDataOutput(Global.DATA_ENDPOINT, BravoCtorEnum.StoreProcedure, 'usp_CheckHopDong_TheoDoiKhoiLuong', params)
      .toPromise().then();

    this.output1 = <Array<Object>>(_data['output']);
    this._errCheck = this.output1['@_Error'];
    // Nội dung trả về ngăn cách các câu bằng '||' -> tách thành mỗi câu một dòng (\n) khi hiển thị
    let _rawMess = this.output1['@_ErrorMessage'];
    this._errMess1 = _rawMess
      ? String(_rawMess).split('||').map(s => s.trim()).filter(s => s.length > 0).join('\n')
      : _rawMess;

    if (this._errCheck) {
      alert(this._errMess1 + '. Kiểm tra lại Kế hoạch Khối lượng');
      this.showLoading = false;
    }
    else {
      alert('Kiểm tra Kế hoạch Khối lượng thành công, không có lỗi!');
      this.showLoading = false;
    }
  }
}
